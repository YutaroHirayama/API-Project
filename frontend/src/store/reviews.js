import { initial } from "lodash";
import { csrfFetch } from "./csrf";

export  const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const CREATE_REVIEW = 'review/CREATE_REVIEW';

export const loadReviewsAction = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews
})

export const createReviewAction = (review) => ({
  type: CREATE_REVIEW,
  review
});

export const fetchReviewsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

  if(response.ok) {
    const reviews = await response.json();
    dispatch(loadReviewsAction(reviews.Reviews));
  };
};

export const createReviewThunk = (spotReview) => async (dispatch) => {
  const {
    spotId,
    review,
    stars
  } = spotReview;

  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      review,
      stars
    })
  });

  if(response.ok) {
    const review = await response.json();
    dispatch(createReviewAction(review))
    return review
  }
}

const initialState = {spot: {}, user: {}};

const reviewsReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOAD_REVIEWS: {
      const newState = {spot: {}}
      action.reviews.forEach((review) => {
        newState.spot[review.id] = review;
      });
      return newState;
    };
    case CREATE_REVIEW: {
      const newState = {...state, spot: {...state.spot}}
      newState.spot[action.review.id] = action.review
      return newState;
    }
    default:
      return state;
  };
};

export default reviewsReducer;
