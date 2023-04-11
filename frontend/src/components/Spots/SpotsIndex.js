import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotsThunk } from "../../store/spots";
import { useEffect } from 'react';
import SpotIndexItem from './SpotIndexItem.js';


const SpotsIndex = () => {
  const dispatch = useDispatch();
  const spots = Object.values(
    useSelector((state) => (state.spots.allSpots? state.spots.allSpots : []))
  )


  useEffect(() => {
    dispatch(fetchSpotsThunk())
  }, [dispatch])

  if(!spots.length) return null;

  return (
    <div className='index'>
      <div className='spots'>
        <ul>
          {spots.map((spot) => (
            <SpotIndexItem spot={spot} key={spot.id} />
          ))}
        </ul>
      </div>
    </div>
  )
};

export default SpotsIndex;
