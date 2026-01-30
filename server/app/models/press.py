"""Press models - Media Coverage, Exhibitions, Press Releases, etc."""

from app.extensions import db
from datetime import datetime
import uuid
import json


class PressHero(db.Model):
    """Press page hero section content"""
    __tablename__ = 'press_hero'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False, default='Press & Media')
    subtitle = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(500), nullable=True)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'description': self.description,
            'image': self.image,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<PressHero {self.title}>"


class MediaCoverage(db.Model):
    """Media coverage/articles about the brand"""
    __tablename__ = 'media_coverage'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    outlet = db.Column(db.String(200), nullable=False)  # Publisher name
    date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String(100), nullable=False)  # Feature Article, Entrepreneur Profile, etc.
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(500), nullable=True)
    link = db.Column(db.String(500), nullable=True)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    is_published = db.Column(db.Boolean, default=True, nullable=False)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'outlet': self.outlet,
            'date': self.date.isoformat() if self.date else None,
            'category': self.category,
            'description': self.description,
            'image': self.image,
            'link': self.link,
            'featured': self.is_featured,
            'is_published': self.is_published,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<MediaCoverage {self.title}>"


class PressRelease(db.Model):
    """Press releases"""
    __tablename__ = 'press_releases'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    excerpt = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=True)
    link = db.Column(db.String(500), nullable=True)
    is_published = db.Column(db.Boolean, default=True, nullable=False)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'date': self.date.isoformat() if self.date else None,
            'excerpt': self.excerpt,
            'content': self.content,
            'link': self.link,
            'is_published': self.is_published,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<PressRelease {self.title}>"


class PressEvent(db.Model):
    """Unified model for exhibitions, speaking engagements, and collaborations"""
    __tablename__ = 'press_events'
    __table_args__ = {'schema': 'hisi'}

    # Event types
    TYPE_EXHIBITION = 'exhibition'
    TYPE_SPEAKING = 'speaking'
    TYPE_COLLABORATION = 'collaboration'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_type = db.Column(db.String(20), nullable=False)  # exhibition, speaking, collaboration
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_published = db.Column(db.Boolean, default=True, nullable=False)
    display_order = db.Column(db.Integer, nullable=False, default=0)

    # Date field - used by exhibition and speaking, optional for collaboration
    date = db.Column(db.Date, nullable=True)

    # Location - used by exhibition and speaking
    location = db.Column(db.String(255), nullable=True)

    # Image - used by exhibition and collaboration
    image = db.Column(db.String(500), nullable=True)

    # Exhibition-specific: gallery images
    gallery = db.Column(db.Text, nullable=True)  # JSON array of image URLs

    # Speaking-specific fields
    event_name = db.Column(db.String(255), nullable=True)  # Name of the event they spoke at
    engagement_type = db.Column(db.String(50), nullable=True)  # Keynote, Panel, Workshop, TEDx

    # Collaboration-specific fields
    partner = db.Column(db.String(255), nullable=True)
    year = db.Column(db.String(4), nullable=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert to dictionary based on event type"""
        base = {
            'id': self.id,
            'event_type': self.event_type,
            'title': self.title,
            'description': self.description,
            'is_published': self.is_published,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

        if self.event_type == self.TYPE_EXHIBITION:
            gallery = self.gallery
            if gallery:
                try:
                    gallery = json.loads(gallery)
                except:
                    gallery = []
            else:
                gallery = []
            base.update({
                'location': self.location,
                'date': self.date.isoformat() if self.date else None,
                'image': self.image,
                'gallery': gallery
            })
        elif self.event_type == self.TYPE_SPEAKING:
            base.update({
                'event': self.event_name,
                'location': self.location,
                'date': self.date.isoformat() if self.date else None,
                'type': self.engagement_type
            })
        elif self.event_type == self.TYPE_COLLABORATION:
            base.update({
                'partner': self.partner,
                'image': self.image,
                'year': self.year
            })

        return base

    def __repr__(self):
        return f"<PressEvent {self.event_type}: {self.title}>"


class MediaKitItem(db.Model):
    """Media kit downloadable items"""
    __tablename__ = 'media_kit_items'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(20), nullable=False)  # PDF, ZIP, etc.
    file_size = db.Column(db.String(20), nullable=True)  # e.g., "2.5 MB"
    file_url = db.Column(db.String(500), nullable=True)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.file_type,
            'size': self.file_size,
            'url': self.file_url,
            'display_order': self.display_order
        }

    def __repr__(self):
        return f"<MediaKitItem {self.name}>"


class PressContact(db.Model):
    """Press contact information"""
    __tablename__ = 'press_contact'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False, default='Media Inquiries')
    description = db.Column(db.Text, nullable=True)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'email': self.email,
            'phone': self.phone,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<PressContact {self.email}>"


class MediaKitConfig(db.Model):
    """Media kit section configuration"""
    __tablename__ = 'media_kit_config'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False, default='Media Kit')
    description = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<MediaKitConfig {self.title}>"
