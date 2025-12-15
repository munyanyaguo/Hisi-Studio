"""Payment routes - Flutterwave payment integration"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Order, Payment
from app.services.payment_service import PaymentService
from app.middleware.auth_middleware import admin_required
from app.utils.responses import success_response, error_response, created_response
from functools import wraps

bp = Blueprint('payments', __name__, url_prefix='/api/v1/payments')


@bp.route('/initialize', methods=['POST'])
@jwt_required()
def initialize_payment():
    """
    Initialize payment for an order

    POST /api/v1/payments/initialize
    Body: {
        "order_id": "uuid",
        "redirect_url": "https://yoursite.com/payment/callback"
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        order_id = data.get('order_id')
        redirect_url = data.get('redirect_url')

        if not order_id:
            return error_response("order_id is required", status_code=400)

        if not redirect_url:
            return error_response("redirect_url is required", status_code=400)

        # Get order
        order = Order.query.get(order_id)
        if not order:
            return error_response("Order not found", status_code=404)

        # Verify order belongs to user
        if order.user_id != user_id:
            return error_response("Unauthorized access to order", status_code=403)

        # Check order status
        if order.status == 'cancelled':
            return error_response("Cannot pay for cancelled order", status_code=400)

        if order.payment_status == 'completed':
            return error_response("Order has already been paid", status_code=400)

        # Initialize payment
        customer_info = {
            'email': order.user.email,
            'phone': order.user.phone,
            'name': f"{order.user.first_name} {order.user.last_name}"
        }

        payment_data, error = PaymentService.initialize_payment(
            order=order,
            redirect_url=redirect_url,
            customer_info=customer_info
        )

        if error:
            return error_response(error, status_code=400)

        return created_response(
            data=payment_data,
            message="Payment initialized successfully"
        )

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/verify/<transaction_id>', methods=['GET'])
@jwt_required()
def verify_payment(transaction_id):
    """
    Verify payment status

    GET /api/v1/payments/verify/{transaction_id}
    """
    try:
        user_id = get_jwt_identity()

        # Get payment
        payment = PaymentService.get_payment_by_transaction_id(transaction_id)
        if not payment:
            return error_response("Payment not found", status_code=404)

        # Verify user owns this payment
        if payment.order.user_id != user_id:
            return error_response("Unauthorized access to payment", status_code=403)

        # Verify payment with Flutterwave
        verified_payment, error = PaymentService.verify_payment(transaction_id)

        if error:
            return error_response(error, status_code=400)

        return success_response(
            data={
                'payment': verified_payment.to_dict(),
                'order': {
                    'id': verified_payment.order.id,
                    'order_number': verified_payment.order.order_number,
                    'status': verified_payment.order.status,
                    'payment_status': verified_payment.order.payment_status
                }
            },
            message="Payment verified successfully"
        )

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/webhook', methods=['POST'])
def payment_webhook():
    """
    Flutterwave webhook endpoint

    POST /api/v1/payments/webhook

    This endpoint is called by Flutterwave when payment status changes
    """
    try:
        # Get signature from header
        signature = request.headers.get('verif-hash')

        if not signature:
            return error_response("Missing webhook signature", status_code=400)

        # Get payload
        payload = request.get_json()

        # Handle webhook
        success, error = PaymentService.handle_webhook(payload, signature)

        if error:
            return error_response(error, status_code=400)

        return success_response(message="Webhook processed successfully")

    except Exception as e:
        # Log error but return success to prevent Flutterwave retries
        print(f"Webhook error: {str(e)}")
        return success_response(message="Webhook received")


@bp.route('/<payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    """
    Get payment details

    GET /api/v1/payments/{payment_id}
    """
    try:
        user_id = get_jwt_identity()

        payment = Payment.query.get(payment_id)
        if not payment:
            return error_response("Payment not found", status_code=404)

        # Verify user owns this payment
        if payment.order.user_id != user_id:
            return error_response("Unauthorized access to payment", status_code=403)

        return success_response(data=payment.to_dict())

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/order/<order_id>', methods=['GET'])
@jwt_required()
def get_payment_by_order(order_id):
    """
    Get payment for an order

    GET /api/v1/payments/order/{order_id}
    """
    try:
        user_id = get_jwt_identity()

        order = Order.query.get(order_id)
        if not order:
            return error_response("Order not found", status_code=404)

        # Verify user owns this order
        if order.user_id != user_id:
            return error_response("Unauthorized access to order", status_code=403)

        payment = PaymentService.get_payment_by_order_id(order_id)
        if not payment:
            return error_response("No payment found for this order", status_code=404)

        return success_response(data=payment.to_dict())

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/<payment_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_payment(payment_id):
    """
    Cancel a pending payment

    PUT /api/v1/payments/{payment_id}/cancel
    Body: {
        "reason": "Customer changed mind"  // optional
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}

        payment = Payment.query.get(payment_id)
        if not payment:
            return error_response("Payment not found", status_code=404)

        # Verify user owns this payment
        if payment.order.user_id != user_id:
            return error_response("Unauthorized access to payment", status_code=403)

        reason = data.get('reason')
        success, error = PaymentService.cancel_payment(payment_id, reason)

        if error:
            return error_response(error, status_code=400)

        # Refresh payment
        payment = Payment.query.get(payment_id)
        return success_response(
            data=payment.to_dict(),
            message="Payment cancelled successfully"
        )

    except Exception as e:
        return error_response(str(e), status_code=500)


# Admin routes
@bp.route('/admin/payments', methods=['GET'])
@jwt_required()
@admin_required
def admin_list_payments(current_user):
    """
    List all payments (Admin only)

    GET /api/v1/payments/admin/payments?page=1&per_page=20&status=successful
    """
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        order_id = request.args.get('order_id')

        query = Payment.query

        # Apply filters
        if status:
            query = query.filter_by(status=status)
        if order_id:
            query = query.filter_by(order_id=order_id)

        # Order by created date (newest first)
        query = query.order_by(Payment.created_at.desc())

        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        payments = [payment.to_dict() for payment in pagination.items]

        return success_response(data={
            'payments': payments,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'total_pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        })

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/payments/<payment_id>/refund', methods=['POST'])
@jwt_required()
@admin_required
def admin_refund_payment(current_user, payment_id):
    """
    Initiate refund for a payment (Admin only)

    POST /api/v1/payments/admin/payments/{payment_id}/refund
    Body: {
        "amount": 1000.00,  // optional, full refund if not specified
        "reason": "Product defective"
    }
    """
    try:
        data = request.get_json() or {}
        amount = data.get('amount')
        reason = data.get('reason')

        if amount:
            try:
                amount = float(amount)
                if amount <= 0:
                    return error_response("Amount must be greater than 0", status_code=400)
            except ValueError:
                return error_response("Invalid amount", status_code=400)

        refund_data, error = PaymentService.initiate_refund(
            payment_id=payment_id,
            amount=amount,
            reason=reason
        )

        if error:
            return error_response(error, status_code=400)

        return success_response(
            data=refund_data,
            message="Refund initiated successfully"
        )

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/payments/<payment_id>', methods=['GET'])
@jwt_required()
@admin_required
def admin_get_payment(current_user, payment_id):
    """
    Get payment details (Admin only)

    GET /api/v1/payments/admin/payments/{payment_id}
    """
    try:
        payment = Payment.query.get(payment_id)
        if not payment:
            return error_response("Payment not found", status_code=404)

        # Include order details for admin
        payment_dict = payment.to_dict()
        payment_dict['order'] = {
            'id': payment.order.id,
            'order_number': payment.order.order_number,
            'status': payment.order.status,
            'payment_status': payment.order.payment_status,
            'total': float(payment.order.total),
            'user': {
                'id': payment.order.user.id,
                'email': payment.order.user.email,
                'name': f"{payment.order.user.first_name} {payment.order.user.last_name}"
            }
        }

        return success_response(data=payment_dict)

    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/admin/stats', methods=['GET'])
@jwt_required()
@admin_required
def admin_payment_stats(current_user):
    """
    Get payment statistics (Admin only)

    GET /api/v1/payments/admin/stats
    """
    try:
        from sqlalchemy import func

        # Total payments
        total_payments = Payment.query.count()

        # Successful payments
        successful_payments = Payment.query.filter_by(status='successful').count()

        # Total revenue
        total_revenue = db.session.query(func.sum(Payment.amount)).filter_by(
            status='successful'
        ).scalar() or 0

        # Pending payments
        pending_payments = Payment.query.filter_by(status='pending').count()

        # Failed payments
        failed_payments = Payment.query.filter_by(status='failed').count()

        # Refunded amount
        refunded_amount = db.session.query(func.sum(Payment.amount)).filter_by(
            status='refunded'
        ).scalar() or 0

        stats = {
            'total_payments': total_payments,
            'successful_payments': successful_payments,
            'pending_payments': pending_payments,
            'failed_payments': failed_payments,
            'total_revenue': float(total_revenue),
            'refunded_amount': float(refunded_amount),
            'net_revenue': float(total_revenue) - float(refunded_amount),
            'success_rate': round((successful_payments / total_payments * 100) if total_payments > 0 else 0, 2)
        }

        return success_response(data=stats)

    except Exception as e:
        return error_response(str(e), status_code=500)
