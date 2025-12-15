"""Cart routes"""

from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models import Cart, CartItem
from app.services.cart_service import CartService
from app.utils.responses import success_response, error_response, created_response

bp = Blueprint('cart', __name__, url_prefix='/api/v1/cart')


def get_cart_identifier():
    """Get cart identifier (user_id or session_id)"""
    try:
        user_id = get_jwt_identity()
        return {'user_id': user_id}, None
    except:
        # Guest user - use session
        if 'cart_session_id' not in session:
            import uuid
            session['cart_session_id'] = str(uuid.uuid4())
        return {'session_id': session['cart_session_id']}, None


@bp.route('', methods=['GET'])
def get_cart():
    """Get current cart"""
    try:
        cart_id, error = get_cart_identifier()
        if error:
            return error_response(error, status_code=400)

        cart = CartService.get_or_create_cart(**cart_id)
        if not cart:
            return error_response("Unable to get cart", status_code=500)

        return success_response(data=cart.to_dict())
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/items', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        if not product_id:
            return error_response("product_id is required", status_code=400)

        try:
            quantity = int(quantity)
            if quantity < 1:
                return error_response("Quantity must be at least 1", status_code=400)
        except ValueError:
            return error_response("Invalid quantity", status_code=400)

        # Get or create cart
        cart_id, error = get_cart_identifier()
        if error:
            return error_response(error, status_code=400)

        cart = CartService.get_or_create_cart(**cart_id)

        # Add to cart
        cart_item, error = CartService.add_to_cart(cart, product_id, quantity)
        if error:
            return error_response(error, status_code=400)

        # Return updated cart
        cart = Cart.query.get(cart.id)  # Refresh
        return created_response(data=cart.to_dict(), message="Item added to cart")
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/items/<item_id>', methods=['PUT'])
def update_cart_item(item_id):
    """Update cart item quantity"""
    try:
        data = request.get_json()
        quantity = data.get('quantity')

        if quantity is None:
            return error_response("quantity is required", status_code=400)

        try:
            quantity = int(quantity)
        except ValueError:
            return error_response("Invalid quantity", status_code=400)

        cart_item, error = CartService.update_cart_item(item_id, quantity)
        if error:
            return error_response(error, status_code=400)

        # Return updated cart
        cart = Cart.query.get(cart_item.cart_id)
        return success_response(data=cart.to_dict(), message="Cart updated")
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/items/<item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    """Remove item from cart"""
    try:
        cart_item = CartItem.query.get(item_id)
        if not cart_item:
            return error_response("Cart item not found", status_code=404)

        cart_id = cart_item.cart_id
        success, error = CartService.remove_from_cart(item_id)
        if error:
            return error_response(error, status_code=400)

        # Return updated cart
        cart = Cart.query.get(cart_id)
        return success_response(data=cart.to_dict() if cart else None, message="Item removed from cart")
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('', methods=['DELETE'])
def clear_cart():
    """Clear all items from cart"""
    try:
        cart_id, error = get_cart_identifier()
        if error:
            return error_response(error, status_code=400)

        cart = CartService.get_or_create_cart(**cart_id)
        success, error = CartService.clear_cart(cart.id)
        if error:
            return error_response(error, status_code=400)

        return success_response(message="Cart cleared")
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/merge', methods=['POST'])
@jwt_required()
def merge_carts():
    """Merge guest cart into user cart after login"""
    try:
        user_id = get_jwt_identity()

        if 'cart_session_id' not in session:
            return success_response(message="No guest cart to merge")

        session_id = session['cart_session_id']
        success, error = CartService.merge_guest_cart_to_user(session_id, user_id)
        if error:
            return error_response(error, status_code=400)

        # Clear session
        session.pop('cart_session_id', None)

        # Return merged cart
        cart = CartService.get_or_create_cart(user_id=user_id)
        return success_response(data=cart.to_dict(), message="Carts merged successfully")
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/validate', methods=['POST'])
def validate_cart():
    """Validate cart stock before checkout"""
    try:
        cart_id, error = get_cart_identifier()
        if error:
            return error_response(error, status_code=400)

        cart = CartService.get_or_create_cart(**cart_id)
        valid, errors = CartService.validate_cart_stock(cart)

        if not valid:
            return error_response("Cart validation failed", errors=errors, status_code=400)

        return success_response(message="Cart is valid", data=cart.to_dict())
    except Exception as e:
        return error_response(str(e), status_code=500)
