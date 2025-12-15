"""Payment service - Business logic for payment processing with Flutterwave"""

from app.extensions import db
from app.models import Payment, Order
from flask import current_app
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
import uuid
import requests
import hmac
import hashlib
import json


class PaymentService:
    """Service for managing payments with Flutterwave"""

    @staticmethod
    def generate_transaction_reference():
        """Generate unique transaction reference"""
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"HS-TXN-{timestamp}-{unique_id}"

    @staticmethod
    def initialize_payment(order, redirect_url, customer_info=None):
        """
        Initialize payment with Flutterwave

        Args:
            order: Order object
            redirect_url: URL to redirect after payment
            customer_info: Optional dict with customer details

        Returns:
            tuple: (payment_data, error)
        """
        try:
            # Check if order already has a payment
            if order.payment:
                if order.payment.status == 'successful':
                    return None, "Order has already been paid"
                # Allow retry for failed/pending payments
                tx_ref = order.payment.transaction_id
                payment = order.payment
            else:
                # Generate transaction reference
                tx_ref = PaymentService.generate_transaction_reference()

                # Create payment record
                payment = Payment(
                    id=str(uuid.uuid4()),
                    order_id=order.id,
                    transaction_id=tx_ref,
                    amount=order.total,
                    currency=order.currency,
                    status='pending',
                    customer_email=customer_info.get('email') if customer_info else order.user.email,
                    customer_phone=customer_info.get('phone') if customer_info else order.user.phone,
                    customer_name=f"{order.user.first_name} {order.user.last_name}" if order.user else None
                )
                db.session.add(payment)
                db.session.flush()

            # Prepare Flutterwave payment payload
            payload = {
                "tx_ref": tx_ref,
                "amount": str(order.total),
                "currency": order.currency,
                "redirect_url": redirect_url,
                "payment_options": "card,mobilemoney,ussd,banktransfer",
                "customer": {
                    "email": payment.customer_email,
                    "phonenumber": payment.customer_phone or "",
                    "name": payment.customer_name or f"{order.user.first_name} {order.user.last_name}"
                },
                "customizations": {
                    "title": "Hisi Studio",
                    "description": f"Payment for Order {order.order_number}",
                    "logo": current_app.config.get('SITE_LOGO_URL', '')
                },
                "meta": {
                    "order_id": order.id,
                    "order_number": order.order_number
                }
            }

            # Make request to Flutterwave
            headers = {
                "Authorization": f"Bearer {current_app.config['FLUTTERWAVE_SECRET_KEY']}",
                "Content-Type": "application/json"
            }

            response = requests.post(
                "https://api.flutterwave.com/v3/payments",
                json=payload,
                headers=headers,
                timeout=30
            )

            response_data = response.json()

            if response.status_code == 200 and response_data.get('status') == 'success':
                payment.payment_metadata = response_data
                payment.status = 'processing'
                db.session.commit()

                return {
                    'payment_id': payment.id,
                    'transaction_id': tx_ref,
                    'payment_link': response_data['data']['link'],
                    'order_id': order.id,
                    'order_number': order.order_number,
                    'amount': float(order.total),
                    'currency': order.currency
                }, None
            else:
                error_message = response_data.get('message', 'Failed to initialize payment')
                payment.status = 'failed'
                payment.failure_reason = error_message
                db.session.commit()
                return None, error_message

        except requests.exceptions.RequestException as e:
            db.session.rollback()
            return None, f"Payment gateway error: {str(e)}"
        except SQLAlchemyError as e:
            db.session.rollback()
            return None, f"Database error: {str(e)}"
        except Exception as e:
            db.session.rollback()
            return None, f"Unexpected error: {str(e)}"

    @staticmethod
    def verify_payment(transaction_id):
        """
        Verify payment with Flutterwave

        Args:
            transaction_id: Transaction reference

        Returns:
            tuple: (payment, error)
        """
        try:
            # Get payment record
            payment = Payment.query.filter_by(transaction_id=transaction_id).first()
            if not payment:
                return None, "Payment not found"

            # If already successful, return
            if payment.status == 'successful':
                return payment, None

            # Verify with Flutterwave
            headers = {
                "Authorization": f"Bearer {current_app.config['FLUTTERWAVE_SECRET_KEY']}",
                "Content-Type": "application/json"
            }

            response = requests.get(
                f"https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref={transaction_id}",
                headers=headers,
                timeout=30
            )

            response_data = response.json()

            if response.status_code == 200 and response_data.get('status') == 'success':
                transaction_data = response_data['data']

                # Check if payment was successful
                if transaction_data['status'] == 'successful':
                    # Verify amount
                    if float(transaction_data['amount']) >= float(payment.amount):
                        # Update payment record
                        payment.status = 'successful'
                        payment.flutterwave_transaction_id = transaction_data.get('id')
                        payment.flutterwave_tx_ref = transaction_data.get('tx_ref')
                        payment.payment_method = transaction_data.get('payment_type')
                        payment.completed_at = datetime.utcnow()
                        payment.payment_metadata = transaction_data

                        # Update order status
                        order = payment.order
                        order.payment_status = 'completed'
                        order.status = 'confirmed'
                        order.confirmed_at = datetime.utcnow()

                        db.session.commit()
                        return payment, None
                    else:
                        payment.status = 'failed'
                        payment.failure_reason = "Amount mismatch"
                        db.session.commit()
                        return None, "Payment amount does not match order total"
                else:
                    payment.status = 'failed'
                    payment.failure_reason = transaction_data.get('status')
                    db.session.commit()
                    return None, f"Payment {transaction_data.get('status')}"
            else:
                error_message = response_data.get('message', 'Failed to verify payment')
                return None, error_message

        except requests.exceptions.RequestException as e:
            return None, f"Payment gateway error: {str(e)}"
        except SQLAlchemyError as e:
            db.session.rollback()
            return None, f"Database error: {str(e)}"
        except Exception as e:
            db.session.rollback()
            return None, f"Unexpected error: {str(e)}"

    @staticmethod
    def handle_webhook(payload, signature):
        """
        Handle Flutterwave webhook

        Args:
            payload: Webhook payload
            signature: Webhook signature for verification

        Returns:
            tuple: (success, error)
        """
        try:
            # Verify webhook signature
            secret_hash = current_app.config['FLUTTERWAVE_SECRET_HASH']

            if signature != secret_hash:
                return False, "Invalid webhook signature"

            # Process webhook data
            event_type = payload.get('event')
            transaction_data = payload.get('data', {})

            if event_type == 'charge.completed':
                tx_ref = transaction_data.get('tx_ref')
                status = transaction_data.get('status')

                # Find payment
                payment = Payment.query.filter_by(transaction_id=tx_ref).first()
                if not payment:
                    return False, "Payment not found"

                # Update payment based on status
                if status == 'successful':
                    # Verify amount
                    if float(transaction_data['amount']) >= float(payment.amount):
                        payment.status = 'successful'
                        payment.flutterwave_transaction_id = transaction_data.get('id')
                        payment.payment_method = transaction_data.get('payment_type')
                        payment.completed_at = datetime.utcnow()
                        payment.payment_metadata = transaction_data

                        # Update order
                        order = payment.order
                        order.payment_status = 'completed'
                        order.status = 'confirmed'
                        order.confirmed_at = datetime.utcnow()
                    else:
                        payment.status = 'failed'
                        payment.failure_reason = "Amount mismatch"
                elif status == 'failed':
                    payment.status = 'failed'
                    payment.failure_reason = transaction_data.get('processor_response', 'Payment failed')
                else:
                    payment.status = status

                db.session.commit()
                return True, None

            return True, None

        except SQLAlchemyError as e:
            db.session.rollback()
            return False, f"Database error: {str(e)}"
        except Exception as e:
            db.session.rollback()
            return False, f"Unexpected error: {str(e)}"

    @staticmethod
    def initiate_refund(payment_id, amount=None, reason=None):
        """
        Initiate refund for a payment

        Args:
            payment_id: Payment ID
            amount: Amount to refund (None for full refund)
            reason: Reason for refund

        Returns:
            tuple: (refund_data, error)
        """
        try:
            # Get payment
            payment = Payment.query.get(payment_id)
            if not payment:
                return None, "Payment not found"

            if payment.status != 'successful':
                return None, "Can only refund successful payments"

            if payment.status == 'refunded':
                return None, "Payment already refunded"

            # Use full amount if not specified
            refund_amount = amount or float(payment.amount)

            if refund_amount > float(payment.amount):
                return None, "Refund amount cannot exceed payment amount"

            # Prepare refund payload
            payload = {
                "amount": refund_amount,
                "comments": reason or "Order cancelled - refund initiated"
            }

            # Make request to Flutterwave
            headers = {
                "Authorization": f"Bearer {current_app.config['FLUTTERWAVE_SECRET_KEY']}",
                "Content-Type": "application/json"
            }

            flw_transaction_id = payment.flutterwave_transaction_id
            if not flw_transaction_id:
                return None, "No Flutterwave transaction ID found"

            response = requests.post(
                f"https://api.flutterwave.com/v3/transactions/{flw_transaction_id}/refund",
                json=payload,
                headers=headers,
                timeout=30
            )

            response_data = response.json()

            if response.status_code == 200 and response_data.get('status') == 'success':
                # Update payment status
                payment.status = 'refunded'
                payment.payment_metadata = {
                    **payment.payment_metadata,
                    'refund': response_data['data']
                }

                # Update order
                order = payment.order
                order.payment_status = 'refunded'

                db.session.commit()

                return {
                    'payment_id': payment.id,
                    'transaction_id': payment.transaction_id,
                    'refund_amount': refund_amount,
                    'status': 'refunded',
                    'refund_id': response_data['data'].get('id')
                }, None
            else:
                error_message = response_data.get('message', 'Failed to process refund')
                return None, error_message

        except requests.exceptions.RequestException as e:
            return None, f"Payment gateway error: {str(e)}"
        except SQLAlchemyError as e:
            db.session.rollback()
            return None, f"Database error: {str(e)}"
        except Exception as e:
            db.session.rollback()
            return None, f"Unexpected error: {str(e)}"

    @staticmethod
    def get_payment_by_transaction_id(transaction_id):
        """Get payment by transaction ID"""
        return Payment.query.filter_by(transaction_id=transaction_id).first()

    @staticmethod
    def get_payment_by_order_id(order_id):
        """Get payment by order ID"""
        return Payment.query.filter_by(order_id=order_id).first()

    @staticmethod
    def cancel_payment(payment_id, reason=None):
        """
        Cancel a pending payment

        Args:
            payment_id: Payment ID
            reason: Cancellation reason

        Returns:
            tuple: (success, error)
        """
        try:
            payment = Payment.query.get(payment_id)
            if not payment:
                return False, "Payment not found"

            if payment.status == 'successful':
                return False, "Cannot cancel successful payment. Use refund instead."

            if payment.status == 'cancelled':
                return False, "Payment already cancelled"

            payment.status = 'cancelled'
            payment.failure_reason = reason or "Payment cancelled by user"

            # Update order
            order = payment.order
            order.payment_status = 'cancelled'

            db.session.commit()
            return True, None

        except SQLAlchemyError as e:
            db.session.rollback()
            return False, f"Database error: {str(e)}"
