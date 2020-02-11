import React, { useContext, useEffect } from 'react';
import Contacts from '../layout/Contacts';
import Spinner from '../layout/Spinner';
import RabotaContext from '../../context/rabota/rabotaContext';
import NotFound from '../layout/NotFound';

const Vacancy = ({ match }) => {
  const rabotaContext = useContext(RabotaContext);

  useEffect(() => {
    rabotaContext.getRabotaVacancy(match.params.vacancy);
    // eslint-disable-next-line
  }, []);

  const {
    loading,
    vacancy: {
      notebookId,
      name,
      cityName,
      vacancyAddress,
      salary,
      salaryComment,
      contactPhone,
      contactPerson,
      description,
      clusters = []
    }
  } = rabotaContext;

  let worktime = null;
  let experience = null;

  clusters.map(cluster => {
    switch (cluster.id) {
      case 52:
        return (worktime = cluster.groups[0].name);
      case 79:
        return (experience = cluster.groups[0].name);
      default:
        return null;
    }
  });

  return name ? (
    loading ? (
      <Spinner />
    ) : (
      <>
        <section className='vacancy'>
          <div className='section-header'>
            <h1>Sedam</h1>
            <h2>{name}</h2>
          </div>
          <div className='vacancy-wrapper'>
            <div className='vacancy-info'>
              <ul>
                {cityName || vacancyAddress ? (
                  <li>
                    <i className='fas fa-map-marker-alt'></i> {cityName}
                    {cityName && vacancyAddress ? ', ' : null}
                    {vacancyAddress}
                  </li>
                ) : (
                  ''
                )}

                {contactPhone ? (
                  <li>
                    <a href={`tel:${contactPhone}`}>
                      <i className='fas fa-phone-alt'></i> {contactPhone}{' '}
                      {contactPerson ? `(${contactPerson})` : null}
                    </a>
                  </li>
                ) : (
                  ''
                )}

                {salary ? (
                  <li>
                    <i className='fas fa-money-bill-wave'></i> {salary}
                    {' грн. '}
                    {salaryComment ? `(${salaryComment})` : null}
                  </li>
                ) : (
                  ''
                )}

                {worktime || experience ? (
                  <li>
                    <i className='fas fa-clock'></i> {worktime}
                    {worktime && experience ? <br /> : null}
                    {experience}
                  </li>
                ) : (
                  ''
                )}
              </ul>
            </div>
            <div
              className='description'
              dangerouslySetInnerHTML={{ __html: description }}
            ></div>
            <a
              href={`https://rabota.ua/company${notebookId}/vacancy${match.params.vacancy}?mode=apply#apply`}
              className='btn'
              target='_blank'
              rel='noopener noreferrer'
            >
              Відгукнуться
            </a>
          </div>
        </section>

        <Contacts />
      </>
    )
  ) : (
    <NotFound />
  );
};

export default Vacancy;
