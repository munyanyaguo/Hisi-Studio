"""Address model"""

from app.extensions import db
from datetime import datetime
import uuid

class UserAddress(db.Model):
    """User address model for shipping and billing"""
    __tablename__ = 'user_addresses'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=False)

    # Address details
    full_name = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address_line1 = db.Column(db.String(255), nullable=False)
    address_line2 = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False)
    state_province = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    country = db.Column(db.String(100), nullable=False, default='Kenya')

    # Address type and settings
    address_type = db.Column(db.String(20), nullable=False, default='both')  # 'shipping', 'billing', 'both'
    is_default = db.Column(db.Boolean, default=False, nullable=False)

    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref='addresses', lazy=True)

    def to_dict(self):
        """Convert address to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'phone': self.phone,
            'address_line1': self.address_line1,
            'address_line2': self.address_line2,
            'city': self.city,
            'state_province': self.state_province,
            'postal_code': self.postal_code,
            'country': self.country,
            'address_type': self.address_type,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<UserAddress {self.full_name} - {self.city}>"
