import { NavLink, useHistory } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';

function SpotIndexItem ({spot, page}) {

  // const { id } = spot
  const history = useHistory();

  const updateForm = () => {
    history.push(`/spots/${spot.id}/edit`)
  }

  return (

        <div className='spotIndexItem-Card'>
          <NavLink exact to={`/spots/${spot.id}`}>
            <div className='spotIndexItem-ImageContainer'>
              <img className='spotIndexItem-Image' src={spot.previewImage} />
            </div>
            <div className='spotIndexItem-DetailsContainer'>
              <div className='spotIndexItem-header'>
                <span className='spotIndexItem-location'>{spot.city}, {spot.state}</span>
                <span className='spotIndexItem-stars'>{spot.avgRating? Math.round(spot.avgRating).toFixed(1): 'New'}</span>
              </div>
              <div>
                <span className='spotIndexItem-price'>${spot.price} night</span>
              </div>
            </div>
          </NavLink>
          {page === 'current' && (
            <div>
              <button onClick={updateForm}>Update</button>
              <OpenModalButton
              buttonText='Delete'
              modalComponent={<DeleteSpotModal spotId={spot.id}/>}
              />
            </div>
          )}
        </div>

  )
}

export default SpotIndexItem;
