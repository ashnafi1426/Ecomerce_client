import './RatingSummary.css';

const RatingSummary = ({ summary }) => {
  if (!summary) {
    return (
      <div className="review-summary">
        <div className="no-ratings">
          <p>No customer reviews yet</p>
          <button className="write-review-btn">Write a review</button>
        </div>
      </div>
    );
  }

  const { 
    average_rating = 0, 
    total_reviews = 0,
    five_star = 0,
    four_star = 0,
    three_star = 0,
    two_star = 0,
    one_star = 0
  } = summary;

  // Calculate percentages
  const getPercentage = (count) => {
    return total_reviews > 0 ? Math.round((count / total_reviews) * 100) : 0;
  };

  const ratingBars = [
    { stars: 5, count: five_star, percentage: getPercentage(five_star) },
    { stars: 4, count: four_star, percentage: getPercentage(four_star) },
    { stars: 3, count: three_star, percentage: getPercentage(three_star) },
    { stars: 2, count: two_star, percentage: getPercentage(two_star) },
    { stars: 1, count: one_star, percentage: getPercentage(one_star) }
  ];

  return (
    <div className="review-summary">
      {/* Left side - Average rating */}
      <div className="average-rating">
        <div className="average-rating-number">{average_rating.toFixed(1)}</div>
        <div className="stars">★★★★☆</div>
        <div>{total_reviews.toLocaleString()} ratings</div>
      </div>

      {/* Right side - Rating bars */}
      <div className="rating-bars">
        {ratingBars.map((bar) => (
          <div key={bar.stars} className="rating-bar">
            <div className="bar-label">{bar.stars} star</div>
            <div className="bar">
              <div 
                className="bar-fill" 
                style={{ width: `${bar.percentage}%` }}
              />
            </div>
            <div className="bar-percentage">{bar.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSummary;
