"""
Query helpers for standardizing pagination, filtering, and sorting across routes.
Reduces code duplication in route handlers.
"""

from flask import request
from app.extensions import db


class QueryParams:
    """
    Extracts and validates common query parameters from request.

    Usage:
        params = QueryParams(request)
        query = Model.query
        query = params.apply_search(query, Model.name, Model.description)
        query = params.apply_sort(query, Model)
        return params.paginate(query)
    """

    def __init__(self, req=None):
        req = req or request
        self.page = req.args.get('page', 1, type=int)
        self.per_page = min(req.args.get('per_page', 10, type=int), 100)  # Cap at 100
        self.search = req.args.get('search', '', type=str).strip()
        self.sort_by = req.args.get('sort_by', 'created_at', type=str)
        self.sort_order = req.args.get('sort_order', 'desc', type=str)

    def apply_search(self, query, *fields):
        """
        Apply search filter across multiple fields using ILIKE.

        Args:
            query: SQLAlchemy query object
            *fields: Model fields to search across

        Returns:
            Modified query with search filter applied
        """
        if not self.search or not fields:
            return query

        search_filters = [field.ilike(f'%{self.search}%') for field in fields]
        return query.filter(db.or_(*search_filters))

    def apply_sort(self, query, model, allowed_fields=None, default_field='created_at'):
        """
        Apply sorting to query.

        Args:
            query: SQLAlchemy query object
            model: SQLAlchemy model class
            allowed_fields: List of allowed sort field names (defaults to common fields)
            default_field: Field to sort by if sort_by is invalid

        Returns:
            Modified query with sorting applied
        """
        if allowed_fields is None:
            allowed_fields = ['created_at', 'updated_at', 'name', 'price', 'id']

        sort_field = self.sort_by if self.sort_by in allowed_fields else default_field

        if hasattr(model, sort_field):
            column = getattr(model, sort_field)
            if self.sort_order.lower() == 'asc':
                query = query.order_by(column.asc())
            else:
                query = query.order_by(column.desc())

        return query

    def paginate(self, query, serializer=None):
        """
        Execute query with pagination and return standardized response.

        Args:
            query: SQLAlchemy query object
            serializer: Optional function to serialize each item (defaults to to_dict method)

        Returns:
            Dict with items and pagination info
        """
        pagination = query.paginate(page=self.page, per_page=self.per_page, error_out=False)

        if serializer:
            items = [serializer(item) for item in pagination.items]
        else:
            items = [item.to_dict() if hasattr(item, 'to_dict') else item for item in pagination.items]

        return {
            'items': items,
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total_items': pagination.total,
                'total_pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }


def get_pagination_params():
    """
    Get standard pagination parameters from request.

    Returns:
        tuple: (page, per_page)
    """
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    return page, per_page


def paginate_query(query, page, per_page, serializer=None):
    """
    Execute paginated query and return standardized response dict.

    Args:
        query: SQLAlchemy query object
        page: Current page number
        per_page: Items per page
        serializer: Optional function to serialize each item

    Returns:
        Dict with items and pagination metadata
    """
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    if serializer:
        items = [serializer(item) for item in pagination.items]
    else:
        items = [item.to_dict() if hasattr(item, 'to_dict') else item for item in pagination.items]

    return {
        'items': items,
        'pagination': {
            'page': pagination.page,
            'per_page': pagination.per_page,
            'total_items': pagination.total,
            'total_pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }


def apply_date_filter(query, model, date_field='created_at'):
    """
    Apply date range filter from request params.

    Looks for 'date_from' and 'date_to' query params.

    Args:
        query: SQLAlchemy query object
        model: SQLAlchemy model class
        date_field: Name of the date field to filter on

    Returns:
        Modified query with date filter applied
    """
    from datetime import datetime

    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')

    if hasattr(model, date_field):
        column = getattr(model, date_field)

        if date_from:
            try:
                from_date = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
                query = query.filter(column >= from_date)
            except ValueError:
                pass

        if date_to:
            try:
                to_date = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
                query = query.filter(column <= to_date)
            except ValueError:
                pass

    return query


def apply_status_filter(query, model, status_field='status', param_name='status'):
    """
    Apply status filter from request params.

    Args:
        query: SQLAlchemy query object
        model: SQLAlchemy model class
        status_field: Name of the status field on model
        param_name: Name of the query parameter

    Returns:
        Modified query with status filter applied
    """
    status = request.args.get(param_name)

    if status and status != 'all' and hasattr(model, status_field):
        query = query.filter(getattr(model, status_field) == status)

    return query
