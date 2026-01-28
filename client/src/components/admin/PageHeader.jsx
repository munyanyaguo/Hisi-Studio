import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Reusable page header component for admin pages.
 *
 * Usage:
 * <PageHeader
 *   title="Products Management"
 *   subtitle="View and manage store products"
 *   action={{ label: "Add Product", to: "/admin/products/new", icon: Plus }}
 * />
 */
const PageHeader = ({
    title,
    subtitle,
    action = null,
    actions = [],
    className = ''
}) => {
    const renderAction = (actionConfig, index = 0) => {
        const { label, onClick, to, icon: Icon, variant = 'primary', disabled = false } = actionConfig;

        const buttonClasses = variant === 'primary'
            ? 'btn-primary bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50'
            : 'btn-secondary border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50';

        if (to) {
            return (
                <Link key={index} to={to} className={buttonClasses}>
                    {Icon && <Icon size={18} />}
                    {label}
                </Link>
            );
        }

        return (
            <button
                key={index}
                className={buttonClasses}
                onClick={onClick}
                disabled={disabled}
            >
                {Icon && <Icon size={18} />}
                {label}
            </button>
        );
    };

    // Support both single action and multiple actions
    const allActions = action ? [action, ...actions] : actions;

    return (
        <div className={`page-header flex items-center justify-between mb-6 ${className}`}>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                    <p className="page-subtitle text-gray-600 mt-1">{subtitle}</p>
                )}
            </div>

            {allActions.length > 0 && (
                <div className="flex items-center gap-3">
                    {allActions.map((actionConfig, index) => renderAction(actionConfig, index))}
                </div>
            )}
        </div>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    action: PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        to: PropTypes.string,
        icon: PropTypes.elementType,
        variant: PropTypes.oneOf(['primary', 'secondary']),
        disabled: PropTypes.bool
    }),
    actions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        to: PropTypes.string,
        icon: PropTypes.elementType,
        variant: PropTypes.oneOf(['primary', 'secondary']),
        disabled: PropTypes.bool
    })),
    className: PropTypes.string
};

export default PageHeader;
