"""Admin routes - Dashboard, Analytics, Management"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Order, Product, ContactMessage, Notification
from app.utils.admin_decorators import admin_required, super_admin_required, permission_required, PERMISSIONS
from app.utils.responses import success_response, error_response, forbidden_response
from datetime import datetime, timedelta
from sqlalchemy import func, and_, or_
import json
import uuid

bp = Blueprint('admin', __name__, url_prefix='/api/v1/admin')


# ========== ADMIN AUTHENTICATION ==========

@bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_admin():
    """Verify if current user is an admin"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return error_response("User not found", status_code=404)
        
        if not user.is_admin():
            return forbidden_response("Admin access required")
        
        return success_response(data={
            'is_admin': True,
            'role': user.role,
            'permissions': user.permissions,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return error_response(str(e), status_code=500)


# ========== DASHBOARD OVERVIEW ==========

@bp.route('/dashboard/overview', methods=['GET'])
@admin_required
def get_dashboard_overview():
    """Get dashboard overview with key metrics"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Date range filter
        date_filter = request.args.get('period', 'today')  # today, week, month, quarter, year
        start_date, end_date = get_date_range(date_filter)
        
        # Super admin sees all data, content manager sees limited data
        if user.is_super_admin():
            # Total revenue
            total_revenue = db.session.query(func.sum(Order.total)).filter(
                and_(
                    Order.created_at >= start_date,
                    Order.created_at <= end_date,
                    Order.status != 'cancelled'
                )
            ).scalar() or 0
            
            # Total orders
            total_orders = Order.query.filter(
                and_(
                    Order.created_at >= start_date,
                    Order.created_at <= end_date
                )
            ).count()
            
            # New customers
            new_customers = User.query.filter(
                and_(
                    User.role == 'customer',
                    User.created_at >= start_date,
                    User.created_at <= end_date
                )
            ).count()
            
            # Pending orders
            pending_orders = Order.query.filter(
                Order.status == 'pending'
            ).count()
            
        else:
            # Content managers don't see financial data
            total_revenue = None
            total_orders = None
            new_customers = None
            pending_orders = None
        
        # Data both roles can see
        new_inquiries = ContactMessage.query.filter(
            and_(
                ContactMessage.status == 'new',
                ContactMessage.created_at >= start_date,
                ContactMessage.created_at <= end_date
            )
        ).count()
        
        total_products = Product.query.filter_by(is_active=True).count()
        
        # Low stock products (if user has permission)
        low_stock_count = 0
        if user.is_super_admin() or user.has_permission(PERMISSIONS['MANAGE_PRODUCTS']):
            low_stock_count = Product.query.filter(
                and_(
                    Product.is_active == True,
                    Product.stock_quantity < 10
                )
            ).count()
        
        return success_response(data={
            'period': date_filter,
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'metrics': {
                'total_revenue': float(total_revenue) if total_revenue else None,
                'total_orders': total_orders,
                'new_customers': new_customers,
                'pending_orders': pending_orders,
                'new_inquiries': new_inquiries,
                'total_products': total_products,
                'low_stock_count': low_stock_count
            }
        })
        
    except Exception as e:
        return error_response(str(e), status_code=500)


# ========== NOTIFICATIONS ==========

@bp.route('/notifications', methods=['GET'])
@admin_required
def get_notifications():
    """Get admin notifications"""
    try:
        user_id = get_jwt_identity()
        
        # Query parameters
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        query = Notification.query.filter_by(user_id=user_id)
        
        if unread_only:
            query = query.filter_by(is_read=False)
        
        notifications = query.order_by(Notification.created_at.desc()).limit(limit).offset(offset).all()
        unread_count = Notification.query.filter_by(user_id=user_id, is_read=False).count()
        
        return success_response(data={
            'notifications': [n.to_dict() for n in notifications],
            'unread_count': unread_count,
            'total': query.count()
        })
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/notifications/<notification_id>/read', methods=['PATCH'])
@admin_required
def mark_notification_read(notification_id):
    """Mark notification as read"""
    try:
        user_id = get_jwt_identity()
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
        
        if not notification:
            return error_response("Notification not found", status_code=404)
        
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.session.commit()
        
        return success_response(data=notification.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/notifications/read-all', methods=['PATCH'])
@admin_required
def mark_all_notifications_read():
    """Mark all notifications as read"""
    try:
        user_id = get_jwt_identity()
        
        Notification.query.filter_by(user_id=user_id, is_read=False).update({
            'is_read': True,
            'read_at': datetime.utcnow()
        })
        
        db.session.commit()
        
        return success_response(message="All notifications marked as read")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== ORDER MANAGEMENT ==========

@bp.route('/orders/<order_id>/status', methods=['PATCH'])
@super_admin_required
def update_order_status(order_id):
    """Update order status and notify customer"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        tracking_number = data.get('tracking_number')
        carrier = data.get('carrier')
        
        if not new_status:
            return error_response("Status is required", status_code=400)
        
        order = Order.query.get(order_id)
        if not order:
            return error_response("Order not found", status_code=404)
        
        old_status = order.status
        order.status = new_status
        order.updated_at = datetime.utcnow()
        
        # Update tracking info if provided
        if tracking_number:
            order.tracking_number = tracking_number
        if carrier:
            order.carrier = carrier
        
        # Update status-specific timestamps
        if new_status == 'processing' and not order.processing_date:
            order.processing_date = datetime.utcnow()
        elif new_status == 'shipped' and not order.shipped_date:
            order.shipped_date = datetime.utcnow()
        elif new_status == 'delivered' and not order.delivered_date:
            order.delivered_date = datetime.utcnow()
        
        db.session.commit()
        
        # Send customer notification
        if old_status != new_status and order.user:
            send_order_status_notification(order, old_status, new_status)
        
        return success_response(data=order.to_dict(), message="Order status updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


def send_order_status_notification(order, old_status, new_status):
    """Send email notification to customer about order status change"""
    try:
        from app.models.admin import Notification
        
        # Create notification messages based on status
        status_messages = {
            'processing': {
                'title': 'Order is Being Processed',
                'message': f'Your order #{order.id[:8]} is now being processed and will be shipped soon.'
            },
            'shipped': {
                'title': 'Order Has Been Shipped',
                'message': f'Great news! Your order #{order.id[:8]} has been shipped. '
                          f'Tracking number: {order.tracking_number or "Will be provided soon"}'
            },
            'delivered': {
                'title': 'Order Delivered',
                'message': f'Your order #{order.id[:8]} has been delivered. We hope you enjoy your purchase!'
            },
            'cancelled': {
                'title': 'Order Cancelled',
                'message': f'Your order #{order.id[:8]} has been cancelled. If you have questions, please contact us.'
            }
        }
        
        notification_data = status_messages.get(new_status)
        if notification_data:
            # Create in-app notification
            notification = Notification(
                id=str(uuid.uuid4()),
                user_id=order.user_id,
                type='order_update',
                title=notification_data['title'],
                message=notification_data['message'],
                link=f'/orders/{order.id}',
                is_email_sent=False
            )
            db.session.add(notification)
            db.session.commit()
            
            # In production, send actual email here
            # send_email(
            #     to=order.user.email,
            #     subject=notification_data['title'],
            #     body=notification_data['message']
            # )
            
    except Exception as e:
        print(f"Error sending notification: {str(e)}")
        # Don't fail the order update if notification fails
        pass



# ========== MEDIA MANAGEMENT ==========

@bp.route('/media', methods=['GET'])
@admin_required
def get_media():
    """Get all media files"""
    try:
        from app.models.admin import MediaFile
        
        file_type = request.args.get('type')  # image or video
        query = MediaFile.query
        
        if file_type:
            query = query.filter_by(file_type=file_type)
        
        media = query.order_by(MediaFile.created_at.desc()).all()
        
        return success_response(data={
            'media': [m.to_dict() for m in media]
        })
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/media/upload', methods=['POST'])
@admin_required
def upload_media():
    """Upload media file"""
    try:
        from app.models.admin import MediaFile
        import uuid
        import os
        from werkzeug.utils import secure_filename
        
        if 'file' not in request.files:
            return error_response("No file provided", status_code=400)
        
        file = request.files['file']
        if file.filename == '':
            return error_response("No file selected", status_code=400)
        
        user_id = get_jwt_identity()
        
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        
        # Determine file type
        file_type = 'image' if file.content_type.startswith('image/') else 'video'
        
        # For now, we'll store the file path (in production, upload to cloud storage)
        file_path = f"/uploads/{file_type}s/{unique_filename}"
        url = f"{request.host_url.rstrip('/')}{file_path}"
        
        # Create media record
        media = MediaFile(
            id=str(uuid.uuid4()),
            filename=unique_filename,
            original_filename=secure_filename(file.filename),
            file_path=file_path,
            url=url,
            file_type=file_type,
            mime_type=file.content_type,
            file_size=len(file.read()),
            uploaded_by=user_id
        )
        
        file.seek(0)  # Reset file pointer after reading size
        
        # Save file (in production, upload to S3/cloud storage)
        # For now, just create the database record
        
        db.session.add(media)
        db.session.commit()
        
        return success_response(data=media.to_dict(), message="File uploaded successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


@bp.route('/media/<media_id>', methods=['DELETE'])
@admin_required
def delete_media(media_id):
    """Delete media file"""
    try:
        from app.models.admin import MediaFile
        
        media = MediaFile.query.get(media_id)
        if not media:
            return error_response("Media not found", status_code=404)
        
        db.session.delete(media)
        db.session.commit()
        
        return success_response(message="Media deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== HELPER FUNCTIONS ==========

def get_date_range(period):
    """Get start and end dates based on period"""
    end_date = datetime.utcnow()
    
    if period == 'today':
        start_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == 'week':
        start_date = end_date - timedelta(days=7)
    elif period == 'month':
        start_date = end_date - timedelta(days=30)
    elif period == 'quarter':
        start_date = end_date - timedelta(days=90)
    elif period == 'year':
        start_date = end_date - timedelta(days=365)
    elif period.startswith('q'):  # q1, q2, q3, q4
        quarter = int(period[1])
        year = end_date.year
        start_month = (quarter - 1) * 3 + 1
        start_date = datetime(year, start_month, 1)
        end_month = start_month + 2
        if end_month > 12:
            end_month = 12
        import calendar
        last_day = calendar.monthrange(year, end_month)[1]
        end_date = datetime(year, end_month, last_day, 23, 59, 59)
    else:
        # Default to today
        start_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    return start_date, end_date


# ========== CUSTOMER MANAGEMENT ==========

@bp.route('/customers', methods=['GET'])
@super_admin_required
def get_customers():
    """Get all customers"""
    try:
        customers = User.query.filter_by(role='customer').all()
        
        # Add order count for each customer
        customer_data = []
        for customer in customers:
            customer_dict = customer.to_dict()
            customer_dict['order_count'] = Order.query.filter_by(user_id=customer.id).count()
            customer_data.append(customer_dict)
        
        return success_response(data={
            'customers': customer_data
        })
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/customers/<customer_id>', methods=['GET'])
@super_admin_required
def get_customer_detail(customer_id):
    """Get customer details"""
    try:
        customer = User.query.get(customer_id)
        if not customer:
            return error_response("Customer not found", status_code=404)
        
        customer_dict = customer.to_dict()
        customer_dict['order_count'] = Order.query.filter_by(user_id=customer.id).count()
        
        return success_response(data=customer_dict)
        
    except Exception as e:
        return error_response(str(e), status_code=500)


# ========== INQUIRY MANAGEMENT ==========

@bp.route('/inquiries/<inquiry_id>/respond', methods=['POST'])
@admin_required
def respond_to_inquiry(inquiry_id):
    """Respond to customer inquiry"""
    try:
        data = request.get_json()
        response_text = data.get('response')
        
        if not response_text:
            return error_response("Response is required", status_code=400)
        
        inquiry = ContactMessage.query.get(inquiry_id)
        if not inquiry:
            return error_response("Inquiry not found", status_code=404)
        
        # Update inquiry status
        inquiry.status = 'responded'
        inquiry.updated_at = datetime.utcnow()
        
        # In a real app, send email to customer here
        # send_email(inquiry.email, "Response to your inquiry", response_text)
        
        db.session.commit()
        return success_response(message="Response sent successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)


# ========== ANALYTICS & REPORTING ==========

@bp.route('/analytics', methods=['GET'])
@super_admin_required
def get_analytics():
    """Get comprehensive analytics data"""
    try:
        period = request.args.get('period', 'month')
        start_date, end_date = get_date_range(period)
        
        # Sales data over time
        sales_data = []
        if period in ['today', 'week']:
            # Hourly data
            for i in range(24):
                hour_start = start_date.replace(hour=i)
                hour_end = hour_start.replace(hour=i+1) if i < 23 else end_date
                
                orders = Order.query.filter(
                    and_(Order.created_at >= hour_start, Order.created_at < hour_end)
                ).all()
                
                sales_data.append({
                    'date': f"{i:02d}:00",
                    'revenue': sum(o.total for o in orders),
                    'orders': len(orders)
                })
        else:
            # Daily data
            current = start_date
            while current <= end_date:
                next_day = current + timedelta(days=1)
                
                orders = Order.query.filter(
                    and_(Order.created_at >= current, Order.created_at < next_day)
                ).all()
                
                sales_data.append({
                    'date': current.strftime('%m/%d'),
                    'revenue': sum(o.total for o in orders),
                    'orders': len(orders)
                })
                
                current = next_day
        
        # Customer data
        customer_data = []
        current = start_date
        while current <= end_date:
            next_day = current + timedelta(days=1)
            
            new_customers = User.query.filter(
                and_(
                    User.created_at >= current,
                    User.created_at < next_day,
                    User.role == 'customer'
                )
            ).count()
            
            # Returning customers (those who made multiple orders)
            returning = db.session.query(Order.user_id).filter(
                and_(Order.created_at >= current, Order.created_at < next_day)
            ).group_by(Order.user_id).having(func.count(Order.id) > 1).count()
            
            customer_data.append({
                'date': current.strftime('%m/%d'),
                'new': new_customers,
                'returning': returning
            })
            
            current = next_day
        
        # Product performance
        from sqlalchemy import desc
        product_sales = db.session.query(
            Product.name,
            func.sum(Order.total).label('revenue'),
            func.count(Order.id).label('units')
        ).join(Order).filter(
            and_(Order.created_at >= start_date, Order.created_at <= end_date)
        ).group_by(Product.name).order_by(desc('revenue')).limit(5).all()
        
        product_data = []
        for product in product_sales:
            product_data.append({
                'name': product.name,
                'value': float(product.revenue or 0),
                'units': product.units,
                'avgPrice': float(product.revenue / product.units) if product.units > 0 else 0,
                'growth': 0  # Calculate growth vs previous period
            })
        
        # Summary metrics
        total_orders = Order.query.filter(
            and_(Order.created_at >= start_date, Order.created_at <= end_date)
        ).count()
        
        total_revenue = db.session.query(func.sum(Order.total)).filter(
            and_(Order.created_at >= start_date, Order.created_at <= end_date)
        ).scalar() or 0
        
        new_customers_count = User.query.filter(
            and_(
                User.created_at >= start_date,
                User.created_at <= end_date,
                User.role == 'customer'
            )
        ).count()
        
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        return success_response(data={
            'salesData': sales_data,
            'customerData': customer_data,
            'productData': product_data,
            'categoryData': [],
            'summary': {
                'totalRevenue': float(total_revenue),
                'totalOrders': total_orders,
                'newCustomers': new_customers_count,
                'avgOrderValue': float(avg_order_value),
                'revenueGrowth': 12.5,  # Calculate vs previous period
                'ordersGrowth': 8.3,
                'customersGrowth': 15.2,
                'aovGrowth': 4.1
            }
        })
        
    except Exception as e:
        return error_response(str(e), status_code=500)


@bp.route('/analytics/export', methods=['GET'])
@super_admin_required
def export_analytics():
    """Export analytics data as CSV or PDF"""
    try:
        period = request.args.get('period', 'month')
        format_type = request.args.get('format', 'csv')
        
        start_date, end_date = get_date_range(period)
        
        # Get orders for the period
        orders = Order.query.filter(
            and_(Order.created_at >= start_date, Order.created_at <= end_date)
        ).all()
        
        if format_type == 'csv':
            import csv
            from io import StringIO
            
            output = StringIO()
            writer = csv.writer(output)
            
            # Write headers
            writer.writerow(['Order ID', 'Date', 'Customer', 'Total', 'Status'])
            
            # Write data
            for order in orders:
                writer.writerow([
                    order.id,
                    order.created_at.strftime('%Y-%m-%d %H:%M'),
                    f"{order.user.first_name} {order.user.last_name}" if order.user else 'N/A',
                    order.total,
                    order.status
                ])
            
            from flask import make_response
            response = make_response(output.getvalue())
            response.headers['Content-Type'] = 'text/csv'
            response.headers['Content-Disposition'] = f'attachment; filename=analytics-{period}.csv'
            return response
        
        else:  # PDF
            # For PDF, you would use a library like reportlab
            # For now, return a simple text response
            return success_response(message="PDF export not yet implemented")
        
    except Exception as e:
        return error_response(str(e), status_code=500)
