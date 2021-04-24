import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { reset } from '../../providers/services/NavigatorService';

import Splash from '../../components/Splash';

const Authentication = () => {
  useEffect(() => {
    setTimeout(() => {
      reset('AppStack');
    }, 1000);
  }, []);

  return <Splash />;
};

Authentication.propTypes = {
  syncUser: PropTypes.func.isRequired,
};

export default Authentication;
