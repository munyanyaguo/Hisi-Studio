"""Authentication routes"""

from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from app.extensions import db
from app.models import User
from app.utils.validators import validate_request, validate_registration_data, validate_login_data
from app.utils.rate_limit import rate_limit
from app.utils.responses import (
    success_response, error_response, created_response,
    not_found_response, unauthorized_response, forbidden_response
)
from datetime import datetime

bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')


@bp.route('/register', methods=['POST'])
@rate_limit(max_requests=5, window_seconds=300)  # 5 registrations per 5 minutes
@validate_request(validate_registration_data)
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        # Check if user already exists
        if User.query.filter_by(email=data['email'].lower()).first():
            return error_response('Email already registered', status_code=409)

        # Create new user
        user = User(
            email=data['email'].lower(),
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            role='customer'
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return created_response(
            data={
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            },
            message='User registered successfully'
        )

    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/login', methods=['POST'])
@rate_limit(max_requests=10, window_seconds=60)  # 10 login attempts per minute
@validate_request(validate_login_data)
def login():
    """Login user"""
    try:
        data = request.get_json()

        # Find user
        user = User.query.filter_by(email=data['email'].lower()).first()
        if not user or not user.check_password(data['password']):
            return unauthorized_response('Invalid email or password')

        # Check if user is active
        if not user.is_active:
            return forbidden_response('Account is deactivated')

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return success_response(
            data={
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            },
            message='Login successful'
        )

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        user_id = get_jwt_identity()
        access_token = create_access_token(identity=user_id)

        return success_response(data={'access_token': access_token})

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return not_found_response('User not found')

        return success_response(data={'user': user.to_dict()})

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return not_found_response('User not found')

        data = request.get_json()

        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'phone']
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()

        return success_response(
            data={'user': user.to_dict()},
            message='Profile updated successfully'
        )

    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return not_found_response('User not found')

        data = request.get_json()

        # Validate required fields
        if not data.get('current_password') or not data.get('new_password'):
            return error_response('Current and new password are required', status_code=400)

        # Verify current password
        if not user.check_password(data['current_password']):
            return unauthorized_response('Current password is incorrect')

        # Update password
        user.set_password(data['new_password'])
        db.session.commit()

        return success_response(message='Password changed successfully')

    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)
