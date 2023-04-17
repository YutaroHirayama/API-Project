import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";
import './index.css';

function DeleteSpotModal({spotId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteSpot = (e) => {
    e.preventDefault();
    return dispatch(deleteSpotThunk(spotId))
      .then(closeModal)
  };

  return (
    <div className='delete-modal'>
      <h2>Confirm Delete</h2>
      <h4 className='delete-modal-blurb'>Are you sure you want to remove this spot from the listings?</h4>
      <button id='delete-spot-yes' onClick={deleteSpot}>Yes (Delete Spot)</button>
      <button id='delete-spot-no' onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
};

export default DeleteSpotModal;
