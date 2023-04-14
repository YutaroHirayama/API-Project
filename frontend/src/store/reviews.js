import { initial } from "lodash";
import { csrfFetch } from "./csrf";

export  const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';

export const loadReviewsAction = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews
})

export const fetchReviewsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

  if(response.ok) {
    const reviews = await response.json();
    dispatch(loadReviewsAction(reviews.Reviews));
  };
};

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
    default:
      return state;
  };
};

export default reviewsReducer;
