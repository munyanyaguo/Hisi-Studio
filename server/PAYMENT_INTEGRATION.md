# Flutterwave Payment Integration Guide

## Overview

Hisi Studio uses **Flutterwave** as its payment gateway to process payments for orders. This guide covers the complete payment flow, API endpoints, and integration details.

---

## Table of Contents

1. [Setup](#setup)
2. [Payment Flow](#payment-flow)
3. [API Endpoints](#api-endpoints)
4. [Testing](#testing)
5. [Webhooks](#webhooks)
6. [Error Handling](#error-handling)
7. [Security](#security)

---

## Setup

### 1. Get Flutterwave Credentials

1. Sign up at [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to **Settings** → **APIs**
3. Copy your keys:
   - Public Key
   - Secret Key
   - Encryption Key
4. Generate a webhook secret hash

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxx
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TESTxxxxxxxxxxxxx
FLUTTERWAVE_SECRET_HASH=your-webhook-secret-hash
```

### 3. Install Dependencies

```bash
cd server
pipenv install rave-python requests
```

---

## Payment Flow

### Complete E-Commerce Flow

```
1. Customer browses products
   ↓
2. Adds items to cart
   ↓
3. Proceeds to checkout
   ↓
4. Creates order (status: 'pending', payment_status: 'pending')
   ↓
5. Initializes payment → Gets payment link
   ↓
6. Redirected to Flutterwave payment page
   ↓
7. Enters payment details
   ↓
8. Payment processed by Flutterwave
   ↓
9. Redirected back to your app
   ↓
10. Backend verifies payment
   ↓
11. Order updated (status: 'confirmed', payment_status: 'completed')
   ↓
12. Customer sees order confirmation
```

---

## API Endpoints

### 1. Initialize Payment

**Endpoint:** `POST /api/v1/payments/initialize`

**Description:** Initialize a payment for an order and get the payment link.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": "order-uuid-here",
  "redirect_url": "https://yoursite.com/payment/callback"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "data": {
    "payment_id": "payment-uuid",
    "transaction_id": "HS-TXN-20241215120000-abc12345",
    "payment_link": "https://checkout.flutterwave.com/v3/hosted/pay/xxxxx",
    "order_id": "order-uuid",
    "order_number": "HS-20241215-1234",
    "amount": 15998.00,
    "currency": "NGN"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/payments/initialize \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "your-order-id",
    "redirect_url": "http://localhost:5173/payment/callback"
  }'
```

---

### 2. Verify Payment

**Endpoint:** `GET /api/v1/payments/verify/{transaction_id}`

**Description:** Verify the status of a payment after redirect.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "transaction_id": "HS-TXN-20241215120000-abc12345",
      "status": "successful",
      "amount": 15998.00,
      "currency": "NGN",
      "payment_method": "card",
      "customer_email": "customer@example.com",
      "completed_at": "2024-12-15T12:05:00Z"
    },
    "order": {
      "id": "order-uuid",
      "order_number": "HS-20241215-1234",
      "status": "confirmed",
      "payment_status": "completed"
    }
  }
}
```

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/v1/payments/verify/HS-TXN-20241215120000-abc12345
```

---

### 3. Get Payment Details

**Endpoint:** `GET /api/v1/payments/{payment_id}`

**Description:** Get details of a specific payment.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "payment-uuid",
    "order_id": "order-uuid",
    "transaction_id": "HS-TXN-20241215120000-abc12345",
    "flutterwave_transaction_id": "12345678",
    "amount": 15998.00,
    "currency": "NGN",
    "payment_method": "card",
    "status": "successful",
    "customer_email": "customer@example.com",
    "created_at": "2024-12-15T12:00:00Z",
    "completed_at": "2024-12-15T12:05:00Z"
  }
}
```

---

### 4. Get Payment by Order

**Endpoint:** `GET /api/v1/payments/order/{order_id}`

**Description:** Get payment information for a specific order.

**Headers:**
```
Authorization: Bearer {access_token}
```

---

### 5. Cancel Payment

**Endpoint:** `PUT /api/v1/payments/{payment_id}/cancel`

**Description:** Cancel a pending payment.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Customer changed mind"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment cancelled successfully",
  "data": {
    "id": "payment-uuid",
    "status": "cancelled",
    "failure_reason": "Customer changed mind"
  }
}
```

---

### 6. Webhook Endpoint

**Endpoint:** `POST /api/v1/payments/webhook`

**Description:** Receives payment status updates from Flutterwave.

**Headers:**
```
verif-hash: {your-webhook-secret-hash}
Content-Type: application/json
```

**Note:** This endpoint is called by Flutterwave, not your frontend.

---

## Admin Endpoints

### 1. List All Payments

**Endpoint:** `GET /api/v1/payments/admin/payments`

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20)
- `status` - Filter by status (successful, pending, failed, cancelled, refunded)
- `order_id` - Filter by order ID

**Example:**
```bash
curl -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  "http://localhost:5000/api/v1/payments/admin/payments?status=successful&page=1"
```

---

### 2. Get Payment Details (Admin)

**Endpoint:** `GET /api/v1/payments/admin/payments/{payment_id}`

**Description:** Get detailed payment information including order and user details.

---

### 3. Initiate Refund

**Endpoint:** `POST /api/v1/payments/admin/payments/{payment_id}/refund`

**Description:** Initiate a refund for a successful payment.

**Request Body:**
```json
{
  "amount": 15998.00,
  "reason": "Product defective"
}
```

**Note:** If `amount` is not specified, full refund is processed.

**Response (200):**
```json
{
  "success": true,
  "message": "Refund initiated successfully",
  "data": {
    "payment_id": "payment-uuid",
    "transaction_id": "HS-TXN-20241215120000-abc12345",
    "refund_amount": 15998.00,
    "status": "refunded",
    "refund_id": "12345"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/payments/admin/payments/PAYMENT_ID/refund \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 15998.00,
    "reason": "Product defective"
  }'
```

---

### 4. Payment Statistics

**Endpoint:** `GET /api/v1/payments/admin/stats`

**Description:** Get payment statistics and analytics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_payments": 150,
    "successful_payments": 142,
    "pending_payments": 3,
    "failed_payments": 5,
    "total_revenue": 2250000.00,
    "refunded_amount": 45000.00,
    "net_revenue": 2205000.00,
    "success_rate": 94.67
  }
}
```

---

## Testing

### Test Mode

Flutterwave provides test credentials for development:

1. Use keys prefixed with `FLWPUBK_TEST` and `FLWSECK_TEST`
2. No real money is charged
3. Use test card numbers provided by Flutterwave

### Test Cards

**Successful Payment:**
- Card Number: `5531886652142950`
- CVV: `564`
- Expiry: Any future date
- PIN: `3310`
- OTP: `12345`

**Failed Payment:**
- Card Number: `5143010522339965`

### Testing Flow

```bash
# 1. Create order
ORDER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address_id": "address-uuid"
  }')

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.data.id')

# 2. Initialize payment
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/payments/initialize \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$ORDER_ID\",
    \"redirect_url\": \"http://localhost:5173/payment/callback\"
  }")

PAYMENT_LINK=$(echo $PAYMENT_RESPONSE | jq -r '.data.payment_link')
TX_REF=$(echo $PAYMENT_RESPONSE | jq -r '.data.transaction_id')

echo "Payment Link: $PAYMENT_LINK"
echo "Transaction ID: $TX_REF"

# 3. Open payment link in browser, complete payment
# (Or use Flutterwave's test mode to simulate)

# 4. Verify payment
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/v1/payments/verify/$TX_REF"
```

---

## Webhooks

### Setting Up Webhooks

1. Go to Flutterwave Dashboard → **Settings** → **Webhooks**
2. Add your webhook URL: `https://yourdomain.com/api/v1/payments/webhook`
3. Generate and save a secret hash
4. Add the hash to your `.env` as `FLUTTERWAVE_SECRET_HASH`

### Webhook Events

The webhook endpoint handles these events:
- `charge.completed` - Payment completed (successful/failed)

### Webhook Verification

Webhooks are verified using the `verif-hash` header:
```python
signature = request.headers.get('verif-hash')
if signature != current_app.config['FLUTTERWAVE_SECRET_HASH']:
    return error_response("Invalid webhook signature")
```

---

## Error Handling

### Common Errors

**1. Order Already Paid**
```json
{
  "success": false,
  "message": "Order has already been paid"
}
```

**2. Insufficient Funds**
```json
{
  "success": false,
  "message": "Payment failed",
  "errors": {
    "payment": "Insufficient funds"
  }
}
```

**3. Amount Mismatch**
```json
{
  "success": false,
  "message": "Payment amount does not match order total"
}
```

**4. Invalid Webhook Signature**
```json
{
  "success": false,
  "message": "Invalid webhook signature"
}
```

### Payment Statuses

- `pending` - Payment initiated, waiting for customer
- `processing` - Payment being processed by Flutterwave
- `successful` - Payment completed successfully
- `failed` - Payment failed
- `cancelled` - Payment cancelled by customer
- `refunded` - Payment refunded

---

## Security

### Best Practices

1. **Always verify payments server-side**
   - Never trust frontend payment status
   - Always call verify endpoint after redirect

2. **Secure webhook endpoint**
   - Verify signature on every webhook request
   - Use HTTPS in production

3. **Amount validation**
   - Always verify payment amount matches order total
   - Check currency matches

4. **Rate limiting**
   - Implement rate limiting on payment endpoints
   - Prevent payment initialization abuse

5. **Logging**
   - Log all payment activities
   - Store payment metadata for auditing

6. **Environment separation**
   - Use test keys in development
   - Never commit keys to version control
   - Use different keys for staging/production

---

## Frontend Integration Example

### React Payment Flow

```javascript
// 1. Create order and initialize payment
const handleCheckout = async () => {
  try {
    // Create order
    const orderResponse = await api.post('/orders', {
      shipping_address_id: selectedAddress.id
    });

    const orderId = orderResponse.data.data.id;

    // Initialize payment
    const paymentResponse = await api.post('/payments/initialize', {
      order_id: orderId,
      redirect_url: `${window.location.origin}/payment/callback`
    });

    const { payment_link, transaction_id } = paymentResponse.data.data;

    // Store transaction ID for verification
    localStorage.setItem('pending_transaction_id', transaction_id);

    // Redirect to payment page
    window.location.href = payment_link;
  } catch (error) {
    console.error('Payment initialization failed:', error);
  }
};

// 2. Handle payment callback
const PaymentCallback = () => {
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const txRef = localStorage.getItem('pending_transaction_id');

      if (!txRef) {
        navigate('/orders');
        return;
      }

      try {
        const response = await api.get(`/payments/verify/${txRef}`);

        if (response.data.data.payment.status === 'successful') {
          // Payment successful
          localStorage.removeItem('pending_transaction_id');
          navigate(`/orders/${response.data.data.order.id}?payment=success`);
        } else {
          // Payment failed
          navigate(`/payment/failed?reason=${response.data.data.payment.failure_reason}`);
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        navigate('/payment/failed');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [navigate]);

  if (verifying) {
    return <div>Verifying payment...</div>;
  }

  return null;
};
```

---

## Troubleshooting

### Payment Not Completing

1. Check Flutterwave dashboard for transaction status
2. Verify webhook is receiving events
3. Check server logs for errors
4. Ensure payment amount matches order total

### Webhook Not Working

1. Verify webhook URL is accessible from internet
2. Check `verif-hash` header is being sent
3. Verify secret hash matches
4. Use Flutterwave's webhook testing tool

### Refund Issues

1. Verify payment is in `successful` status
2. Check Flutterwave transaction ID exists
3. Ensure sufficient balance for refund
4. Check Flutterwave dashboard for refund status

---

## Additional Resources

- [Flutterwave Documentation](https://developer.flutterwave.com/docs)
- [Flutterwave Dashboard](https://dashboard.flutterwave.com)
- [Test Cards](https://developer.flutterwave.com/docs/test-cards)
- [Webhook Guide](https://developer.flutterwave.com/docs/webhooks)

---

**Last Updated:** December 2024
**Version:** 1.0.0
