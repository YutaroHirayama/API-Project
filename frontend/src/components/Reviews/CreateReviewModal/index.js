import React, { useState } from "react";
import * as sessionActions from "../../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createReviewThunk } from "../../../store/reviews";
import { fetchSpotThunk } from "../../../store/spots";
import ReviewRatingInput from "./ReviewRatingInput";
import './index.css';



function CreateReviewModal({spot, spotId, user, spotReview}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [stars, setStars] = useState(spotReview.stars);
  const [review, setReview] = useState(spotReview.review);

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = await dispatch(createReviewThunk({...spotReview, stars, review, user}))
      if(newReview) {
        await dispatch(fetchSpotThunk(spotId), [dispatch])
          .then (closeModal)
      }
  };

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
