import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-container">
      <div className="flying-airplane">🚗</div>

      <div className="contact-content">
        <h1 className='title_contact'>Welcome to TripSplit!</h1>
        <p className='text_contact'>
          Need some extra advice on using your TripSplit App?
        </p>
        <div className="list-contact">
          <h3>Contact Us</h3>
          <ul>
            <li>📞 0720 000 000 </li>
            <li>📩 contact@tripsplit.com</li>
            <li> 
                <FaFacebook /> TripSplit
            </li>
            <li>
                <IoLogoInstagram /> TripSplit
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;
