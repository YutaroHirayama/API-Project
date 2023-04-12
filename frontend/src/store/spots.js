import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SPOT = 'spots/LOAD_SPOT';
export const CREATE_SPOT = 'spot/CREATE_SPOT';

export const loadSpotsAction = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const loadSpotAction = (spot) => ({
  type: LOAD_SPOT,
  spot
})

export const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
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

export const createSpotThunk = (createSpot) => async (dispatch) => {
  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    previewUrl} = createSpot;

    const createImage = {
      url: previewUrl,
      preview: true
    };

  console.log('newSpot: ',createSpot)
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    })
  });

  if(response.ok) {
    const spot = await response.json();
    console.log(spot);


    const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(createImage)
    })

    if(imageResponse.ok) {
      dispatch(createSpotAction(spot))
      return spot
    } else {
      const errors = await imageResponse.json();
      return errors
    }

  } else {
    const errors = await response.json();
    return errors
  };
}

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
    };
    case CREATE_SPOT: {
      const newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    }
    default:
    return state;
  }
}

export default spotsReducer;
