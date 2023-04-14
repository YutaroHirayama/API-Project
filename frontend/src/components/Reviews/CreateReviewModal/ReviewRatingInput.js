import { useEffect, useState } from 'react';

const ReviewRatingInput = ({ stars, disabled, onChange}) => {
  const [activeRating, setActiveRating] = useState(stars);

  useEffect(() => {
    setActiveRating(stars);
  }, [stars])

  const starsIcon = (number) => {
    const props = {};
    if (!disabled) {
      props.onMouseEnter = () => setActiveRating(number);
      props.onMouseLeave = () => setActiveRating(stars);
      props.onClick = () => onChange(number);
    }
    return (
      <div
        key={number}
        className={activeRating >= number ? "fa fa-star" : "fa fa-star-o"}
        {...props}
      >
        <i className='star'></i>
      </div>
    );
  };

  return (
    <div className="reviewRating-input">
      {[1, 2, 3, 4, 5].map((number) => starsIcon(number))}
    </div>
  );
};

export default ReviewRatingInput;

//   return (
//     <div className='reviewRating-input'>
//       <div
//       className={activeRating >= 1? 'filled' : 'empty'}
//       onMouseEnter={() => {
//         if(!disabled) setActiveRating(1)
//       }}
//       onMouseLeave={() => {
//         if(!disabled) setActiveRating(rating);
//       }}
//       onClick={() => {
//         if (!disabled) onChange(1);
//       }}
//       >
//         <i className='fa fa-star'></i>
//       </div>
//       <div
//       className={activeRating >= 2? 'filled' : 'empty'}
//       onMouseEnter={() => {
//         if(!disabled) setActiveRating(2)
//       }}
//       onMouseLeave={() => {
//         if(!disabled) setActiveRating(rating);
//       }}
//       onClick={() => {
//         if (!disabled) onChange(2);
//       }}
//       >
//         <i className='fa fa-star'></i>
//       </div>
//       <div
//       className={activeRating >= 3? 'filled' : 'empty'}
//       onMouseEnter={() => {
//         if(!disabled) setActiveRating(3)
//       }}
//       onMouseLeave={() => {
//         if(!disabled) setActiveRating(rating);
//       }}
//       onClick={() => {
//         if (!disabled) onChange(3);
//       }}
//       >
//         <i className='fa fa-star'></i>
//       </div>
//       <div
//       className={activeRating >= 4? 'filled' : 'empty'}
//       onMouseEnter={() => {
//         if(!disabled) setActiveRating(4)
//       }}
//       onMouseLeave={() => {
//         if(!disabled) setActiveRating(rating);
//       }}
//       onClick={() => {
//         if (!disabled) onChange(4);
//       }}
//       >
//         <i className='fa fa-star'></i>
//       </div>
//       <div
//       className={activeRating >= 5? 'filled' : 'empty'}
//       onMouseEnter={() => {
//         if(!disabled) setActiveRating(5)
//       }}
//       onMouseLeave={() => {
//         if(!disabled) setActiveRating(rating);
//       }}
//       onClick={() => {
//         if (!disabled) onChange(5);
//       }}
//       >
//         <i className='fa fa-star'></i>
//       </div>
//     </div>
//   )
// }
