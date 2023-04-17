import OpenModalButton from '../OpenModalButton';
import DeleteReviewModal from './DeleteReviewModal';
import { useSelector } from 'react-redux';

function ReviewIndexItem ({review, spotId}) {
  const sessionUser = useSelector((state) => state.session.user);

  const date = review.createdAt.substring(0, review.createdAt.indexOf('T')).split('-')
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(date[1]));
  const year = date[0]

  let deleteReviewButton;
  if(sessionUser) {
    if(sessionUser.id === review.userId) {
      deleteReviewButton = (
          <OpenModalButton
          className='modal-dialog'
          buttonText='Delete'
          modalComponent={<DeleteReviewModal className='delete-modal' reviewId={review.id} spotId={spotId}/>}
          />
      )
    }
  }

  return (
    <div className='reviewIndexItemContainer'>
      <div className='reviewIndexItem-name'>{review.User.firstName}</div>
      <div className='reviewIndexItem-date'>{month} {year}</div>
      <div className='reviewIndexItem-text'>
        {review.review}
      </div>
      {sessionUser && deleteReviewButton}
    </div>
  )
}

export default ReviewIndexItem;
