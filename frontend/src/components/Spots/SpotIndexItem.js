
function SpotIndexItem ({spot}) {
  console.log('spot: ',spot)
  return (
    <li>
      <div className='spotIndexItem-Card'>
        <div className='spotIndexItem-ImageContainer'>
          <img className='spotIndexItem-Image' src={spot.previewImage} />
        </div>
        <div className='spotIndexItem-DetailsContainer'>
          <div className='spotIndexItem-location-stars'>
            <span className='spotIndexItem-location'>{spot.city}, {spot.state}</span>
            <span className='spotIndexItem-stars'>{spot.avgRating? Math.round(spot.avgRating).toFixed(1): 'New'}</span>

          </div>
        </div>
      </div>
    </li>
  )
}

export default SpotIndexItem;
