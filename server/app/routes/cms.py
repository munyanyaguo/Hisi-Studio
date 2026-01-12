"""CMS routes - Pages, Blog, Settings"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Page, BlogPost, SiteSetting, User
from app.utils.responses import (
    success_response, error_response, created_response,
    not_found_response, forbidden_response, paginated_response
)
from datetime import datetime

bp = Blueprint('cms', __name__, url_prefix='/api/v1')


# ========== PAGES ==========

@bp.route('/pages', methods=['GET'])
def get_pages():
    """Get all published pages (public)"""
    try:
        pages = Page.query.filter_by(is_published=True).all()
        return success_response(data=[page.to_dict() for page in pages])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/pages/<slug>', methods=['GET'])
def get_page(slug):
    """Get page by slug (public)"""
    try:
        page = Page.query.filter_by(slug=slug, is_published=True).first()
        if not page:
            return not_found_response("Page not found")
        return success_response(data=page.to_dict())
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/pages', methods=['GET'])
@jwt_required()
def admin_get_pages():
    """Get all pages (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        pages = Page.query.all()
        return success_response(data=[page.to_dict() for page in pages])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/pages', methods=['POST'])
@jwt_required()
def admin_create_page():
    """Create page (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        data = request.get_json()

        if not data.get('title') or not data.get('slug'):
            return error_response("title and slug are required", status_code=400)

        # Check if slug exists
        if Page.query.filter_by(slug=data['slug']).first():
            return error_response("Slug already exists", status_code=409)

        page = Page(
            title=data['title'],
            slug=data['slug'],
            content=data.get('content'),
            meta_title=data.get('meta_title'),
            meta_description=data.get('meta_description'),
            is_published=data.get('is_published', False)
        )

        if page.is_published:
            page.published_at = datetime.utcnow()

        db.session.add(page)
        db.session.commit()

        return created_response(data=page.to_dict(), message="Page created successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/pages/<page_id>', methods=['PUT'])
@jwt_required()
def admin_update_page(page_id):
    """Update page (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        page = Page.query.get(page_id)
        if not page:
            return not_found_response("Page not found")

        data = request.get_json()

        # Update fields
        if 'title' in data:
            page.title = data['title']
        if 'slug' in data:
            page.slug = data['slug']
        if 'content' in data:
            page.content = data['content']
        if 'meta_title' in data:
            page.meta_title = data['meta_title']
        if 'meta_description' in data:
            page.meta_description = data['meta_description']
        if 'is_published' in data:
            page.is_published = data['is_published']
            if page.is_published and not page.published_at:
                page.published_at = datetime.utcnow()

        db.session.commit()

        return success_response(data=page.to_dict(), message="Page updated successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/pages/<page_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_page(page_id):
    """Delete page (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        page = Page.query.get(page_id)
        if not page:
            return not_found_response("Page not found")

        db.session.delete(page)
        db.session.commit()

        return success_response(message="Page deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== BLOG ==========

@bp.route('/blog', methods=['GET'])
def get_blog_posts():
    """Get all published blog posts (public)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        query = BlogPost.query.filter_by(is_published=True).order_by(BlogPost.published_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return paginated_response(
            items=[post.to_dict() for post in pagination.items],
            page=page,
            per_page=per_page,
            total=pagination.total
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/blog/<slug>', methods=['GET'])
def get_blog_post(slug):
    """Get blog post by slug (public)"""
    try:
        post = BlogPost.query.filter_by(slug=slug, is_published=True).first()
        if not post:
            return not_found_response("Blog post not found")
        return success_response(data=post.to_dict(include_content=True))
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/blog', methods=['POST'])
@jwt_required()
def admin_create_blog_post():
    """Create blog post (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        data = request.get_json()

        if not data.get('title') or not data.get('slug'):
            return error_response("title and slug are required", status_code=400)

        if BlogPost.query.filter_by(slug=data['slug']).first():
            return error_response("Slug already exists", status_code=409)

        post = BlogPost(
            title=data['title'],
            slug=data['slug'],
            excerpt=data.get('excerpt'),
            content=data.get('content'),
            author_id=user_id,
            featured_image=data.get('featured_image'),
            meta_title=data.get('meta_title'),
            meta_description=data.get('meta_description'),
            is_published=data.get('is_published', False)
        )

        if post.is_published:
            post.published_at = datetime.utcnow()

        db.session.add(post)
        db.session.commit()

        return created_response(data=post.to_dict(include_content=True), message="Blog post created")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/blog/<post_id>', methods=['PUT'])
@jwt_required()
def admin_update_blog_post(post_id):
    """Update blog post (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        post = BlogPost.query.get(post_id)
        if not post:
            return not_found_response("Blog post not found")

        data = request.get_json()

        # Update fields
        updatable_fields = ['title', 'slug', 'excerpt', 'content', 'featured_image',
                           'meta_title', 'meta_description', 'is_published']

        for field in updatable_fields:
            if field in data:
                setattr(post, field, data[field])

        if data.get('is_published') and not post.published_at:
            post.published_at = datetime.utcnow()

        db.session.commit()

        return success_response(data=post.to_dict(include_content=True), message="Blog post updated")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/blog/<post_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_blog_post(post_id):
    """Delete blog post (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        post = BlogPost.query.get(post_id)
        if not post:
            return not_found_response("Blog post not found")

        db.session.delete(post)
        db.session.commit()

        return success_response(message="Blog post deleted")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== SETTINGS ==========

@bp.route('/settings', methods=['GET'])
def get_settings():
    """Get public settings"""
    try:
        settings = SiteSetting.query.all()
        return success_response(data={s.key: s.to_dict()['value'] for s in settings})
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/settings', methods=['GET'])
@jwt_required()
def admin_get_settings():
    """Get all settings (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        settings = SiteSetting.query.all()
        return success_response(data=[s.to_dict() for s in settings])
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/settings', methods=['PUT'])
@jwt_required()
def admin_update_settings():
    """Update settings (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user.is_admin():
            return forbidden_response("Admin access required")

        data = request.get_json()
        import json

        for key, value in data.items():
            setting = SiteSetting.query.filter_by(key=key).first()

            if setting:
                # Convert value to string for storage
                if isinstance(value, (dict, list)):
                    setting.value = json.dumps(value)
                elif isinstance(value, bool):
                    setting.value = str(value).lower()
                else:
                    setting.value = str(value)
            else:
                # Create new setting
                setting_type = 'json' if isinstance(value, (dict, list)) else \
                              'boolean' if isinstance(value, bool) else \
                              'number' if isinstance(value, (int, float)) else 'text'

                if isinstance(value, (dict, list)):
                    value = json.dumps(value)
                elif isinstance(value, bool):
                    value = str(value).lower()
                else:
                    value = str(value)

                setting = SiteSetting(
                    key=key,
                    value=value,
                    setting_type=setting_type
                )
                db.session.add(setting)

        db.session.commit()

        return success_response(message="Settings updated successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)
