import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotThunk } from '../../store/spots';
import { useEffect } from 'react';

function SpotShow () {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.singleSpot? state.spots.singleSpot : {});
  const mainImage = useSelector(state => state.spots.singleSpot.SpotImages?.length > 0 ? state.spots.singleSpot.SpotImages[0] : [])
  const otherImages = useSelector(state => state.spots.singleSpot.SpotImages?.length > 1 ? state.spots.singleSpot.SpotImages.slice(1, 5) : [])
  const spotOwner = useSelector(state => state.spots.singleSpot.Owner? state.spots.singleSpot.Owner : {})

  useEffect(() => {
    dispatch(fetchSpotThunk(spotId))
  }, [dispatch, spotId]);

  if(!spot) return null;

  return (
    <div className='spotDetails'>
      <div className='spotDetails-header'>
        <p className='spotDetails-title'>{spot.name}</p>
        <p className='spotDetails-location'>{spot.city}, {spot.state}, {spot.country}</p>
      </div>
      <div className='spotDetails-images'>
        <div className='spotDetails-previewContainer'>
          <img className='spotDetails-previewImage' src={mainImage.url}/>
        </div>
        <div className='spotDetails-otherImagesContainer'>
          { (otherImages.length > 0 )? otherImages.map(image => (
            <img key = {image.id} className='spotDetails-otherImages' src={image.url} />
          )): ''}
        </div>
      </div>
      <div className='spotDetails-detailsContainer'>
        <div className='spotDetails-details'>
          <h4>Hosted by {spotOwner.firstName} {spotOwner.lastName}</h4>
          <p className='spotDetails-description'>{spot.description}</p>
        </div>
        <div className='spotDetails-reservationContainer'>
          <span className='spotDetails-reservation-price'>${Math.round(spot.price).toFixed(2)} night</span>
          <span className='spotDetails-reservation-rating'>{spot.numReviews > 0 ? `${Math.round(spot.avgStarRating).toFixed(1)} - ${spot.numReviews} reviews`: ' New'}</span>
          <div className='spotDetails-reservation-buttonContainer'>
            <button>Reserve</button>
          </div>
        </div>
      </div>
      </div>

  );
};

export default SpotShow;
