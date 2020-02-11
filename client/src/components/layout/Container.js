import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Main from './Main';
import About from './About';
import Sales from '../sale/Sales';
import Work from '../work/Work';
import Vacancy from '../work/Vacancy';
import NotFound from './NotFound';
import Footer from './Footer';

const Container = ({ location }) => {
  return (
    <TransitionGroup className='transition-group'>
      <CSSTransition
        key={location.key}
        timeout={{ enter: 300, exit: 300 }}
        classNames='fade'
      >
        <div className='container'>
          <Switch location={location}>
            <Route exact path='/' component={Main} />
            <Route exact path='/about' component={About} />
            <Route exact path='/sales' component={Sales} />
            <Route exact path='/work' component={Work} />
            <Route exact path='/work/:vacancy' component={Vacancy} />
            <Route component={NotFound} />
          </Switch>

          <Footer />
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Container);
