
import logo from '../../images/A-logo.png';
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
          <Link to='/spots/new' className='header-create-new-spot links'>Create a New Spot</Link>
    );
  }

  return (
      <div className='navigation-header'>
        <NavLink className='Home-icon' exact to="/">
          <div className='nagivation-logo-title'>
            <img alt='logo' className='logo' src={logo}/>
              <div>
                <a className='header-title links'>Carebnb</a>
              </div>
          </div>
        </NavLink>
        <div className='sessionLinks'>
        {isLoaded && sessionLinks}
        {isLoaded && (
          <div>
            <ProfileButton user={sessionUser} />
          </div>
      )}
      </div>
    </div>
  );
}

export default Navigation;
