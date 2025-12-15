"""Products routes"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Product, Category, User

bp = Blueprint('products', __name__, url_prefix='/api/v1/products')


@bp.route('', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    try:
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category = request.args.get('category', type=str)
        featured = request.args.get('featured', type=str)
        search = request.args.get('search', type=str)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort_by = request.args.get('sort_by', 'created_at', type=str)
        sort_order = request.args.get('sort_order', 'desc', type=str)

        # Build query
        query = Product.query.filter_by(is_active=True)

        # Apply filters
        if category:
            cat = Category.query.filter_by(slug=category).first()
            if cat:
                query = query.filter_by(category_id=cat.id)

        if featured == 'true':
            query = query.filter_by(is_featured=True)

        if search:
            query = query.filter(
                db.or_(
                    Product.name.ilike(f'%{search}%'),
                    Product.description.ilike(f'%{search}%')
                )
            )

        if min_price is not None:
            query = query.filter(Product.price >= min_price)

        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        # Apply sorting
        if sort_by == 'price':
            if sort_order == 'asc':
                query = query.order_by(Product.price.asc())
            else:
                query = query.order_by(Product.price.desc())
        elif sort_by == 'name':
            if sort_order == 'asc':
                query = query.order_by(Product.name.asc())
            else:
                query = query.order_by(Product.name.desc())
        else:  # created_at
            if sort_order == 'asc':
                query = query.order_by(Product.created_at.asc())
            else:
                query = query.order_by(Product.created_at.desc())

        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            'products': [product.to_dict() for product in pagination.items],
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total_pages': pagination.pages,
                'total_items': pagination.total,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    try:
        product = Product.query.filter_by(id=product_id, is_active=True).first()

        if not product:
            return jsonify({'error': 'Product not found'}), 404

        return jsonify({
            'product': product.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/slug/<slug>', methods=['GET'])
def get_product_by_slug(slug):
    """Get a single product by slug"""
    try:
        product = Product.query.filter_by(slug=slug, is_active=True).first()

        if not product:
            return jsonify({'error': 'Product not found'}), 404

        return jsonify({
            'product': product.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    """Create a new product (admin only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'slug', 'price', 'sku']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Check if slug already exists
        if Product.query.filter_by(slug=data['slug']).first():
            return jsonify({'error': 'Slug already exists'}), 409

        # Create product
        product = Product(
            name=data['name'],
            slug=data['slug'],
            description=data.get('description'),
            short_description=data.get('short_description'),
            price=data['price'],
            original_price=data.get('original_price'),
            sku=data['sku'],
            stock_quantity=data.get('stock_quantity', 0),
            category_id=data.get('category_id'),
            brand=data.get('brand'),
            gender=data.get('gender'),
            accessibility_features=data.get('accessibility_features'),
            main_image=data.get('main_image'),
            hover_image=data.get('hover_image'),
            images=data.get('images'),
            badge=data.get('badge'),
            is_featured=data.get('is_featured', False)
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp.route('/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product (admin only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        data = request.get_json()

        # Update allowed fields
        allowed_fields = [
            'name', 'slug', 'description', 'short_description',
            'price', 'original_price', 'sku', 'stock_quantity',
            'category_id', 'brand', 'gender', 'accessibility_features',
            'main_image', 'hover_image', 'images', 'badge',
            'is_featured', 'is_active'
        ]

        for field in allowed_fields:
            if field in data:
                setattr(product, field, data[field])

        db.session.commit()

        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp.route('/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product (admin only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        db.session.delete(product)
        db.session.commit()

        return jsonify({
            'message': 'Product deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Categories endpoints
@bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.filter_by(is_active=True).order_by(Category.display_order).all()

        return jsonify({
            'categories': [cat.to_dict() for cat in categories]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
