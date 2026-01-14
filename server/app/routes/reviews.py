"""Reviews API routes"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_required
from app.extensions import db
from app.models import Review, User, Product
from app.utils.responses import (
    success_response, error_response, created_response,
    not_found_response, forbidden_response, paginated_response
)
from datetime import datetime

bp = Blueprint('reviews', __name__, url_prefix='/api/v1')


# ========== PUBLIC ROUTES ==========

@bp.route('/reviews', methods=['GET'])
def get_reviews():
    """Get all approved reviews (public)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        product_id = request.args.get('product_id')
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        
        query = Review.query.filter_by(is_approved=True)
        
        if product_id:
            query = query.filter_by(product_id=product_id)
        
        if featured_only:
            query = query.filter_by(is_featured=True)
        
        query = query.order_by(Review.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return paginated_response(
            items=[review.to_dict() for review in pagination.items],
            page=page,
            per_page=per_page,
            total=pagination.total
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/reviews/stats', methods=['GET'])
def get_reviews_stats():
    """Get review statistics (public)"""
    try:
        product_id = request.args.get('product_id')
        
        query = Review.query.filter_by(is_approved=True)
        
        if product_id:
            query = query.filter_by(product_id=product_id)
        
        reviews = query.all()
        total = len(reviews)
        
        if total == 0:
            return success_response(data={
                'total_reviews': 0,
                'average_rating': 0,
                'rating_distribution': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            })
        
        ratings = [r.rating for r in reviews]
        avg_rating = sum(ratings) / total
        distribution = {i: ratings.count(i) for i in range(1, 6)}
        
        return success_response(data={
            'total_reviews': total,
            'average_rating': round(avg_rating, 1),
            'rating_distribution': distribution
        })
    except Exception as e:
        return error_response(str(e), status_code=500)


# ========== AUTHENTICATED ROUTES ==========

@bp.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    """Create a new review (authenticated users only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return forbidden_response("User not found")
        
        data = request.get_json()
        
        # Validation
        if not data.get('content'):
            return error_response("Review content is required", status_code=400)
        
        rating = data.get('rating', 5)
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return error_response("Rating must be between 1 and 5", status_code=400)
        
        # Check if product exists if product_id provided
        product_id = data.get('product_id')
        if product_id:
            product = Product.query.get(product_id)
            if not product:
                return not_found_response("Product not found")
        
        # Create review (not approved by default - requires admin moderation)
        review = Review(
            user_id=user_id,
            product_id=product_id,
            rating=rating,
            title=data.get('title'),
            content=data['content'],
            is_approved=False  # Requires admin approval
        )
        
        db.session.add(review)
        db.session.commit()
        
        return created_response(
            data=review.to_dict(),
            message="Review submitted successfully! It will be visible after approval."
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== ADMIN ROUTES ==========

@bp.route('/admin/reviews', methods=['GET'])
@jwt_required()
def admin_get_reviews():
    """Get all reviews (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')  # 'pending', 'approved', 'all'
        
        query = Review.query
        
        if status == 'pending':
            query = query.filter_by(is_approved=False)
        elif status == 'approved':
            query = query.filter_by(is_approved=True)
        
        query = query.order_by(Review.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return paginated_response(
            items=[review.to_dict() for review in pagination.items],
            page=page,
            per_page=per_page,
            total=pagination.total
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/reviews/<review_id>', methods=['PUT'])
@jwt_required()
def admin_update_review(review_id):
    """Update/moderate a review (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        review = Review.query.get(review_id)
        if not review:
            return not_found_response("Review not found")
        
        data = request.get_json()
        
        # Update moderation fields
        if 'is_approved' in data:
            review.is_approved = data['is_approved']
            if review.is_approved and not review.approved_at:
                review.approved_at = datetime.utcnow()
        
        if 'is_featured' in data:
            review.is_featured = data['is_featured']
        
        if 'admin_notes' in data:
            review.admin_notes = data['admin_notes']
        
        db.session.commit()
        
        return success_response(data=review.to_dict(), message="Review updated successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/admin/reviews/<review_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_review(review_id):
    """Delete a review (admin)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin():
            return forbidden_response("Admin access required")
        
        review = Review.query.get(review_id)
        if not review:
            return not_found_response("Review not found")
        
        db.session.delete(review)
        db.session.commit()
        
        return success_response(message="Review deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)
