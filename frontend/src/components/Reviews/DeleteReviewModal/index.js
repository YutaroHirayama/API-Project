import React, { useState } from "react";
import * as sessionActions from "../../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk, fetchReviewsThunk } from "../../../store/reviews";

function DeleteReviewModal({reviewId, spotId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteReview = async (e) => {
    e.preventDefault();
    return dispatch(deleteReviewThunk(reviewId))
      .then(closeModal)
  };

  console.log('reviewID', reviewId)
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
