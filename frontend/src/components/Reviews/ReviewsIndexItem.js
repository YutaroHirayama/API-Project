import { NavLink, useHistory } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton';
import DeleteReviewModal from './DeleteReviewModal';
import { useSelector } from 'react-redux';

function ReviewIndexItem ({review, spotId}) {
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const date = review.createdAt.substring(0, review.createdAt.indexOf('T')).split('-')
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(date[1]));
  const year = date[0]

  let deleteReviewButton;
  if(sessionUser) {
    if(sessionUser.id === review.userId) {
      deleteReviewButton = (
        <OpenModalButton
        buttonText='Delete'
        modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId}/>}
        />
      )
    }
  }

  return (
    <div className='reviewIndexItemContainer'>
      <h4>{review.User.firstName}</h4>
      <div className='reviewIndexItem-date'>{month} {year}</div>
      <div className='reviewIndexItem-text'>
        {review.review}
      </div>
      {sessionUser && deleteReviewButton}
    </div>
  )
}

export default ReviewIndexItem;
