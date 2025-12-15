"""Newsletter routes"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import NewsletterSubscriber, ContactMessage, User
from app.utils.responses import (
    success_response, error_response, created_response,
    not_found_response, forbidden_response, paginated_response
)
from app.utils.validators import validate_email
from datetime import datetime

bp = Blueprint('newsletter', __name__, url_prefix='/api/v1')


# ========== NEWSLETTER ==========

@bp.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    """Subscribe to newsletter"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()

        # Validate email
        valid, error = validate_email(email)
        if not valid:
            return error_response(error, status_code=400)

        # Check if already subscribed
        subscriber = NewsletterSubscriber.query.filter_by(email=email).first()

        if subscriber:
            if subscriber.is_subscribed:
                return error_response("Email already subscribed", status_code=409)
            else:
                # Resubscribe
                subscriber.is_subscribed = True
                subscriber.subscribed_at = datetime.utcnow()
                subscriber.unsubscribed_at = None
        else:
            # New subscriber
            subscriber = NewsletterSubscriber(email=email)
            db.session.add(subscriber)

        db.session.commit()

        return created_response(
            data=subscriber.to_dict(),
            message="Successfully subscribed to newsletter"
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/newsletter/unsubscribe', methods=['POST'])
def unsubscribe_newsletter():
    """Unsubscribe from newsletter"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()

        subscriber = NewsletterSubscriber.query.filter_by(email=email).first()

        if not subscriber or not subscriber.is_subscribed:
            return not_found_response("Email not found in subscriber list")

        subscriber.is_subscribed = False
        subscriber.unsubscribed_at = datetime.utcnow()
        db.session.commit()

        return success_response(message="Successfully unsubscribed from newsletter")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/newsletter/subscribers', methods=['GET'])
@jwt_required()
def admin_get_subscribers():
    """Get all newsletter subscribers (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")

        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        status = request.args.get('status')  # 'subscribed' or 'unsubscribed'

        query = NewsletterSubscriber.query

        if status == 'subscribed':
            query = query.filter_by(is_subscribed=True)
        elif status == 'unsubscribed':
            query = query.filter_by(is_subscribed=False)

        query = query.order_by(NewsletterSubscriber.subscribed_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return paginated_response(
            items=[sub.to_dict() for sub in pagination.items],
            page=page,
            per_page=per_page,
            total=pagination.total
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


# ========== CONTACT ==========

@bp.route('/contact', methods=['POST'])
def submit_contact():
    """Submit contact form"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return error_response(f"{field} is required", status_code=400)

        # Validate email
        valid, error = validate_email(data['email'])
        if not valid:
            return error_response(error, status_code=400)

        # Create contact message
        message = ContactMessage(
            name=data['name'],
            email=data['email'].strip().lower(),
            phone=data.get('phone'),
            subject=data.get('subject'),
            message=data['message']
        )

        db.session.add(message)
        db.session.commit()

        return created_response(
            data=message.to_dict(),
            message="Message sent successfully. We'll get back to you soon!"
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/contact/messages', methods=['GET'])
@jwt_required()
def admin_get_messages():
    """Get all contact messages (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")

        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')  # 'read' or 'unread'

        query = ContactMessage.query

        if status == 'read':
            query = query.filter_by(is_read=True)
        elif status == 'unread':
            query = query.filter_by(is_read=False)

        query = query.order_by(ContactMessage.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return paginated_response(
            items=[msg.to_dict() for msg in pagination.items],
            page=page,
            per_page=per_page,
            total=pagination.total
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/contact/messages/<message_id>', methods=['GET'])
@jwt_required()
def admin_get_message(message_id):
    """Get specific contact message (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")

        message = ContactMessage.query.get(message_id)
        if not message:
            return not_found_response("Message not found")

        return success_response(data=message.to_dict())
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/contact/messages/<message_id>/read', methods=['PUT'])
@jwt_required()
def admin_mark_message_read(message_id):
    """Mark message as read (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")

        message = ContactMessage.query.get(message_id)
        if not message:
            return not_found_response("Message not found")

        message.is_read = True
        db.session.commit()

        return success_response(
            data=message.to_dict(),
            message="Message marked as read"
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/contact/messages/<message_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_message(message_id):
    """Delete contact message (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")

        message = ContactMessage.query.get(message_id)
        if not message:
            return not_found_response("Message not found")

        db.session.delete(message)
        db.session.commit()

        return success_response(message="Message deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)
