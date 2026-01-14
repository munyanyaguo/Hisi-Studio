"""Review model for customer-submitted reviews"""

from app.extensions import db
from datetime import datetime
import uuid


class Review(db.Model):
    """Customer review model - User-submitted reviews (separate from admin-curated testimonials)"""
    __tablename__ = 'reviews'
    __table_args__ = {'schema': 'hisi'}

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('hisi.users.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('hisi.products.id'), nullable=True)
    
    # Review content
    rating = db.Column(db.Integer, nullable=False, default=5)  # 1-5 stars
    title = db.Column(db.String(255), nullable=True)
    content = db.Column(db.Text, nullable=False)
    
    # Moderation
    is_approved = db.Column(db.Boolean, default=False, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    admin_notes = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    approved_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    user = db.relationship('User', backref='reviews', lazy=True)
    product = db.relationship('Product', backref='reviews', lazy=True)

    def to_dict(self, include_user=True):
        """Convert review to dictionary"""
        result = {
            'id': self.id,
            'rating': self.rating,
            'title': self.title,
            'content': self.content,
            'is_approved': self.is_approved,
            'is_featured': self.is_featured,
            'product_id': self.product_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        
        if include_user and self.user:
            result['user'] = {
                'id': self.user.id,
                'name': f"{self.user.first_name} {self.user.last_name}",
                'email': self.user.email
            }
        
        if self.product:
            result['product'] = {
                'id': self.product.id,
                'name': self.product.name
            }
        
        return result

    def __repr__(self):
        return f"<Review by {self.user_id} - {self.rating} stars>"
