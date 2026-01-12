"""CMS models - Pages, Blog Posts, Site Settings"""

from app.extensions import db
from datetime import datetime
import uuid

class Page(db.Model):
    """CMS Page model"""
    __tablename__ = 'pages'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    content = db.Column(db.Text, nullable=True)  # HTML content

    # SEO
    meta_title = db.Column(db.String(255), nullable=True)
    meta_description = db.Column(db.String(500), nullable=True)

    # Status
    is_published = db.Column(db.Boolean, default=False, nullable=False)

    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        """Convert page to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None
        }

    def __repr__(self):
        return f"<Page {self.title}>"


class BlogPost(db.Model):
    """Blog post model"""
    __tablename__ = 'blog_posts'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    excerpt = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=True)  # HTML content
    author_id = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=False)

    # Images
    featured_image = db.Column(db.String(500), nullable=True)

    # SEO
    meta_title = db.Column(db.String(255), nullable=True)
    meta_description = db.Column(db.String(500), nullable=True)

    # Status
    is_published = db.Column(db.Boolean, default=False, nullable=False)

    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    author = db.relationship('User', backref='blog_posts', lazy=True)

    def to_dict(self, include_content=False):
        """Convert blog post to dictionary"""
        result = {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'excerpt': self.excerpt,
            'author': {
                'id': self.author.id,
                'name': f"{self.author.first_name} {self.author.last_name}",
                'email': self.author.email
            } if self.author else None,
            'featured_image': self.featured_image,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None
        }

        if include_content:
            result['content'] = self.content

        return result

    def __repr__(self):
        return f"<BlogPost {self.title}>"


class SiteSetting(db.Model):
    """Site settings model"""
    __tablename__ = 'site_settings'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    key = db.Column(db.String(100), unique=True, nullable=False, index=True)
    value = db.Column(db.Text, nullable=True)  # Can store JSON
    setting_type = db.Column(db.String(20), nullable=False, default='text')
    # Types: 'text', 'number', 'boolean', 'json', 'image'
    description = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert setting to dictionary"""
        import json
        value = self.value

        # Parse JSON values
        if self.setting_type == 'json' and value:
            try:
                value = json.loads(value)
            except:
                pass
        elif self.setting_type == 'boolean':
            value = value.lower() == 'true' if value else False
        elif self.setting_type == 'number' and value:
            try:
                value = float(value) if '.' in value else int(value)
            except:
                pass

        return {
            'id': self.id,
            'key': self.key,
            'value': value,
            'type': self.setting_type,
            'description': self.description,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<SiteSetting {self.key}>"


class NewsletterSubscriber(db.Model):
    """Newsletter subscriber model"""
    __tablename__ = 'newsletter_subscribers'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    is_subscribed = db.Column(db.Boolean, default=True, nullable=False)
    subscribed_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    unsubscribed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        """Convert subscriber to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'is_subscribed': self.is_subscribed,
            'subscribed_at': self.subscribed_at.isoformat() if self.subscribed_at else None,
            'unsubscribed_at': self.unsubscribed_at.isoformat() if self.unsubscribed_at else None
        }

    def __repr__(self):
        return f"<NewsletterSubscriber {self.email}>"


class ContactMessage(db.Model):
    """Contact form message model"""
    __tablename__ = 'contact_messages'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    
    # Category and type-specific fields
    category = db.Column(db.String(50), nullable=False, default='general')
    # Categories: general, custom, accessibility, partnership, press
    
    consultation_type = db.Column(db.String(100), nullable=True)
    # For accessibility category
    
    order_details = db.Column(db.Text, nullable=True)
    # For custom orders category
    
    partnership_type = db.Column(db.String(100), nullable=True)
    # For partnership category
    
    subject = db.Column(db.String(255), nullable=True)
    message = db.Column(db.Text, nullable=False)
    
    # Status tracking
    status = db.Column(db.String(20), nullable=False, default='new')
    # Status: new, in_progress, resolved
    
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    admin_notes = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    replied_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        """Convert message to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'category': self.category,
            'consultation_type': self.consultation_type,
            'order_details': self.order_details,
            'partnership_type': self.partnership_type,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'is_read': self.is_read,
            'admin_notes': self.admin_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'replied_at': self.replied_at.isoformat() if self.replied_at else None
        }

    def __repr__(self):
        return f"<ContactMessage from {self.email}>"


class Consultation(db.Model):
    """Consultation booking model"""
    __tablename__ = 'consultations'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    
    # Consultation details
    consultation_type = db.Column(db.String(50), nullable=False)
    # Types: styling, accessibility, custom, fitting
    
    meeting_type = db.Column(db.String(20), nullable=False, default='in-person')
    # Types: in-person, virtual
    
    preferred_date = db.Column(db.Date, nullable=False)
    preferred_time = db.Column(db.String(20), nullable=False)
    
    # Status and notes
    status = db.Column(db.String(20), nullable=False, default='pending')
    # Status: pending, confirmed, completed, cancelled
    
    notes = db.Column(db.Text, nullable=True)
    admin_notes = db.Column(db.Text, nullable=True)
    confirmation_sent = db.Column(db.Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert consultation to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'consultation_type': self.consultation_type,
            'meeting_type': self.meeting_type,
            'preferred_date': self.preferred_date.isoformat() if self.preferred_date else None,
            'preferred_time': self.preferred_time,
            'status': self.status,
            'notes': self.notes,
            'admin_notes': self.admin_notes,
            'confirmation_sent': self.confirmation_sent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Consultation {self.consultation_type} - {self.email}>"


class FAQ(db.Model):
    """Frequently Asked Questions model"""
    __tablename__ = 'faqs'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = db.Column(db.String(50), nullable=False)
    # Categories: orders, accessibility, shipping, returns, general
    
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    
    display_order = db.Column(db.Integer, nullable=False, default=0)
    is_published = db.Column(db.Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert FAQ to dictionary"""
        return {
            'id': self.id,
            'category': self.category,
            'question': self.question,
            'answer': self.answer,
            'display_order': self.display_order,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<FAQ {self.category} - {self.question[:50]}>"


class Testimonial(db.Model):
    """Customer testimonial model"""
    __tablename__ = 'testimonials'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(200), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    
    story = db.Column(db.Text, nullable=False)
    result = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.Integer, nullable=False, default=5)
    
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    is_published = db.Column(db.Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert testimonial to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'image_url': self.image_url,
            'story': self.story,
            'result': self.result,
            'rating': self.rating,
            'is_featured': self.is_featured,
            'display_order': self.display_order,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Testimonial from {self.name}>"
