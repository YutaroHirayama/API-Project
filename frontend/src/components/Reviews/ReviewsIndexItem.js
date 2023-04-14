import { NavLink, useHistory } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';

function ReviewIndexItem ({review}) {

  const history = useHistory();

  const date = review.createdAt.substring(0, review.createdAt.indexOf('T')).split('-')
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(date[1]));
  const year = date[0]
  return (
    <div className='reviewIndexItemContainer'>
      <h4>{review.User.firstName}</h4>
      <div className='reviewIndexItem-date'>{month} {year}</div>
      <div className='reviewIndexItem-text'>
        {review.review}
      </div>
    </div>
  )
}

export default ReviewIndexItem;
