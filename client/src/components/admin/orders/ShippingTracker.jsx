import React from 'react';
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react';
import './ShippingTracker.css';

const ShippingTracker = ({ order }) => {
    const getTrackingSteps = () => {
        const steps = [
            {
                id: 'ordered',
                label: 'Order Placed',
                icon: Package,
                completed: true,
                date: order.created_at
            },
            {
                id: 'processing',
                label: 'Processing',
                icon: Package,
                completed: ['processing', 'shipped', 'delivered'].includes(order.status),
                date: order.processing_date
            },
            {
                id: 'shipped',
                label: 'Shipped',
                icon: Truck,
                completed: ['shipped', 'delivered'].includes(order.status),
                date: order.shipped_date
            },
            {
                id: 'delivered',
                label: 'Delivered',
                icon: CheckCircle,
                completed: order.status === 'delivered',
                date: order.delivered_date
            }
        ];

        return steps;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const steps = getTrackingSteps();
    const currentStepIndex = steps.findIndex(step => !step.completed);
    const activeStep = currentStepIndex === -1 ? steps.length - 1 : currentStepIndex;

    return (
        <div className="shipping-tracker">
            <h3>Shipping Status</h3>

            {order.tracking_number && (
                <div className="tracking-number">
                    <MapPin size={16} />
                    <span>Tracking: {order.tracking_number}</span>
                </div>
            )}

            <div className="tracking-steps">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === activeStep;
                    const isCompleted = step.completed;

                    return (
                        <div key={step.id} className="tracking-step-wrapper">
                            <div className={`tracking-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                <div className="step-icon">
                                    <Icon size={20} />
                                </div>
                                <div className="step-content">
                                    <h4>{step.label}</h4>
                                    {step.date && (
                                        <p className="step-date">{formatDate(step.date)}</p>
                                    )}
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {order.carrier && (
                <div className="carrier-info">
                    <p><strong>Carrier:</strong> {order.carrier}</p>
                    {order.estimated_delivery && (
                        <p><strong>Estimated Delivery:</strong> {formatDate(order.estimated_delivery)}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShippingTracker;
