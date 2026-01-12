"""Admin decorators for role-based access control"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.models import User

def admin_required(fn):
    """
    Decorator to require admin access (content_manager or super_admin)
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        if not user.is_admin():
            return jsonify({
                'success': False,
                'message': 'Admin access required'
            }), 403
        
        return fn(*args, **kwargs)
    
    return wrapper


def super_admin_required(fn):
    """
    Decorator to require super admin access
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        if not user.is_super_admin():
            return jsonify({
                'success': False,
                'message': 'Super admin access required'
            }), 403
        
        return fn(*args, **kwargs)
    
    return wrapper


def permission_required(permission):
    """
    Decorator to require a specific permission
    Usage: @permission_required('manage_products')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 404
            
            if not user.has_permission(permission):
                return jsonify({
                    'success': False,
                    'message': f'Permission required: {permission}'
                }), 403
            
            return fn(*args, **kwargs)
        
        return wrapper
    return decorator


# Permission constants for content managers
PERMISSIONS = {
    'MANAGE_CONTENT': 'manage_content',  # Blog posts, pages
    'MANAGE_MEDIA': 'manage_media',  # Upload, edit media
    'MANAGE_INQUIRIES': 'manage_inquiries',  # Respond to contact forms
    'VIEW_CUSTOMERS': 'view_customers',  # View customer profiles
    'MANAGE_PRODUCTS': 'manage_products',  # Edit products
    'MANAGE_COLLECTIONS': 'manage_collections',  # Manage collections
}
