import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createReviewThunk } from "../../../store/reviews";
import { fetchSpotThunk } from "../../../store/spots";
import ReviewRatingInput from "./ReviewRatingInput";
import './index.css';



function CreateReviewModal({spot, spotId, user, spotReview, className}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [stars, setStars] = useState(spotReview.stars);
  const [review, setReview] = useState(spotReview.review);
  const [errors, setErrors] = useState({});


  const onChange = (number) => {
    setStars(parseInt(number));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newReview = await dispatch(createReviewThunk({...spotReview, stars, review, user}))
      if(newReview) {
      if(newReview.errors) {
        setErrors(newReview.errors);
      } else {
        await dispatch(fetchSpotThunk(spotId), [dispatch])
          .then (closeModal)
      }
    }
  };

  return (
    <div className={className}>
      <h2>How was your stay?</h2>
      <div className='errors'>{errors.review}</div>
      <div className='reviewTextArea'>
        <textarea
        className='review-text-input'
        value={review}
        onChange={(e) => {
          setReview(e.target.value)
        }}
        placeholder="Leave your review here..."
        />
      </div>
      <div className='review-stars'>
        <ReviewRatingInput stars={stars} disabled={false} onChange={onChange}/>
      </div>

      <div className='errors'>{errors.stars}</div>
      <button id={(stars < 1 || review.length < 10) ? 'disabled-submit-review-button' : 'enabled-submit-review-button'} disabled={stars < 1 || review.length < 10} onClick={handleSubmit}>Submit Your Review</button>

    </div>
  )
}

export default CreateReviewModal;
