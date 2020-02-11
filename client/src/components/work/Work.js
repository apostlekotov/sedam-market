import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Contacts from '../layout/Contacts';
import VacancyPreview from './VacancyPreview';
import Spinner from '../layout/Spinner';
import RabotaContext from '../../context/rabota/rabotaContext';

const Work = () => {
  const rabotaContext = useContext(RabotaContext);

  useEffect(() => {
    rabotaContext.getRabotaPreview();
    // eslint-disable-next-line
  }, []);

  const { loading, work } = rabotaContext;

  return (
    <>
      <Helmet>
        <title>Седам Маркет - Робота в "Седам"</title>
      </Helmet>

      <section>
        <div className='section-header'>
          <h1>Sedam</h1>
          <h2>Долучайтесь до нашої команди</h2>
          <p>
            У чому секрет успіху «Седам»? У широкому асортименті товарів, їхній
            якості й свіжості, в інноваційності та креативності мережі. Але
            найбільша наша цінність – це люди. Вони – приязні й уважні, віддані
            та наполегливі, завдяки їм ваші покупки в «Седам» надзвичайно
            приємні.
          </p>
        </div>
        <div className='work'>
          {work ? (
            loading ? (
              <Spinner />
            ) : (
              <div className='work-grid'>
                {work.map(({ id, name, cityName, vacancyAddress }) => (
                  <VacancyPreview
                    key={id}
                    id={id}
                    name={name}
                    cityName={cityName}
                    vacancyAddress={vacancyAddress}
                  />
                ))}
              </div>
            )
          ) : (
            <p>На жаль, вакансій зараз нема...</p>
          )}
        </div>
      </section>

      <Contacts />
    </>
  );
};

export default Work;
