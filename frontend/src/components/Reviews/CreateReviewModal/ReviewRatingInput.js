import { useEffect, useState } from 'react';

const ReviewRatingInput = ({ stars, disabled, onChange}) => {
  const [activeRating, setActiveRating] = useState(stars);

  useEffect(() => {
    setActiveRating(stars);
  }, [stars])

  const starsIcon = (number) => {
    const props = {};
    if (!disabled) {
      props.onMouseEnter = () => setActiveRating(number);
      props.onMouseLeave = () => setActiveRating(stars);
      props.onClick = () => onChange(number);
    }
    return (
      <div
        key={number}
        className={activeRating >= number ? "fa fa-star" : "fa fa-star-o"}
        {...props}
      >
        <i className='star'></i>
      </div>
    );
  };

  return (
    <div className="reviewRating-input">
      {[1, 2, 3, 4, 5].map((number) => starsIcon(number))}
      <span> Stars </span>
    </div>
  );
};

export default ReviewRatingInput;
