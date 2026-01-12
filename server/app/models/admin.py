"""Admin-specific models - Notifications, Media, Messages, Collections"""

from app.extensions import db
from datetime import datetime
import uuid

class Notification(db.Model):
    """Admin notification model"""
    __tablename__ = 'notifications'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    # Types: 'new_order', 'low_stock', 'new_inquiry', 'new_message', 'system'
    
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(500), nullable=True)  # Link to relevant page
    
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    is_email_sent = db.Column(db.Boolean, default=False, nullable=False)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    read_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    user = db.relationship('User', backref='notifications', lazy=True)

    def to_dict(self):
        """Convert notification to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'link': self.link,
            'is_read': self.is_read,
            'is_email_sent': self.is_email_sent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'read_at': self.read_at.isoformat() if self.read_at else None
        }

    def __repr__(self):
        return f"<Notification {self.type} - {self.title}>"


class MediaFile(db.Model):
    """Media file model for images and videos"""
    __tablename__ = 'media_files'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    
    file_type = db.Column(db.String(20), nullable=False)
    # Types: 'image', 'video'
    
    mime_type = db.Column(db.String(100), nullable=True)
    file_size = db.Column(db.BigInteger, nullable=True)  # Size in bytes
    
    # For videos
    is_external = db.Column(db.Boolean, default=False, nullable=False)
    external_url = db.Column(db.String(500), nullable=True)  # YouTube, Vimeo, etc.
    
    # Metadata
    alt_text = db.Column(db.String(255), nullable=True)
    caption = db.Column(db.Text, nullable=True)
    tags = db.Column(db.JSON, nullable=True)  # Array of tags
    
    # Image dimensions
    width = db.Column(db.Integer, nullable=True)
    height = db.Column(db.Integer, nullable=True)
    
    # Uploaded by
    uploaded_by = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    uploader = db.relationship('User', backref='uploaded_media', lazy=True)

    def to_dict(self):
        """Convert media file to dictionary"""
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'url': self.url,
            'file_type': self.file_type,
            'mime_type': self.mime_type,
            'file_size': self.file_size,
            'is_external': self.is_external,
            'external_url': self.external_url,
            'alt_text': self.alt_text,
            'caption': self.caption,
            'tags': self.tags,
            'width': self.width,
            'height': self.height,
            'uploaded_by': self.uploaded_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<MediaFile {self.filename}>"


class Message(db.Model):
    """Customer-Admin messaging model"""
    __tablename__ = 'messages'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = db.Column(db.String(36), nullable=False, index=True)
    
    sender_id = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=False)
    recipient_id = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=False)
    
    message = db.Column(db.Text, nullable=False)
    
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    read_at = db.Column(db.DateTime, nullable=True)
    
    # Attachments
    attachments = db.Column(db.JSON, nullable=True)  # Array of media file IDs
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_messages', lazy=True)
    recipient = db.relationship('User', foreign_keys=[recipient_id], backref='received_messages', lazy=True)

    def to_dict(self):
        """Convert message to dictionary"""
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'sender_id': self.sender_id,
            'recipient_id': self.recipient_id,
            'sender': {
                'id': self.sender.id,
                'name': f"{self.sender.first_name} {self.sender.last_name}",
                'email': self.sender.email
            } if self.sender else None,
            'recipient': {
                'id': self.recipient.id,
                'name': f"{self.recipient.first_name} {self.recipient.last_name}",
                'email': self.recipient.email
            } if self.recipient else None,
            'message': self.message,
            'is_read': self.is_read,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'attachments': self.attachments,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Message {self.id}>"


class ProductCollection(db.Model):
    """Product collection model"""
    __tablename__ = 'product_collections'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    
    # Featured image
    featured_image_id = db.Column(db.String(36), db.ForeignKey('hisi.media_files.id'), nullable=True)
    
    # Products in this collection (stored as JSON array of product IDs with order)
    products = db.Column(db.JSON, nullable=True)  # [{"product_id": "...", "order": 1}, ...]
    
    # Display settings
    is_published = db.Column(db.Boolean, default=False, nullable=False)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    
    # SEO
    meta_title = db.Column(db.String(255), nullable=True)
    meta_description = db.Column(db.String(500), nullable=True)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    featured_image = db.relationship('MediaFile', backref='collections', lazy=True)

    def to_dict(self):
        """Convert collection to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'featured_image': self.featured_image.to_dict() if self.featured_image else None,
            'products': self.products,
            'is_published': self.is_published,
            'display_order': self.display_order,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<ProductCollection {self.name}>"
