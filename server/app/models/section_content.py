"""SectionContent model for admin-editable website sections"""

from app.extensions import db
from datetime import datetime
import uuid
import json


class SectionContent(db.Model):
    """Model for editable section content on website pages"""
    __tablename__ = 'section_content'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Location identifiers
    page_name = db.Column(db.String(50), nullable=False, index=True)  # e.g., 'home', 'about'
    section_name = db.Column(db.String(50), nullable=False, index=True)  # e.g., 'hero', 'about_us', 'mission'
    content_key = db.Column(db.String(100), nullable=False)  # e.g., 'title', 'image_url', 'description'
    
    # Content
    content_value = db.Column(db.Text, nullable=True)  # The actual content (text, image URL, or JSON)
    content_type = db.Column(db.String(20), nullable=False, default='text')
    # Types: 'text', 'image', 'richtext', 'json', 'array'
    
    # Metadata
    label = db.Column(db.String(100), nullable=True)  # Human-readable label for admin UI
    description = db.Column(db.Text, nullable=True)  # Help text for admin
    display_order = db.Column(db.Integer, nullable=False, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=True)
    
    # Unique constraint for page + section + key
    __table_args__ = (
        db.UniqueConstraint('page_name', 'section_name', 'content_key', name='unique_section_content'),
        {'schema': 'hisi'}
    )

    def to_dict(self):
        """Convert section content to dictionary"""
        value = self.content_value
        
        # Parse JSON values if applicable
        if self.content_type in ['json', 'array'] and value:
            try:
                value = json.loads(value)
            except:
                pass
        
        return {
            'id': self.id,
            'page_name': self.page_name,
            'section_name': self.section_name,
            'content_key': self.content_key,
            'content_value': value,
            'content_type': self.content_type,
            'label': self.label,
            'description': self.description,
            'display_order': self.display_order,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<SectionContent {self.page_name}/{self.section_name}/{self.content_key}>"
