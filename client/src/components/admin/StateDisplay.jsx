import React from 'react';
import PropTypes from 'prop-types';
import { Package } from 'lucide-react';

/**
 * Loading state display component.
 *
 * Usage:
 * <LoadingState message="Loading products..." />
 */
export const LoadingState = ({ message = 'Loading...' }) => (
    <div className="loading-state flex flex-col items-center justify-center py-16">
        <div className="spinner animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600">{message}</p>
    </div>
);

LoadingState.propTypes = {
    message: PropTypes.string
};

/**
 * Empty state display component.
 *
 * Usage:
 * <EmptyState
 *   icon={Package}
 *   title="No products found"
 *   description="Get started by adding your first product."
 *   action={{ label: "Add Product", onClick: () => navigate('/admin/products/new') }}
 * />
 */
export const EmptyState = ({
    icon: Icon = Package,
    title = 'No items found',
    description = '',
    action = null
}) => (
    <div className="empty-state flex flex-col items-center justify-center py-16 text-center">
        <Icon size={64} className="empty-icon text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {description && (
            <p className="text-gray-600 mb-4 max-w-md">{description}</p>
        )}
        {action && (
            <button
                className="btn-primary bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                onClick={action.onClick}
            >
                {action.label}
            </button>
        )}
    </div>
);

EmptyState.propTypes = {
    icon: PropTypes.elementType,
    title: PropTypes.string,
    description: PropTypes.string,
    action: PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    })
};

/**
 * Error state display component.
 *
 * Usage:
 * <ErrorState
 *   message="Failed to load products"
 *   onRetry={() => refetch()}
 * />
 */
export const ErrorState = ({
    title = 'Something went wrong',
    message = 'An error occurred while loading data.',
    onRetry = null
}) => (
    <div className="error-state flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-600 text-2xl">!</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 max-w-md">{message}</p>
        {onRetry && (
            <button
                className="btn-secondary border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                onClick={onRetry}
            >
                Try Again
            </button>
        )}
    </div>
);

ErrorState.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    onRetry: PropTypes.func
};

export default { LoadingState, EmptyState, ErrorState };
