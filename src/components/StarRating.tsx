import React from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className={`text-2xl ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
