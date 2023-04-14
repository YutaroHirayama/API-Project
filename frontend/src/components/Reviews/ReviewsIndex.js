import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsThunk } from "../../store/reviews";
import { useEffect, useState } from 'react';
import ReviewIndexItem from './ReviewsIndexItem';
import OpenModalButton from '../OpenModalButton';
import CreateReviewModal from './CreateReviewModal';

function ReviewsIndex ({spot, spotId}) {
  const dispatch = useDispatch();
  const reviews = Object.values(
    useSelector((state) => (state?.reviews?.spot? state.reviews.spot : []))
  );

  const sessionUser = useSelector((state) => state.session.user);
    console.log('sessionUser', sessionUser)
    console.log('reviews', reviews)

  const spotReview = {
    spotId,
    review: '',
    stars: 0,
  }

  let postReviewButton;
  if(sessionUser) {
    if(sessionUser.id !== spot.ownerId && !(reviews.find(review => review.userId === sessionUser.id))) {
      postReviewButton = (
        <OpenModalButton
        buttonText='Post Your Review'
        modalComponent={<CreateReviewModal spot={spot} spotId={spotId} userId={sessionUser.id} spotReview={spotReview}/>}
        />
      )
    }
  }

  useEffect(() => {
    dispatch(fetchReviewsThunk(spotId))
  }, [dispatch]);

  if(!reviews.length) return null;

  return (
    <div className='reviews-Index'>
      <div className='reviews-header'>
        <h3>{spot.numReviews > 0 ? `${Math.round(spot.avgStarRating).toFixed(1)} - ${spot.numReviews} reviews`: ' New'}</h3>
      </div>
      {sessionUser && postReviewButton}
      {sessionUser && postReviewButton && reviews.length === 0 && (
        <h3>Be the first to post a review!</h3>
      )}
      <div className='reviewsContainer'>
        <ul className ='reviews-list'>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewIndexItem review={review} spotId={spotId}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

}

export default ReviewsIndex;
