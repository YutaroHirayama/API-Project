import React, { useState } from "react";
import * as sessionActions from "../../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk } from "../../../store/reviews";
import { fetchSpotThunk } from "../../../store/spots";

function DeleteReviewModal({reviewId, spotId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteReview = async (e) => {
    e.preventDefault();
    const deletedReview = await dispatch(deleteReviewThunk(reviewId))
      if(deletedReview) {
        await dispatch(fetchSpotThunk(spotId));
        await dispatch(closeModal);
      }
    };

  return (
    <>
      <h1>Confirm Delete</h1>
      <h4>Are you sure you want to delete this review?</h4>
      <button onClick={deleteReview}>Yes (Delete Review)</button>
      <button onClick={closeModal}>No (Keep Review)</button>
    </>
  );
};

export default DeleteReviewModal;
