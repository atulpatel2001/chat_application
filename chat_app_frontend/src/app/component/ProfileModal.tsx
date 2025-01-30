import React from 'react';
import { Contact } from '../model/Contact';
import { FaLinkedin, FaGithub, FaTwitter, FaFacebook, FaInstagram, FaAdjust } from 'react-icons/fa';

interface ProfileModalProps {
  contact: Contact;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ contact, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={onClose} // Close modal when clicking outside
    >
        
      <div
        className="bg-gradient-to-r from-purple-700 p-12 rounded-3xl w-[650px] shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      > <p className={`mt-4 text-4xl ${contact.favorite ? 'text-red-600 animate-pulse' : 'text-gray-300'}`}>
      {contact.favorite ? '❤️' : '🤍'}
    </p>
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Image with Hover Effect */}
          <img
            src={contact.picture || '/default-avatar.png'}
            alt="Profile Avatar"
            className="w-40 h-40 rounded-full mb-6 object-cover border-4 border-white transform transition-transform duration-300 hover:scale-110"
          />

          {/* Contact Name with Animation */}
          <h2 className="text-4xl font-extrabold text-white text-shadow-lg">{contact.name}</h2>

          {/* Contact Details */}
          <div className="text-left text-white space-y-4 text-center">
            {/* Contact Email */}
            <p className="text-lg font-medium">
              <strong>Email:</strong>
              <span className="text-gray-300"> {contact.email}</span>
            </p>

            {/* Contact Phone Number */}
            <p className="text-lg font-medium">
              <strong>Phone:</strong>
              <span className="text-gray-300"> {contact.phoneNumber}</span>
            </p>

            {/* Contact Address */}
            <p className="text-lg font-medium">
              <strong>Address:</strong>
              <span className="text-gray-300"> {contact.address}</span>
            </p>

            {/* Contact Description */}
            <p className="text-lg font-medium">
              <strong>Description:</strong>
              <span className="text-gray-300"> {contact.description || 'No description available'}</span>
            </p>

            {/* Favorite Heart */}
           
          </div>

          {/* Social Links with Icons */}
          <div className="w-full mt-8">
            <div className="flex justify-center space-x-6">
              {contact.links?.map((link) => {
                return (
                  <a
                    key={link.id}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-300 transform transition-transform duration-200 hover:scale-125"
                  >
                    {/* Display Social Icons with Transition */}
                    {link.title === 'LinkedIn' && <FaLinkedin size={35} className="transition-all duration-300 ease-in-out hover:scale-110" />}
                    {link.title === 'GitHub' && <FaGithub size={35} className="transition-all duration-300 ease-in-out hover:scale-110" />}
                    {link.title === 'Twitter' && <FaTwitter size={35} className="transition-all duration-300 ease-in-out hover:scale-110" />}
                    {link.title === 'Facebook' && <FaFacebook size={35} className="transition-all duration-300 ease-in-out hover:scale-110" />}
                    {link.title === 'Instagram' && <FaInstagram size={35} className="transition-all duration-300 ease-in-out hover:scale-110" />}
                    {link.title === 'Twitter' && <FaTwitter size={35} className="transition-all duration-300 ease-in-out hover:scale-110" />}
                    {link.title === '' || link.title === 'Other' && <FaAdjust size={35} className="transition-all duration-300 ease-in-out hover:scale-110" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Close Button with Hover Effect */}
          <div className="mt-10 text-center">
            <button
              onClick={onClose} // Close modal on button click
              className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-xl shadow-md hover:bg-gray-200 transform transition-transform duration-300 hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
