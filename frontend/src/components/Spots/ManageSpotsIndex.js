import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentSpotsThunk } from "../../store/spots";
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SpotIndexItem from './SpotIndexItem.js';
import './spots.css';

function ManageSpots () {
  const dispatch = useDispatch();
  const history = useHistory();
  const spots = Object.values(
    useSelector((state) => (state.spots.allSpots? state.spots.allSpots : []))
  )
  const [spotsNum, setSpotsNum] = useState(0);


  useEffect(() => {
    dispatch(fetchCurrentSpotsThunk())
  }, [dispatch])


  const handleClick = () => {
    history.push('/spots/new');
  }

return (

    <div className='index'>
      <div className='spots'>
        <h2>Manage Spots</h2>
        {spots.length < 1 && (<button onClick={handleClick}>Create a New Spot</button>)}
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
