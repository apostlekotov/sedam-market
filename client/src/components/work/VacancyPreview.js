import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const VacancyPreview = ({ id, name, vacancyAddress }) => {
  return (
    <div className='vacancy-preview'>
      <Link to={`/work/${id}`}>
        <span className='name'>{name}</span>
      </Link>
      <span className='vacancyAddress'>
        {vacancyAddress ? vacancyAddress : null}
      </span>
    </div>
  );
};

VacancyPreview.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  vacancyAddress: PropTypes.string.isRequired
};

export default VacancyPreview;
