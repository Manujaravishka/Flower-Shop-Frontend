import { useState, useEffect } from "react";
import { Star, Trash2, User, Clock, MessageSquare, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { reviewApi } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import MotionSection from "@/components/luxury/MotionSection";

interface Review {
  _id: string;
  productId: string;
  customerId: { _id: string; name: string };
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewStats {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

interface Props {
  giftId: string;
}

function StarRating({ rating, interactive, onChange, size = "sm" }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || rating) : rating;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange?.(star)}
          className={cn(
            "transition-colors",
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
            size === "md" ? "w-6 h-6" : "w-4 h-4"
          )}
        >
          <Star
            className={cn(
              "w-full h-full",
              star <= display
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/30"
            )}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ReviewSection({ giftId }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [newRating, setNewRating] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");

  const fetchReviews = async () => {
    try {
      const data = await reviewApi.getByProduct(giftId);
      setReviews(data.reviews ?? []);
      setStats(data.stats ?? null);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (giftId) fetchReviews();
  }, [giftId]);

  const canSubmit = newRating > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !isAuthenticated) {
      if (!isAuthenticated) toast.error("Please sign in to leave a review");
      return;
    }
    setSubmitting(true);
    try {
      await reviewApi.create({
        productId: giftId,
        rating: newRating,
        title: newTitle.trim(),
        comment: newComment.trim(),
      });
      toast.success("Review submitted");
      setNewRating(0);
      setNewTitle("");
      setNewComment("");
      await fetchReviews();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await reviewApi.delete(reviewId);
      toast.success("Review deleted");
      await fetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const alreadyReviewed = reviews.some(
    (r) => user && r.customerId?._id === user._id
  );

  return (
    <MotionSection>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-5 h-5 text-primary" strokeWidth={1.8} />
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-foreground">
            Reviews
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Stats summary */}
            <div className="lg:col-span-4">
              {stats && stats.count > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl font-medium text-foreground">
                      {stats.average.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 5</span>
                  </div>
                  <StarRating rating={Math.round(stats.average)} size="md" />
                  <p className="text-sm text-muted-foreground">
                    Based on {stats.count} review{stats.count !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-1.5 mt-4">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = stats.distribution[star] || 0;
                      const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-6 text-right text-muted-foreground">{star}</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" strokeWidth={1.5} />
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-400 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm py-6">
                  No reviews yet. Be the first to share your thoughts.
                </div>
              )}
            </div>

            {/* Review form + list */}
            <div className="lg:col-span-8 space-y-6">
              {isAuthenticated && !alreadyReviewed && (
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-cream-200 p-5 space-y-4 shadow-soft">
                  <h3 className="font-display text-base font-medium text-foreground">
                    Write a review
                  </h3>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Rating</label>
                    <StarRating
                      rating={newRating}
                      interactive
                      onChange={setNewRating}
                      size="md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Title (optional)</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Summarise your experience…"
                      className="w-full h-10 px-4 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                      maxLength={200}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Comment (optional)</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share details of your experience…"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
                      maxLength={2000}
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={cn(
                      "h-10 px-6 rounded-full text-sm font-medium text-primary-foreground transition-all shadow-soft",
                      canSubmit
                        ? "hover:shadow-glow"
                        : "opacity-50 cursor-not-allowed"
                    )}
                    style={{
                      background: "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                    }}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting…
                      </span>
                    ) : (
                      "Submit review"
                    )}
                  </motion.button>
                </div>
              )}

              {reviews.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-40" strokeWidth={1.5} />
                  <p className="text-sm">No reviews yet.</p>
                  {!isAuthenticated && (
                    <p className="text-xs mt-1">Sign in to be the first to review.</p>
                  )}
                </div>
              )}

              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl bg-white/70 backdrop-blur-xl border border-cream-200 p-5 shadow-soft space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary/60" strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {review.customerId?.name || "Anonymous"}
                          </span>
                          {review.isVerifiedPurchase && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} />
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            {timeAgo(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {user && user._id === review.customerId?._id && (
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-muted-foreground/50 hover:text-rose-500 transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                  {review.title && (
                    <p className="text-sm font-medium text-foreground pt-1">
                      {review.title}
                    </p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}

              {isAuthenticated && alreadyReviewed && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  You have already reviewed this product.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </MotionSection>
  );
}
