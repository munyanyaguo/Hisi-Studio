import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

/**
 * Reusable search input component for admin pages.
 *
 * Usage:
 * <SearchBox
 *   value={filters.search}
 *   onChange={(value) => setFilters({ ...filters, search: value })}
 *   placeholder="Search products..."
 * />
 */
const SearchBox = ({
    value,
    onChange,
    placeholder = 'Search...',
    className = '',
    debounceMs = 0
}) => {
    const [localValue, setLocalValue] = React.useState(value);
    const timeoutRef = React.useRef(null);

    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (debounceMs > 0) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                onChange(newValue);
            }, debounceMs);
        } else {
            onChange(newValue);
        }
    };

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={`search-box relative ${className}`}>
            <Search
                size={18}
                className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="search-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
        </div>
    );
};

SearchBox.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    debounceMs: PropTypes.number
};

export default SearchBox;
