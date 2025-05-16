import React from 'react';
import PropTypes from 'prop-types';
import './ProfileView.css';

const ProfileView = ({ profile }) => {
  if (!profile) {
    return <p>No profile data available. Please create a profile first.</p>;
  }

  return (
    <div className="profile-view">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
      <p><strong>Skills:</strong> {profile.skills}</p>
    </div>
  );
};

ProfileView.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    skills: PropTypes.string.isRequired
  })
};

export default ProfileView;
