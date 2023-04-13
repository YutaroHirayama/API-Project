import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentSpotsThunk } from "../../store/spots";
import { useEffect } from 'react';
import SpotIndexItem from './SpotIndexItem.js';
import './spots.css';

function ManageSpots () {
  const dispatch = useDispatch();
  const spots = Object.values(
    useSelector((state) => (state.spots.allSpots? state.spots.allSpots : []))
  )

  useEffect(() => {
    dispatch(fetchCurrentSpotsThunk())
  }, [dispatch])
  console.log('spots', spots);
  if(!spots.length) return null;

  return (


<div className='index'>
      <div className='spots'>
        <ul className='spots-grid'>
          {spots.map((spot) => (
            <li key={spot.id}>
              <SpotIndexItem spot={spot} key={spot.id} page='current'/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
};

export default ManageSpots;
