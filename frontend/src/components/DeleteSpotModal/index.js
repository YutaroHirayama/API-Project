import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";

function DeleteSpotModal({spotId}) {
  const dispatch=useDispatch();
  const { closeModal } = useModal();
  console.log('spotId', spotId)
  const deleteSpot = (e) => {
    e.preventDefault();
    return dispatch(deleteSpotThunk(spotId))
      .then(closeModal)
  };

  return (
    <>
      <h1>Confirm Delete</h1>
      <h4>Are you sure you want to remove this spot from the listings?</h4>
      <button onClick={deleteSpot}>Yes (Delete Spot)</button>
      <button onClick={closeModal}>No (KeepSpot)</button>
    </>
  );
};

export default DeleteSpotModal;
