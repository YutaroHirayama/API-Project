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
    previewUrl: ''
  }

  return (
    <>
      <h2>Create a new Spot</h2>
      <SpotForm spot={spot} formType='Create' />
    </>
  )
};

export default CreateSpotForm;
