import { useState, useContext, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import AuthContext from "../auth/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import StarRating from "./StarRating";

const ProductReviews = ({ reviews, productId, onReviewChange }) => {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const [updatedRating, setUpdatedRating] = useState(0);
  const [orders, setOrders] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);

  const userReview = reviews.find((r) => r.user_id === user?.id);
  const otherReviews = reviews.filter((r) => r.user_id !== user?.id);
  const sortedReviews = userReview ? [userReview, ...otherReviews] : reviews;
  const [currentReview, setCurrentReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/api/orders/");
        setOrders(res.data.results);

        // Check if user bought this product
        const purchased = res.data.results.some((order) =>
          order.items.some((item) => item.variant.product_id === productId)
        );
        setHasPurchased(purchased);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchOrders();
  }, [user, productId]);

  const handleEditClick = (review) => {
    setEditMode(true);
    setCurrentReview(review);
    setUpdatedComment(review.comment);
    setUpdatedRating(review.rating);
  };

  const handleUpdate = async () => {
    if (!currentReview) return;

    try {
      await api.patch(
        `/products/api/detail-products/${productId}/reviews/${currentReview.id}/`,
        {
          id: currentReview.id,
          rating: updatedRating,
          comment: updatedComment,
        }
      );
      toast.success("Review updated!");
      setEditMode(false);
      setCurrentReview(null);
      onReviewChange();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update review.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(
        `/products/api/detail-products/${productId}/reviews/${id}/`
      );
      toast.success("Review deleted!");
      onReviewChange();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  const handleCreate = async () => {
    try {
      await api.post(`/products/api/detail-products/${productId}/reviews/`, {
        product: productId,
        rating: updatedRating,
        comment: updatedComment,
      });
      toast.success("Review added!");
      setUpdatedComment("");
      setUpdatedRating(0);
      onReviewChange();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review.");
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Customer Reviews</h2>

      {hasPurchased && !userReview && (
        <div className="mb-8">
          <div className="mb-8">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className={`px-5 py-2 text-sm font-semibold rounded transition duration-300 ${
                showReviewForm
                  ? "bg-gray-400 hover:bg-gray-500 text-gray-800"
                  : "bg-black hover:bg-black/80 text-white"
              }`}
            >
              {showReviewForm ? "Hide Review Form" : "Write a Review"}
            </button>

            {showReviewForm && (
              <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Write a Review</h3>

                <textarea
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows={3}
                  placeholder="Share your thoughts about this product..."
                  value={updatedComment}
                  onChange={(e) => setUpdatedComment(e.target.value)}
                />

                <div className="flex items-center gap-2 mt-3 mb-4">
                  <span className="text-sm font-medium">Your Rating:</span>
                  <StarRating
                    rating={updatedRating}
                    setRating={setUpdatedRating}
                    size={6}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className="px-5 py-2 text-sm font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition duration-150"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {sortedReviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedReviews.map((review) => {
            const isMyReview = review.user_id === user?.id;

            return (
              <div
                key={review.id}
                className="border p-3 rounded-md shadow-sm bg-gray-50 text-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">
                        {isMyReview ? `${review.user} (You)` : review.user}
                      </span>
                      {isMyReview && !editMode && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(review)}
                            className="text-blue-600 text-xs hover:underline flex items-center gap-1"
                          >
                            <FaEdit className="text-xs" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="text-red-500 text-xs hover:underline flex items-center gap-1"
                          >
                            <FaTrash className="text-xs" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-yellow-500 text-xs">
                    {review.rating} ★
                  </span>
                </div>

                {isMyReview && editMode ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full p-1 border rounded"
                      rows={2}
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Rating:</span>
                      <StarRating
                        rating={updatedRating}
                        setRating={setUpdatedRating}
                        size={5}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleUpdate}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-3 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-xs">{review.comment}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      )}
    </div>
  );
};

export default ProductReviews;
