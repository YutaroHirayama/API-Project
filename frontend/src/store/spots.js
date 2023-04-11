import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SPOT = 'spots/LOAD_SPOT';

export const loadSpotsAction = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const loadSpotAction = (spot) => ({
  type: LOAD_SPOT,
  spot
})


export const fetchSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  if(response.ok) {
    const spots = await response.json();

    dispatch(loadSpotsAction(spots['Spots']));
  };
};

export const fetchSpotThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  console.log('response:',response);

  if(response.ok) {
    const spot = await response.json();

    dispatch(loadSpotAction(spot));
  };
};

const initialState = {
  allSpots: {}, singleSpot: {}
}
const spotsReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOAD_SPOTS: {
      const newState = {...state, allSpots: {...state.allSpots}};
      action.spots.forEach((spot) => {
        newState['allSpots'][spot.id] = spot;
      })
      return newState;
    };
    case LOAD_SPOT: {
      const newState = {...state, allSpots: {...state.allSpots}};
      newState['singleSpot'] = action.spot;
      return newState;
    }
    default:
    return state;
  }
}

export default spotsReducer;
