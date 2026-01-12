import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './MetricCard.css';

const MetricCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    return (
        <div className={`metric-card metric-card-${color}`}>
            <div className="metric-header">
                <div className="metric-icon-wrapper">
                    <Icon size={24} className="metric-icon" />
                </div>
                {trend && (
                    <div className={`metric-trend ${trend.direction}`}>
                        {trend.direction === 'up' ? (
                            <TrendingUp size={16} />
                        ) : (
                            <TrendingDown size={16} />
                        )}
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>

            <div className="metric-body">
                <h3 className="metric-value">{value}</h3>
                <p className="metric-title">{title}</p>
            </div>
        </div>
    );
};

export default MetricCard;
