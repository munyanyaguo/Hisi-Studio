"""Contact routes - Contact forms, Consultations, FAQs, Testimonials"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import ContactMessage, Consultation, FAQ, Testimonial, User, Order, SiteSetting
from app.services.email_service import email_service
from app.utils.responses import (
    success_response, error_response, created_response,
    not_found_response, forbidden_response
)
from datetime import datetime
from sqlalchemy import func
import re

bp = Blueprint('contact', __name__, url_prefix='/api/v1')


# ========== STATS ENDPOINT ==========

@bp.route('/contact/stats', methods=['GET'])
def get_contact_stats():
    """Get contact page statistics (public)"""
    try:
        # Count total messages
        total_messages = ContactMessage.query.count()
        
        # Count resolved messages
        resolved_messages = ContactMessage.query.filter_by(status='resolved').count()
        
        # Count total consultations
        total_consultations = Consultation.query.count()
        
        # Count completed consultations
        completed_consultations = Consultation.query.filter_by(status='completed').count()
        
        # Count total orders (if Order model exists)
        try:
            total_orders = Order.query.count()
        except:
            total_orders = 0
        
        # Calculate response rate
        response_rate = round((resolved_messages / total_messages * 100) if total_messages > 0 else 0)
        
        # Calculate consultation completion rate
        consultation_rate = round((completed_consultations / total_consultations * 100) if total_consultations > 0 else 0)
        
        return success_response(data={
            'total_messages': total_messages,
            'resolved_messages': resolved_messages,
            'total_consultations': total_consultations,
            'completed_consultations': completed_consultations,
            'total_orders': total_orders,
            'response_rate': response_rate,
            'consultation_completion_rate': consultation_rate
        })
        
    except Exception as e:
        return error_response(str(e), status_code=500)


# ========== CONTACT INFORMATION ==========

@bp.route('/contact/info', methods=['GET'])
def get_contact_info():
    """Get contact information (public)"""
    try:
        import json
        
        # Fetch contact settings
        phone_setting = SiteSetting.query.filter_by(key='contact_phone').first()
        whatsapp_setting = SiteSetting.query.filter_by(key='contact_whatsapp').first()
        email_setting = SiteSetting.query.filter_by(key='contact_email').first()
        instagram_setting = SiteSetting.query.filter_by(key='contact_instagram').first()
        
        # Parse JSON values
        contact_info = {
            'phone': json.loads(phone_setting.value) if phone_setting and phone_setting.value else None,
            'whatsapp': json.loads(whatsapp_setting.value) if whatsapp_setting and whatsapp_setting.value else None,
            'email': json.loads(email_setting.value) if email_setting and email_setting.value else None,
            'instagram': json.loads(instagram_setting.value) if instagram_setting and instagram_setting.value else None
        }
        
        return success_response(data=contact_info)
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/contact/info', methods=['PUT'])
@jwt_required()
def admin_update_contact_info():
    """Update contact information (admin)"""
    try:
        import json
        
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        data = request.get_json()
        
        # Update each contact method if provided
        if 'phone' in data:
            phone_setting = SiteSetting.query.filter_by(key='contact_phone').first()
            if phone_setting:
                phone_setting.value = json.dumps(data['phone'])
                phone_setting.updated_at = datetime.utcnow()
        
        if 'whatsapp' in data:
            whatsapp_setting = SiteSetting.query.filter_by(key='contact_whatsapp').first()
            if whatsapp_setting:
                whatsapp_setting.value = json.dumps(data['whatsapp'])
                whatsapp_setting.updated_at = datetime.utcnow()
        
        if 'email' in data:
            email_setting = SiteSetting.query.filter_by(key='contact_email').first()
            if email_setting:
                email_setting.value = json.dumps(data['email'])
                email_setting.updated_at = datetime.utcnow()
        
        if 'instagram' in data:
            instagram_setting = SiteSetting.query.filter_by(key='contact_instagram').first()
            if instagram_setting:
                instagram_setting.value = json.dumps(data['instagram'])
                instagram_setting.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(message="Contact information updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== VALIDATION HELPERS ==========

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone):
    """Validate phone format (basic check)"""
    if not phone:
        return False  # Phone is required
    # Remove spaces and dashes
    cleaned = phone.replace(' ', '').replace('-', '').replace('+', '')
    return cleaned.isdigit() and len(cleaned) >= 9


# ========== CONTACT MESSAGES ==========

@bp.route('/contact', methods=['POST'])
def submit_contact_form():
    """Submit contact form (public)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return error_response("Name is required", status_code=400)
        if not data.get('email'):
            return error_response("Email is required", status_code=400)
        if not data.get('phone'):
            return error_response("Phone is required", status_code=400)
        if not data.get('message'):
            return error_response("Message is required", status_code=400)
        
        # Validate email format
        if not validate_email(data['email']):
            return error_response("Invalid email format", status_code=400)
        
        # Validate phone format
        if not validate_phone(data['phone']):
            return error_response("Invalid phone format", status_code=400)
        
        # Validate name length
        if len(data['name']) < 2 or len(data['name']) > 200:
            return error_response("Name must be between 2 and 200 characters", status_code=400)
        
        # Validate message length
        if len(data['message']) < 10 or len(data['message']) > 5000:
            return error_response("Message must be between 10 and 5000 characters", status_code=400)
        
        # Create contact message
        contact_message = ContactMessage(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            category=data.get('category', 'general'),
            consultation_type=data.get('consultationType'),
            order_details=data.get('orderDetails'),
            partnership_type=data.get('partnershipType'),
            subject=data.get('subject'),
            message=data['message']
        )
        
        db.session.add(contact_message)
        db.session.commit()
        
        # Send email notifications
        email_data = {
            'name': data['name'],
            'email': data['email'],
            'phone': data.get('phone'),
            'category': data.get('category', 'general'),
            'consultation_type': data.get('consultationType'),
            'order_details': data.get('orderDetails'),
            'partnership_type': data.get('partnershipType'),
            'message': data['message']
        }
        
        # Send admin notification
        email_service.send_contact_form_admin_notification(email_data)
        
        # Send customer confirmation
        email_service.send_contact_form_confirmation(email_data)
        
        return created_response(
            data=contact_message.to_dict(),
            message="Message sent successfully. We'll get back to you soon!"
        )
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/contact-messages', methods=['GET'])
@jwt_required()
def admin_get_contact_messages():
    """Get all contact messages (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        # Get query parameters
        status = request.args.get('status')
        category = request.args.get('category')
        
        # Build query
        query = ContactMessage.query
        
        if status:
            query = query.filter_by(status=status)
        if category:
            query = query.filter_by(category=category)
        
        messages = query.order_by(ContactMessage.created_at.desc()).all()
        
        return success_response(data=[msg.to_dict() for msg in messages])
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/contact-messages/<message_id>', methods=['GET'])
@jwt_required()
def admin_get_contact_message(message_id):
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


@bp.route('/admin/contact-messages/<message_id>', methods=['PATCH'])
@jwt_required()
def admin_update_contact_message(message_id):
    """Update contact message status/notes (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        message = ContactMessage.query.get(message_id)
        if not message:
            return not_found_response("Message not found")
        
        data = request.get_json()
        
        # Update allowed fields
        if 'status' in data:
            message.status = data['status']
        if 'is_read' in data:
            message.is_read = data['is_read']
        if 'admin_notes' in data:
            message.admin_notes = data['admin_notes']
        if data.get('status') == 'resolved' and not message.replied_at:
            message.replied_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(data=message.to_dict(), message="Message updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/contact-messages/<message_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_contact_message(message_id):
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


# ========== CONSULTATIONS ==========

@bp.route('/consultations', methods=['POST'])
def book_consultation():
    """Book a consultation (public)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return error_response("Name is required", status_code=400)
        if not data.get('email'):
            return error_response("Email is required", status_code=400)
        if not data.get('consultationType'):
            return error_response("Consultation type is required", status_code=400)
        if not data.get('meetingType'):
            return error_response("Meeting type is required", status_code=400)
        if not data.get('selectedDate'):
            return error_response("Date is required", status_code=400)
        if not data.get('selectedTime'):
            return error_response("Time is required", status_code=400)
        
        # Validate email
        if not validate_email(data['email']):
            return error_response("Invalid email format", status_code=400)
        
        # Validate phone if provided
        if data.get('phone') and not validate_phone(data['phone']):
            return error_response("Invalid phone format", status_code=400)
        
        # Parse date
        try:
            preferred_date = datetime.strptime(data['selectedDate'], '%Y-%m-%d').date()
        except ValueError:
            return error_response("Invalid date format. Use YYYY-MM-DD", status_code=400)
        
        # Create consultation
        consultation = Consultation(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            consultation_type=data['consultationType'],
            meeting_type=data['meetingType'],
            preferred_date=preferred_date,
            preferred_time=data['selectedTime'],
            notes=data.get('notes')
        )
        
        db.session.add(consultation)
        db.session.commit()
        
        # Send email notifications
        email_data = {
            'name': data['name'],
            'email': data['email'],
            'phone': data.get('phone'),
            'consultation_type': data['consultationType'],
            'meeting_type': data['meetingType'],
            'preferred_date': data['selectedDate'],
            'preferred_time': data['selectedTime'],
            'notes': data.get('notes')
        }
        
        # Send admin notification
        email_service.send_consultation_admin_notification(email_data)
        
        # Send customer confirmation
        email_service.send_consultation_confirmation(email_data)
        
        # Mark confirmation as sent
        consultation.confirmation_sent = True
        db.session.commit()
        
        return created_response(
            data=consultation.to_dict(),
            message="Consultation booked successfully! Check your email for confirmation."
        )
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/consultations', methods=['GET'])
@jwt_required()
def admin_get_consultations():
    """Get all consultations (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        # Get query parameters
        status = request.args.get('status')
        
        # Build query
        query = Consultation.query
        
        if status:
            query = query.filter_by(status=status)
        
        consultations = query.order_by(Consultation.preferred_date.desc(), Consultation.preferred_time).all()
        
        return success_response(data=[c.to_dict() for c in consultations])
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/consultations/<consultation_id>', methods=['PATCH'])
@jwt_required()
def admin_update_consultation(consultation_id):
    """Update consultation status (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        consultation = Consultation.query.get(consultation_id)
        if not consultation:
            return not_found_response("Consultation not found")
        
        data = request.get_json()
        
        # Update allowed fields
        if 'status' in data:
            consultation.status = data['status']
        if 'admin_notes' in data:
            consultation.admin_notes = data['admin_notes']
        
        db.session.commit()
        
        return success_response(data=consultation.to_dict(), message="Consultation updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/consultations/<consultation_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_consultation(consultation_id):
    """Delete/cancel consultation (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        consultation = Consultation.query.get(consultation_id)
        if not consultation:
            return not_found_response("Consultation not found")
        
        db.session.delete(consultation)
        db.session.commit()
        
        return success_response(message="Consultation deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== FAQs ==========

@bp.route('/faqs', methods=['GET'])
def get_faqs():
    """Get published FAQs (public)"""
    try:
        category = request.args.get('category')
        
        query = FAQ.query.filter_by(is_published=True)
        
        if category:
            query = query.filter_by(category=category)
        
        faqs = query.order_by(FAQ.display_order, FAQ.created_at).all()
        
        return success_response(data=[faq.to_dict() for faq in faqs])
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/faqs', methods=['GET'])
@jwt_required()
def admin_get_faqs():
    """Get all FAQs (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        faqs = FAQ.query.order_by(FAQ.category, FAQ.display_order).all()
        
        return success_response(data=[faq.to_dict() for faq in faqs])
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/faqs', methods=['POST'])
@jwt_required()
def admin_create_faq():
    """Create FAQ (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        data = request.get_json()
        
        if not data.get('category') or not data.get('question') or not data.get('answer'):
            return error_response("Category, question, and answer are required", status_code=400)
        
        faq = FAQ(
            category=data['category'],
            question=data['question'],
            answer=data['answer'],
            display_order=data.get('display_order', 0),
            is_published=data.get('is_published', True)
        )
        
        db.session.add(faq)
        db.session.commit()
        
        return created_response(data=faq.to_dict(), message="FAQ created successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/faqs/<faq_id>', methods=['PUT'])
@jwt_required()
def admin_update_faq(faq_id):
    """Update FAQ (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        faq = FAQ.query.get(faq_id)
        if not faq:
            return not_found_response("FAQ not found")
        
        data = request.get_json()
        
        # Update fields
        if 'category' in data:
            faq.category = data['category']
        if 'question' in data:
            faq.question = data['question']
        if 'answer' in data:
            faq.answer = data['answer']
        if 'display_order' in data:
            faq.display_order = data['display_order']
        if 'is_published' in data:
            faq.is_published = data['is_published']
        
        db.session.commit()
        
        return success_response(data=faq.to_dict(), message="FAQ updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/faqs/<faq_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_faq(faq_id):
    """Delete FAQ (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        faq = FAQ.query.get(faq_id)
        if not faq:
            return not_found_response("FAQ not found")
        
        db.session.delete(faq)
        db.session.commit()
        
        return success_response(message="FAQ deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== TESTIMONIALS ==========

@bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    """Get published testimonials (public)"""
    try:
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        
        query = Testimonial.query.filter_by(is_published=True)
        
        if featured_only:
            query = query.filter_by(is_featured=True)
        
        testimonials = query.order_by(Testimonial.display_order, Testimonial.created_at.desc()).all()
        
        return success_response(data=[t.to_dict() for t in testimonials])
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/testimonials', methods=['GET'])
@jwt_required()
def admin_get_testimonials():
    """Get all testimonials (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        testimonials = Testimonial.query.order_by(Testimonial.display_order).all()
        
        return success_response(data=[t.to_dict() for t in testimonials])
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/testimonials', methods=['POST'])
@jwt_required()
def admin_create_testimonial():
    """Create testimonial (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        data = request.get_json()
        
        if not data.get('name') or not data.get('story'):
            return error_response("Name and story are required", status_code=400)
        
        testimonial = Testimonial(
            name=data['name'],
            role=data.get('role'),
            image_url=data.get('image_url'),
            story=data['story'],
            result=data.get('result'),
            rating=data.get('rating', 5),
            is_featured=data.get('is_featured', False),
            display_order=data.get('display_order', 0),
            is_published=data.get('is_published', True)
        )
        
        db.session.add(testimonial)
        db.session.commit()
        
        return created_response(data=testimonial.to_dict(), message="Testimonial created successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/testimonials/<testimonial_id>', methods=['PUT'])
@jwt_required()
def admin_update_testimonial(testimonial_id):
    """Update testimonial (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        testimonial = Testimonial.query.get(testimonial_id)
        if not testimonial:
            return not_found_response("Testimonial not found")
        
        data = request.get_json()
        
        # Update fields
        updatable_fields = ['name', 'role', 'image_url', 'story', 'result', 
                           'rating', 'is_featured', 'display_order', 'is_published']
        
        for field in updatable_fields:
            if field in data:
                setattr(testimonial, field, data[field])
        
        db.session.commit()
        
        return success_response(data=testimonial.to_dict(), message="Testimonial updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/testimonials/<testimonial_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_testimonial(testimonial_id):
    """Delete testimonial (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user.role != 'admin':
            return forbidden_response("Admin access required")
        
        testimonial = Testimonial.query.get(testimonial_id)
        if not testimonial:
            return not_found_response("Testimonial not found")
        
        db.session.delete(testimonial)
        db.session.commit()
        
        return success_response(message="Testimonial deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)
