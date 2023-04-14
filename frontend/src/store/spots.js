import { csrfFetch } from "./csrf";

/***** SPOTS ACTIONS *****/

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SPOT = 'spots/LOAD_SPOT';
export const LOAD_CURRENT_SPOTS = 'spots/LOAD_CURRENT_SPOTS';
export const CREATE_SPOT = 'spot/CREATE_SPOT';
export const DELETE_SPOT = 'spot/DELETE_SPOT';

/***** SPOTS ACTION CREATORS *****/

export const loadSpotsAction = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const loadSpotAction = (spot) => ({
  type: LOAD_SPOT,
  spot
})

export const loadCurrentSpotsAction = (spots) => ({
  type: LOAD_CURRENT_SPOTS,
  spots
})

export const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  spot
})

export const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId
})

/***** SPOTS THUNKS *****/

export const fetchSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  if(response.ok) {
    const spots = await response.json();

    dispatch(loadSpotsAction(spots.Spots));
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

export const fetchCurrentSpotsThunk=() => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');

  if(response.ok) {
    const spots = await response.json();

    dispatch(loadCurrentSpotsAction(spots.Spots));
  };
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
    headers: {"Content-Type": "application/json"}
  })

  if(response.ok) {
    const spot = await response.json();
    console.log('action spotId', spotId);
    dispatch(deleteSpotAction(spotId));
    return spot
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

export const updateSpotThunk = (updateSpot) => async (dispatch) => {
  const {
    id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price} = updateSpot;

  const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'PUT',
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
    dispatch(createSpotAction(spot))
    return spot
  } else {
    const errors = await response.json();
    return errors
  };
}

/***** SPOTS REDUCER *****/

const initialState = {
  allSpots: {}, singleSpot: {}
}
const spotsReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOAD_SPOTS: {
      const newState = {...state, allSpots: {}, singleSpot: {}};
      action.spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      })
      return newState;
    };
    case LOAD_SPOT: {
      const newState = {...state, allSpots: {...state.allSpots}, singleSpot: {}};
      newState.singleSpot = action.spot;
      return newState;
    };
    case LOAD_CURRENT_SPOTS: {
      const newState = {allSpots: {}, singleSpot:{}};
      action.spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      })
      return newState;
    };
    case CREATE_SPOT: {
      const newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    };
    case DELETE_SPOT: {
      const newState = {...state, allSpots: {...state.allSpots}, singleSpot: {}}
      delete newState.allSpots[action.spotId];
      return newState;
    };
    default:
      return state;
  };
}

export default spotsReducer;
