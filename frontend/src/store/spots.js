import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';

export const loadSpotsAction = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const fetchSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  if(response.ok) {
    const responseJson = await response.json();

    dispatch(loadSpotsAction(responseJson['Spots']));
  };
};


const spotsReducer = (state = {}, action) => {
  switch(action.type) {
    case LOAD_SPOTS: {
      const newState = {...state, allSpots: {}};
      action.spots.forEach((spot) => {
        newState['allSpots'][spot.id] = spot;
      })
      return newState;
    };
    default:
    return state;
  }
}

export default spotsReducer;
