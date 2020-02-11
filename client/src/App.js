import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// styles
import './css/style.css';

// components
import Navbar from './components/layout/Navbar';
import Container from './components/layout/Container';

// context
import SaleState from './context/sale/SaleState';
import RabotaState from './context/rabota/RabotaState';
import ContactsState from './context/contacts/ContactsSate';

const App = () => {
  return (
    <SaleState>
      <RabotaState>
        <ContactsState>
          <Router>
            <Helmet>
              <title>Седам Маркет</title>
              <meta
                name='description'
                content='Лише якісні продовольчі товари вітчизняного виробника та товари світових брендів'
              />
            </Helmet>

            <Navbar />
            <Container />
          </Router>
        </ContactsState>
      </RabotaState>
    </SaleState>
  );
};

export default App;
