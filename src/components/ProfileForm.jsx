import React, { useState } from 'react';
import '../styles/ProfileForm.css';
import { useNavigate } from 'react-router-dom';

const Cities = [
  'Toronto',
  'Montreal',
  'Vancouver',
  'Calgary',
  'Edmonton',
  'Ottawa',
  'Quebec City',
  'Winnipeg',
  'Hamilton',
  'Kitchener',
  'London',
  'Victoria',
  'Halifax',
  'Oshawa',
  'Windsor',
  'Saskatoon',
  'Regina',
  'St. John',
  'Kelowna',
  'Barrie',
  // Add more cities as needed
];

const EducationOptions = ['High School', 'Bachelor', 'Master', 'PhD'];

function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [education, setEducation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate saving process
    setTimeout(() => {
      // Mock saving data
      setName('');
      setEmail('');
      setBio('');
      setSkills('');
      setLocation('');
      setSalaryExpectation('');
      setEducation('');
      setSuggestions([]);
      setLoading(false);

      // Redirect to job listings page
      navigate('/jobs');
    }, 2000); // Simulated delay of 2 seconds
  };

  return (
    <div className="profile-form">
      <h2>Create Your Profile</h2>
      <form className="form-class" onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="bio">
          Work experience
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        <label htmlFor="skills">
          Skills:
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </label>
        <label htmlFor="location">
          Location:
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select Location</option>
            {Cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="salaryExpectation">
          Salary Expectation:
          <input
            type="text"
            id="salaryExpectation"
            value={salaryExpectation}
            onChange={(e) => setSalaryExpectation(e.target.value)}
          />
        </label>
        <label htmlFor="education">
          Education:
          <select
            id="education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          >
            <option value="">Select Education</option>
            {EducationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                onKeyPress={() => handleSuggestionClick(suggestion)}
                role="presentation"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <button type="submit">Save Profile</button>
        )}
      </form>
    </div>
  );
}

export default ProfileForm;
