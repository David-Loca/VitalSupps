"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { getProductReviews, getProductRating, getReviewDistribution, type Product } from "@/lib/products";
import StarRating from "./StarRating";

/**
 * Product reviews section — average rating, review count, a 5-star
 * distribution bar, and written sample reviews.
 *
 * IMPORTANT: every review rendered here comes from `data/products.json`'s
 * `reviews[]` array, and every entry there is flagged `isSample: true`.
 * This is placeholder/illustrative content written to build out the
 * reviews UI ahead of real customer reviews — it is NOT real customer
 * feedback. Replace with genuine, verified reviews before launch. Do not
 * surface "sample"/"placeholder" language in the user-facing copy below —
 * keep that context to this comment and the data flag only.
 */
export default function ProductReviews({ product }: { product: Product }) {
  const { t } = useLanguage();
  const reviews = getProductReviews(product);
  const { rating, reviewCount } = getProductRating(product);
  const distribution = getReviewDistribution(product);

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 lg:py-[100px] px-4 sm:px-6 lg:px-10 bg-off-white">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-serif font-light text-[clamp(28px,4vw,48px)] text-dark-text mb-6">
          {t("reviewsSection.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,260px)_1fr] gap-6 md:gap-8 mb-8">
          {/* Average + distribution */}
          <div className="bg-white border border-subtle-gray rounded-[4px] p-6 h-fit">
            <div className="font-serif font-light text-4xl text-dark-text mb-1">{rating.toFixed(1)}</div>
            <StarRating rating={rating} size="md" showCount={false} className="mb-2" />
            <p className="text-sm text-muted-text mb-5">
              {t("reviewsSection.basedOn").replace("{count}", String(reviewCount))}
            </p>

            <div className="space-y-1.5">
              {distribution.map(({ star, count, percent }) => (
                <div key={star} className="flex items-center gap-2 text-xs text-muted-text">
                  <span className="w-3 text-right">{star}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-light-gray overflow-hidden">
                    <div
                      className="h-full bg-accent-secondary rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Written reviews */}
          <div className="space-y-3">
            {reviews.map((review, index) => (
              <div
                key={`${review.name}-${index}`}
                className="bg-white border border-subtle-gray rounded-[4px] p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
                  <span className="font-semibold text-sm text-dark-text">{review.name}</span>
                  <span className="text-xs text-muted-text">
                    {review.daysAgo < 30
                      ? `${review.daysAgo}d ago`
                      : `${Math.round(review.daysAgo / 30)}mo ago`}
                  </span>
                </div>
                <StarRating rating={review.rating} showCount={false} className="mb-2" />
                <p className="text-[15px] leading-[1.75] text-muted-text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
