import SpotForm from './SpotForm';

function CreateSpotForm() {
  const spot = {
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    name: '',
    description: '',
    price: '',
    previewUrl: '',
    img2Url: '',
    img3Url: '',
    img4Url: '',
    img5Url: ''
  }

  return (
    <>
      <h2>Create a New Spot</h2>
      <SpotForm spot={spot} formType='Create' />
    </>
  )
};

export default CreateSpotForm;
