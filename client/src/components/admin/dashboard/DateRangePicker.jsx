import React from 'react';
import { Calendar } from 'lucide-react';
import './DateRangePicker.css';

const DateRangePicker = ({ value, onChange }) => {
    const periods = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'year', label: 'This Year' }
    ];

    return (
        <div className="date-range-picker">
            <Calendar size={18} className="picker-icon" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="picker-select"
            >
                {periods.map((period) => (
                    <option key={period.value} value={period.value}>
                        {period.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DateRangePicker;
