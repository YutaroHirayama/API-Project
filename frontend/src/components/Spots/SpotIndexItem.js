import { Link } from 'react-router-dom'


function SpotIndexItem ({spot}) {


  return (
    <li key={spot.id}>
      <Link to={`spots/${spot.id}`}>
        <div className='spotIndexItem-Card'>
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
        </div>
      </Link>
    </li>
  )
}

export default SpotIndexItem;
