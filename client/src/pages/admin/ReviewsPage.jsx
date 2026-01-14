import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { adminGetReviews, adminUpdateReview, adminDeleteReview } from '../../services/reviewsApi';
import './ReviewsPage.css';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'approved'
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchReviews();
    }, [filter, page]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await adminGetReviews({ page, perPage: 20, status: filter });
            setReviews(response.data || []);
            setTotalPages(Math.ceil((response.pagination?.total || 0) / 20));
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setMessage({ type: 'error', text: 'Failed to load reviews' });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reviewId) => {
        setActionLoading(reviewId);
        try {
            await adminUpdateReview(reviewId, { is_approved: true });
            setMessage({ type: 'success', text: 'Review approved!' });
            fetchReviews();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to approve review' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleReject = async (reviewId) => {
        setActionLoading(reviewId);
        try {
            await adminUpdateReview(reviewId, { is_approved: false });
            setMessage({ type: 'success', text: 'Review rejected!' });
            fetchReviews();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to reject review' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleToggleFeatured = async (reviewId, currentFeatured) => {
        setActionLoading(reviewId);
        try {
            await adminUpdateReview(reviewId, { is_featured: !currentFeatured });
            setMessage({ type: 'success', text: currentFeatured ? 'Removed from featured' : 'Added to featured!' });
            fetchReviews();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update review' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }

        setActionLoading(reviewId);
        try {
            await adminDeleteReview(reviewId);
            setMessage({ type: 'success', text: 'Review deleted!' });
            fetchReviews();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete review' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="reviews-page">
            <div className="reviews-header">
                <div>
                    <h1>Customer Reviews</h1>
                    <p>Manage and moderate customer reviews</p>
                </div>
                <button onClick={fetchReviews} className="refresh-button">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="filter-tabs">
                <button
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => { setFilter('pending'); setPage(1); }}
                >
                    Pending Approval
                </button>
                <button
                    className={filter === 'approved' ? 'active' : ''}
                    onClick={() => { setFilter('approved'); setPage(1); }}
                >
                    Approved
                </button>
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => { setFilter('all'); setPage(1); }}
                >
                    All Reviews
                </button>
            </div>

            {loading ? (
                <div className="loading">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span>Loading reviews...</span>
                </div>
            ) : reviews.length === 0 ? (
                <div className="empty-state">
                    <Star className="w-12 h-12" />
                    <h3>No reviews found</h3>
                    <p>
                        {filter === 'pending'
                            ? 'No reviews are awaiting approval.'
                            : 'No reviews match your filter.'}
                    </p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review.id} className={`review-card ${!review.is_approved ? 'pending' : ''}`}>
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                                    <span className="review-date">{formatDate(review.created_at)}</span>
                                </div>
                                <div className="review-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {review.title && (
                                <h4 className="review-title">{review.title}</h4>
                            )}

                            <p className="review-content">{review.content}</p>

                            <div className="review-meta">
                                {review.product && (
                                    <span className="product-tag">Product: {review.product.name}</span>
                                )}
                                <span className={`status-badge ${review.is_approved ? 'approved' : 'pending'}`}>
                                    {review.is_approved ? 'Approved' : 'Pending'}
                                </span>
                                {review.is_featured && (
                                    <span className="featured-badge">Featured</span>
                                )}
                            </div>

                            <div className="review-actions">
                                {!review.is_approved && (
                                    <button
                                        onClick={() => handleApprove(review.id)}
                                        disabled={actionLoading === review.id}
                                        className="action-button approve"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Approve</span>
                                    </button>
                                )}
                                {review.is_approved && (
                                    <button
                                        onClick={() => handleReject(review.id)}
                                        disabled={actionLoading === review.id}
                                        className="action-button reject"
                                    >
                                        <EyeOff className="w-4 h-4" />
                                        <span>Hide</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => handleToggleFeatured(review.id, review.is_featured)}
                                    disabled={actionLoading === review.id}
                                    className={`action-button feature ${review.is_featured ? 'active' : ''}`}
                                >
                                    <Star className="w-4 h-4" />
                                    <span>{review.is_featured ? 'Unfeature' : 'Feature'}</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    disabled={actionLoading === review.id}
                                    className="action-button delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;
