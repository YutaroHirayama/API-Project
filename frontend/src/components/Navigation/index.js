import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import logo from '../../images/A-logo.png'
function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className='sessionLinks'>
          <Link to='/spots/new' className='header-create-new-spot links'>Create a New Spot</Link>
          <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <div className='navigation-header'>
        <NavLink className='Home-icon' exact to="/">
          <div className='nagivation-logo-title'>
            <img className='logo' src={logo}/>
            <div>
              <a className='header-title links'>airbnb2</a>
            </div>
          </div>
        </NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
