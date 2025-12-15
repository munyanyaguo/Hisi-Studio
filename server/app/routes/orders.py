"""Order routes"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Order, User, Cart, UserAddress
from app.services.order_service import OrderService
from app.services.cart_service import CartService
from app.utils.responses import (
    success_response, error_response, created_response,
    not_found_response, forbidden_response, paginated_response
)

bp = Blueprint('orders', __name__, url_prefix='/api/v1/orders')


@bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    """Create order from cart"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()

        # Get shipping address
        shipping_address_id = data.get('shipping_address_id')
        if not shipping_address_id:
            return error_response("shipping_address_id is required", status_code=400)

        address = UserAddress.query.filter_by(
            id=shipping_address_id,
            user_id=user_id
        ).first()

        if not address:
            return error_response("Shipping address not found", status_code=404)

        # Convert address to dict for JSON storage
        shipping_address = address.to_dict()

        # Get billing address (use shipping if not provided)
        billing_address_id = data.get('billing_address_id')
        if billing_address_id:
            billing_addr = UserAddress.query.filter_by(
                id=billing_address_id,
                user_id=user_id
            ).first()
            billing_address = billing_addr.to_dict() if billing_addr else shipping_address
        else:
            billing_address = shipping_address

        # Get user's cart
        cart = CartService.get_or_create_cart(user_id=user_id)
        if not cart or not cart.items:
            return error_response("Cart is empty", status_code=400)

        # Validate cart stock
        valid, errors = CartService.validate_cart_stock(cart)
        if not valid:
            return error_response("Cart validation failed", errors=errors, status_code=400)

        # Create order
        order, error = OrderService.create_order_from_cart(
            cart=cart,
            user=user,
            shipping_address=shipping_address,
            billing_address=billing_address,
            notes=data.get('notes')
        )

        if error:
            return error_response(error, status_code=400)

        return created_response(
            data=order.to_dict(include_items=True),
            message="Order created successfully"
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('', methods=['GET'])
@jwt_required()
def get_user_orders():
    """Get current user's orders"""
    try:
        user_id = get_jwt_identity()

        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        # Status filter
        status = request.args.get('status')

        query = Order.query.filter_by(user_id=user_id)

        if status:
            query = query.filter_by(status=status)

        query = query.order_by(Order.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return paginated_response(
            items=[order.to_dict() for order in pagination.items],
            page=page,
            per_page=per_page,
            total=pagination.total,
            message="Orders retrieved successfully"
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get order details"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        order = Order.query.get(order_id)
        if not order:
            return not_found_response("Order not found")

        # Check if user owns this order or is admin
        if order.user_id != user_id and user.role != 'admin':
            return forbidden_response("Access denied")

        return success_response(data=order.to_dict(include_items=True))
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/<order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    """Cancel order"""
    try:
        user_id = get_jwt_identity()
        order = Order.query.get(order_id)

        if not order:
            return not_found_response("Order not found")

        # Check ownership
        if order.user_id != user_id:
            return forbidden_response("Access denied")

        data = request.get_json()
        reason = data.get('reason', 'Customer requested cancellation')

        order, error = OrderService.cancel_order(order_id, reason)
        if error:
            return error_response(error, status_code=400)

        return success_response(
            data=order.to_dict(),
            message="Order cancelled successfully"
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


# Admin Routes
@bp.route('/admin/orders', methods=['GET'])
@jwt_required()
def admin_get_orders():
    """Get all orders (admin only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'admin':
            return forbidden_response("Admin access required")

        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        # Filters
        status = request.args.get('status')
        payment_status = request.args.get('payment_status')
        search = request.args.get('search')  # Search by order number or customer email

        query = Order.query

        if status:
            query = query.filter_by(status=status)

        if payment_status:
            query = query.filter_by(payment_status=payment_status)

        if search:
            query = query.join(User).filter(
                db.or_(
                    Order.order_number.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )

        query = query.order_by(Order.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return paginated_response(
            items=[order.to_dict(include_items=True) for order in pagination.items],
            page=page,
            per_page=per_page,
            total=pagination.total,
            message="Orders retrieved successfully"
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/orders/<order_id>/status', methods=['PUT'])
@jwt_required()
def admin_update_order_status(order_id):
    """Update order status (admin only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'admin':
            return forbidden_response("Admin access required")

        data = request.get_json()
        new_status = data.get('status')
        admin_notes = data.get('notes')

        if not new_status:
            return error_response("status is required", status_code=400)

        order, error = OrderService.update_order_status(order_id, new_status, admin_notes)
        if error:
            return error_response(error, status_code=400)

        return success_response(
            data=order.to_dict(),
            message=f"Order status updated to {new_status}"
        )
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/orders/<order_id>/tracking', methods=['PUT'])
@jwt_required()
def admin_add_tracking(order_id):
    """Add tracking number (admin only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'admin':
            return forbidden_response("Admin access required")

        data = request.get_json()
        tracking_number = data.get('tracking_number')

        if not tracking_number:
            return error_response("tracking_number is required", status_code=400)

        order, error = OrderService.add_tracking_number(order_id, tracking_number)
        if error:
            return error_response(error, status_code=400)

        return success_response(
            data=order.to_dict(),
            message="Tracking number added successfully"
        )
    except Exception as e:
        return error_response(str(e), status_code=500)
