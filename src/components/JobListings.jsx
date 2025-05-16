import React, { useState } from 'react';
import '../styles/JobListings.css';

const jobData = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Toronto, ON',
    description: 'Develop and maintain user interfaces for web applications.',
    dateOpened: '2023-06-01',
    dateClosing: '2023-07-01',
    dateApplied: '2023-06-15',
    applicants: 12,
    hiringManager: 'John Doe',
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'Facebook',
    location: 'Vancouver, BC',
    description: 'Develop and maintain server-side logic and databases.',
    dateOpened: '2023-06-05',
    dateClosing: '2023-07-05',
    dateApplied: '2023-06-20',
    applicants: 9,
    hiringManager: 'Jane Smith',
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'Amazon',
    location: 'Calgary, AB',
    description: 'Work on both front-end and back-end development.',
    dateOpened: '2023-06-10',
    dateClosing: '2023-07-10',
    dateApplied: '2023-06-25',
    applicants: 15,
    hiringManager: 'Mike Johnson',
  },
];

function JobListings() {
  const [selectedJob, setSelectedJob] = useState(null);

  const handleCardClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="job-listings">
      <h2>Job Listings Matching Your Profile</h2>
      <div className="job-cards-container">
        {jobData.map((job) => (
          <div
            key={job.id}
            className="job-card"
            onClick={() => handleCardClick(job)}
            onKeyPress={() => handleCardClick(job)}
            role="button"
            tabIndex={0}
          >
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
          </div>
        ))}
      </div>
      {selectedJob && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={handleCloseModal}
              onKeyPress={handleCloseModal}
              role="button"
              tabIndex={0}
            >
              &times;
            </span>
            <h3>{selectedJob.title}</h3>
            <p>
              <strong>Company:</strong>
              <br />
              {selectedJob.company}
            </p>
            <p>
              <strong>Location:</strong>
              <br />
              {selectedJob.location}
            </p>
            <p>
              <strong>Description:</strong>
              <br />
              {selectedJob.description}
            </p>
            <p>
              <strong>Date Opened:</strong>
              <br />
              {selectedJob.dateOpened}
            </p>
            <p>
              <strong>Date Closing:</strong>
              <br />
              {selectedJob.dateClosing}
            </p>
            <p>
              <strong>Date Applied:</strong>
              <br />
              {selectedJob.dateApplied}
            </p>
            <p>
              <strong>Applicants:</strong>
              <br />
              {selectedJob.applicants}
            </p>
            <p>
              <strong>Hiring Manager:</strong>
              <br />
              {selectedJob.hiringManager}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobListings;
