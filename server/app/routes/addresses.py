"""Address routes"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import UserAddress
from app.utils.responses import (
    success_response, error_response, created_response, not_found_response
)

bp = Blueprint('addresses', __name__, url_prefix='/api/v1/addresses')


@bp.route('', methods=['GET'])
@jwt_required()
def get_addresses():
    """Get all addresses for current user"""
    try:
        user_id = get_jwt_identity()
        addresses = UserAddress.query.filter_by(user_id=user_id).all()

        return success_response(
            data=[addr.to_dict() for addr in addresses],
            message="Addresses retrieved successfully"
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/<address_id>', methods=['GET'])
@jwt_required()
def get_address(address_id):
    """Get specific address"""
    try:
        user_id = get_jwt_identity()
        address = UserAddress.query.filter_by(id=address_id, user_id=user_id).first()

        if not address:
            return not_found_response("Address not found")

        return success_response(data=address.to_dict())
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('', methods=['POST'])
@jwt_required()
def create_address():
    """Create new address"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate required fields
        required_fields = ['full_name', 'phone', 'address_line1', 'city', 'country']
        for field in required_fields:
            if not data.get(field):
                return error_response(f"{field} is required", status_code=400)

        # If this is set as default, unset other defaults
        if data.get('is_default'):
            UserAddress.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})

        # Create address
        address = UserAddress(
            user_id=user_id,
            full_name=data['full_name'],
            phone=data['phone'],
            address_line1=data['address_line1'],
            address_line2=data.get('address_line2'),
            city=data['city'],
            state_province=data.get('state_province'),
            postal_code=data.get('postal_code'),
            country=data['country'],
            address_type=data.get('address_type', 'both'),
            is_default=data.get('is_default', False)
        )

        db.session.add(address)
        db.session.commit()

        return created_response(
            data=address.to_dict(),
            message="Address created successfully"
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/<address_id>', methods=['PUT'])
@jwt_required()
def update_address(address_id):
    """Update address"""
    try:
        user_id = get_jwt_identity()
        address = UserAddress.query.filter_by(id=address_id, user_id=user_id).first()

        if not address:
            return not_found_response("Address not found")

        data = request.get_json()

        # If setting as default, unset other defaults
        if data.get('is_default') and not address.is_default:
            UserAddress.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})

        # Update fields
        updatable_fields = [
            'full_name', 'phone', 'address_line1', 'address_line2',
            'city', 'state_province', 'postal_code', 'country',
            'address_type', 'is_default'
        ]

        for field in updatable_fields:
            if field in data:
                setattr(address, field, data[field])

        db.session.commit()

        return success_response(
            data=address.to_dict(),
            message="Address updated successfully"
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/<address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id):
    """Delete address"""
    try:
        user_id = get_jwt_identity()
        address = UserAddress.query.filter_by(id=address_id, user_id=user_id).first()

        if not address:
            return not_found_response("Address not found")

        db.session.delete(address)
        db.session.commit()

        return success_response(message="Address deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/<address_id>/set-default', methods=['PUT'])
@jwt_required()
def set_default_address(address_id):
    """Set address as default"""
    try:
        user_id = get_jwt_identity()
        address = UserAddress.query.filter_by(id=address_id, user_id=user_id).first()

        if not address:
            return not_found_response("Address not found")

        # Unset all other defaults
        UserAddress.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})

        # Set this as default
        address.is_default = True
        db.session.commit()

        return success_response(
            data=address.to_dict(),
            message="Default address updated"
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)
