"""Section Content API routes - Admin-editable website sections"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import SectionContent, User
from app.utils.responses import (
    success_response, error_response, created_response,
    not_found_response, forbidden_response
)
import json

bp = Blueprint('section_content', __name__, url_prefix='/api/v1')


# ========== PUBLIC ROUTES ==========

@bp.route('/section-content/<page_name>', methods=['GET'])
def get_page_content(page_name):
    """Get all section content for a page (public)"""
    try:
        contents = SectionContent.query.filter_by(page_name=page_name).order_by(
            SectionContent.section_name,
            SectionContent.display_order
        ).all()
        
        # Group by section
        sections = {}
        for content in contents:
            if content.section_name not in sections:
                sections[content.section_name] = {}
            sections[content.section_name][content.content_key] = content.to_dict()['content_value']
        
        return success_response(data=sections)
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/section-content/<page_name>/<section_name>', methods=['GET'])
def get_section_content(page_name, section_name):
    """Get content for a specific section (public)"""
    try:
        contents = SectionContent.query.filter_by(
            page_name=page_name,
            section_name=section_name
        ).order_by(SectionContent.display_order).all()
        
        result = {content.content_key: content.to_dict()['content_value'] for content in contents}
        
        return success_response(data=result)
    except Exception as e:
        return error_response(str(e), status_code=500)


# ========== ADMIN ROUTES ==========

@bp.route('/admin/section-content', methods=['GET'])
@jwt_required()
def admin_get_all_sections():
    """Get all section content (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        page_filter = request.args.get('page_name')
        
        query = SectionContent.query
        
        if page_filter:
            query = query.filter_by(page_name=page_filter)
        
        query = query.order_by(
            SectionContent.page_name,
            SectionContent.section_name,
            SectionContent.display_order
        )
        
        contents = query.all()
        
        # Group by page and section for better admin UI
        grouped = {}
        for content in contents:
            if content.page_name not in grouped:
                grouped[content.page_name] = {}
            if content.section_name not in grouped[content.page_name]:
                grouped[content.page_name][content.section_name] = []
            grouped[content.page_name][content.section_name].append(content.to_dict())
        
        return success_response(data={
            'grouped': grouped,
            'items': [c.to_dict() for c in contents]
        })
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/section-content/pages', methods=['GET'])
@jwt_required()
def admin_get_available_pages():
    """Get list of available pages and sections (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        # Return predefined list of editable pages and sections
        pages = {
            'home': {
                'name': 'Home Page',
                'sections': ['hero', 'about', 'mission', 'features', 'collection']
            },
            'about': {
                'name': 'About Page',
                'sections': ['hero', 'story', 'team', 'values']
            },
            'collections': {
                'name': 'Collections Page',
                'sections': ['hero', 'featured']
            },
            'contact': {
                'name': 'Contact Page',
                'sections': ['hero', 'info']
            }
        }
        
        return success_response(data=pages)
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/section-content', methods=['POST'])
@jwt_required()
def admin_create_section_content():
    """Create section content (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        data = request.get_json()
        
        # Validation
        required = ['page_name', 'section_name', 'content_key']
        for field in required:
            if not data.get(field):
                return error_response(f"{field} is required", status_code=400)
        
        # Check for duplicate
        existing = SectionContent.query.filter_by(
            page_name=data['page_name'],
            section_name=data['section_name'],
            content_key=data['content_key']
        ).first()
        
        if existing:
            return error_response("Content item already exists. Use PUT to update.", status_code=409)
        
        content_value = data.get('content_value', '')
        content_type = data.get('content_type', 'text')
        
        # Convert complex types to JSON string
        if content_type in ['json', 'array'] and isinstance(content_value, (dict, list)):
            content_value = json.dumps(content_value)
        
        content = SectionContent(
            page_name=data['page_name'],
            section_name=data['section_name'],
            content_key=data['content_key'],
            content_value=content_value,
            content_type=content_type,
            label=data.get('label'),
            description=data.get('description'),
            display_order=data.get('display_order', 0),
            updated_by=user_id
        )
        
        db.session.add(content)
        db.session.commit()
        
        return created_response(data=content.to_dict(), message="Section content created")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/section-content/<content_id>', methods=['PUT'])
@jwt_required()
def admin_update_section_content(content_id):
    """Update section content (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        content = SectionContent.query.get(content_id)
        if not content:
            return not_found_response("Section content not found")
        
        data = request.get_json()
        
        # Update fields
        if 'content_value' in data:
            value = data['content_value']
            if content.content_type in ['json', 'array'] and isinstance(value, (dict, list)):
                value = json.dumps(value)
            content.content_value = value
        
        if 'content_type' in data:
            content.content_type = data['content_type']
        
        if 'label' in data:
            content.label = data['label']
        
        if 'description' in data:
            content.description = data['description']
        
        if 'display_order' in data:
            content.display_order = data['display_order']
        
        content.updated_by = user_id
        
        db.session.commit()
        
        return success_response(data=content.to_dict(), message="Section content updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/section-content/<content_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_section_content(content_id):
    """Delete section content (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        content = SectionContent.query.get(content_id)
        if not content:
            return not_found_response("Section content not found")
        
        db.session.delete(content)
        db.session.commit()
        
        return success_response(message="Section content deleted")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/section-content/bulk', methods=['PUT'])
@jwt_required()
def admin_bulk_update_section_content():
    """Bulk update section content (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        data = request.get_json()
        items = data.get('items', [])
        
        updated = []
        for item in items:
            content = SectionContent.query.get(item.get('id'))
            if content and 'content_value' in item:
                value = item['content_value']
                if content.content_type in ['json', 'array'] and isinstance(value, (dict, list)):
                    value = json.dumps(value)
                content.content_value = value
                content.updated_by = user_id
                updated.append(content.id)
        
        db.session.commit()
        
        return success_response(
            data={'updated_count': len(updated)},
            message=f"Updated {len(updated)} items"
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)
