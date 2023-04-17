import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchSpotsThunk } from "../../store/spots";
import SpotForm from './SpotForm';

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const spot = useSelector((state) => state.spots.allSpots? state.spots.allSpots[spotId] : '')

  useEffect(() => {
    dispatch(fetchSpotsThunk())
  }, [dispatch])

  if(!spot) return null;

  return (
    <>
      <h2>Update your Spot</h2>
      <SpotForm spot={spot} formType='Update' />
    </>
  )
};

export default UpdateSpotForm;
