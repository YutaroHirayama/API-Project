import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsThunk } from "../../store/reviews";
import { useEffect } from 'react';
import ReviewIndexItem from './ReviewsIndexItem';

function ReviewsIndex ({spot, spotId}) {
  const dispatch = useDispatch();
  const reviews = Object.values(
    useSelector((state) => (state.reviews?.spot? state.reviews.spot : []))
  )
    console.log('spot id', spot.id)

  useEffect(() => {
    dispatch(fetchReviewsThunk(spotId))
  }, [dispatch]);

  if(!reviews.length) return null;

  return (
    <div className='reviews-Index'>
      <div className='reviews-header'>
        <h3>{spot.numReviews > 0 ? `${Math.round(spot.avgStarRating).toFixed(1)} - ${spot.numReviews} reviews`: ' New'}</h3>
        <ul className ='reviews-list'>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewIndexItem review={review}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

}

export default ReviewsIndex;
