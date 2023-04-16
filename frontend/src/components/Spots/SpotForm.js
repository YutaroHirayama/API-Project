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
  const [previewUrl, setPreviewUrl] = useState(spot?.previewUrl);
  const [img2Url, setImg2Url] = useState(spot?.img2Url);
  const [img3Url, setImg3Url] = useState(spot?.img3Url);
  const [img4Url, setImg4Url] = useState(spot?.img4Url);
  const [img5Url, setImg5Url] = useState(spot?.img5Url);
  const [errors, setErrors] = useState({});


  const otherImages = [{url:img2Url}, {url:img3Url}, {url:img4Url}, {url:img5Url}]

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
      previewUrl,
      otherImages
    }
    console.log('component spot' , spot);

    if(formType === 'Create') {
      const newSpot = await dispatch(createSpotThunk(spot))
      spot = newSpot
      console.log('newSpot', newSpot)

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
  console.log('spot', spot)

  return (
    <form className='spot-form' onSubmit={handleSubmit}>
      <div className='spot-form-location'>
        <h4>Where's your place located?</h4>
          <p>Guests will only get your exact address once they booked a reservation.</p>
            <div className='spot-form-Country'>
              <label>Country</label>
              <span className='errors errors-above'>{errors.country}</span>
                <input
                  className='form-inputs'
                  type='text'
                  placeholder='Country'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  />
            </div>

            <div className='spot-form-Address'>
              <label>Street Address</label>
              <span className='errors errors-above'>{errors.address}</span>
                <input
                  type='text'
                  className='form-inputs'
                  placeholder='Address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  />
            </div>

            <div className='spot-form-City-State'>
              <div className='spot-form-City'>
                <label>City</label>
                <span className='errors errors-above'>{errors.city}</span>
                  <input
                    type='text'
                    className='form-inputs'
                    placeholder='City'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />
                </div>,
              <div className='spot-form-State'>
                <label>State</label>
                <span className='errors errors-above'>{errors.state}</span>
                  <input
                    className='form-inputs'
                    type='text'
                    placeholder='State'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
              </div>
            </div>

            <div className='spot-form-lat-lng'>
              <div className='spot-form-lat'>
                <label>Latitude</label>
                <span className='errors errors-above'>{errors.lat}</span>
                  <input
                    className='form-inputs'
                    type='text'
                    placeholder='Latitude'
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    />
              </div>,
              <div className='spot-form-lng'>
                <label>Longitude</label>
                <span className='errors errors-above'>{errors.lng}</span>
                  <input
                    className='form-inputs'
                    type='text'
                    placeholder='Longitude'
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    />
              </div>
            </div>
      </div>

      <div className='spot-form-describe'>
        <h4>Describe your place to guests</h4>
        <p>
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
          <textarea
            className='form-textarea'
            placeholder='Please write at least 30 characters'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        <div className='errors errors-below'>{errors.description}</div>
      </div>

      <div className='form-title'>
        <h4>Create a title for your spot</h4>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
          <input
            className='form-inputs'
            type='text'
            placeholder='Name of your spot'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
          <div className='errors errors-below'>{errors.name}</div>
      </div>

      <div className='form-price'>
        <h4>Set a base price for your spot</h4>
        <p>
          Competitive pricing can help your listing stand out and rank higher
          in search results.
        </p>
        <label>$
          <input
            className='form-inputs'
            type='number'
            placeholder='Price per night (USD)'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            />
        </label>
        <div className='errors errors-below'>{errors.price}</div>
      </div>

      <div className='form-photos'>
        <h4>Liven up your spot with photos</h4>
        <p>
          Submit a link to at least one photo to publish your spot.
        </p>
          <input
            type='url'
            className='form-inputs'
            placeholder='Preview Image URL'
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
            />
            <div className='errors errors-below'>{errors.url}</div>
            <input
            type='url'
            className='form-inputs'
            placeholder='Image URL'
            value={img2Url}
            onChange={(e) => setImg2Url(e.target.value)}
            />
            <div className='errors errors-below'>{errors.img2Url}</div>
            <input
            type='url'
            className='form-inputs'
            placeholder='Image URL'
            value={img3Url}
            onChange={(e) => setImg3Url(e.target.value)}
            />
            <input
            type='url'
            className='form-inputs'
            placeholder='Image URL'
            value={img4Url}
            onChange={(e) => setImg4Url(e.target.value)}
            />
            <input
            type='url'
            className='form-inputs'
            placeholder='Image URL'
            value={img5Url}
            onChange={(e) => setImg5Url(e.target.value)}
            />

      </div>

      <button type='submit'>{formType} Spot</button>
    </form>
  );
}

export default SpotForm;
