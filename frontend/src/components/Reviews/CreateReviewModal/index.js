import React, { useState } from "react";
import * as sessionActions from "../../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createReviewThunk } from "../../../store/reviews";
import ReviewRatingInput from "./ReviewRatingInput";
import './index.css';



function CreateReviewModal({spot, spotId, userId, spotReview}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [stars, setStars] = useState(spotReview.stars);
  const [review, setReview] = useState(spotReview.review);

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createReviewThunk({...spotReview, stars, review}))
  }
  console.log('spotReview', {...spotReview, stars, review});
  return (
    <div className='reviewContainer'>
      <h2>How was your stay?</h2>
      <div className='reviewTextArea'>
        <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Just a quick review."
        />
      </div>
      <ReviewRatingInput stars={stars} disabled={false} onChange={onChange}/>
      <button onClick={handleSubmit}>Submit Your Review</button>
    </div>
  )
}

export default CreateReviewModal;
