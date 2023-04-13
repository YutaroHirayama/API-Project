import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpotThunk, updateSpotThunk } from '../../store/spots';

function SpotForm({spot, formType}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [country, setCountry] = useState(spot?.country);
  const [lat, setLat] = useState(spot?.lat);
  const [lng, setLng] = useState(spot?.lng);
  const [name, setName] = useState(spot?.name);
  const [description, setDescription] = useState(spot?.description);
  const [price, setPrice] = useState(spot?.price);
  const [previewUrl, setPreviewUrl] = useState(spot?.previewImage? spot.previewImage : '');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    spot = {
      ...spot,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      previewUrl
    }
    console.log('component spot' , spot);

    if(formType === 'Create') {
      const newSpot = await dispatch(createSpotThunk(spot))
      spot = newSpot

    } else if (formType === 'Update') {
      const newSpot = await dispatch(updateSpotThunk(spot))
      spot = newSpot
    }

    if (spot.errors) {
      setErrors(spot.errors);
    } else {
      history.push(`/spots/${spot.id}`);
    }
  };

  return (
    <form className='spot-form' onSubmit={handleSubmit}>
      <h4>Where's your place located?</h4>
        <p>Guests will only get your exact address once they booked a reservation</p>
        <div className='errors'>{errors.country}</div>
          <label>Country</label>
            <input
              type='text'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              />

        <div className='errors'>{errors.address}</div>
          <label>Street Address</label>
            <input
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              />

        <div className='errors'>{errors.city}</div>
          <label>City</label>
            <input
              type='text'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              />

        <div className='errors'>{errors.state}</div>
          <label>State</label>
            <input
              type='text'
              value={state}
              onChange={(e) => setState(e.target.value)}
              />

        <div className='errors'>{errors.lat}</div>
          <label>Latitude</label>
            <input
              type='text'
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              />

        <div className='errors'>{errors.lng}</div>
          <label>Longitude</label>
            <input
              type='text'
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              />

        <div className='form-describe'>
          <div className='errors'>{errors.description}</div>
          <h4>Describe your place to guests</h4>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              />
        </div>

        <div className='form-title'>
          <div className='errors'>{errors.name}</div>
          <h4>Create a title for your spot</h4>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
        </div>

        <div className='form-price'>
          <div className='errors'>{errors.price}</div>
          <h4>Set a base price for your spot</h4>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <label>$
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              />
          </label>
        </div>

        <div className='form-photos'>
          {/* <div className='errors'>{errors.images}</div> */}
          <h4>Liven up your spot with photos</h4>
          <p>
            Submit a link to at least one photo to publish your spot.
          </p>
            <input
              type='url'
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              />
        </div>

      <button type='submit'>{formType} Spot</button>
    </form>
  );
}

export default SpotForm;
