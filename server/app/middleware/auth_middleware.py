"""Authentication and authorization middleware"""

from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask import jsonify
from app.models import User


def admin_required(fn):
    """Decorator to require admin role"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'admin':
            return jsonify({
                'success': False,
                'message': 'Admin access required'
            }), 403

        return fn(*args, **kwargs)
    return wrapper


def customer_only(fn):
    """Decorator to require customer role (not admin)"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'customer':
            return jsonify({
                'success': False,
                'message': 'Customer access only'
            }), 403

        return fn(*args, **kwargs)
    return wrapper


def get_current_user():
    """Helper to get current authenticated user"""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        return User.query.get(user_id)
    except:
        return None


def check_user_role(required_role):
    """Check if current user has required role"""
    user = get_current_user()
    if not user:
        return False
    return user.role == required_role
