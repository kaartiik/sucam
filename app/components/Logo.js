import React from 'react';
import { Image, Dimensions } from 'react-native';

import LogoImage from '../../assets/splash.png';

const { width, height } = Dimensions.get('window');

const Logo = () => (
  <Image source={LogoImage} resizeMode="cover" style={{ width, height }} />
);

export default Logo;
