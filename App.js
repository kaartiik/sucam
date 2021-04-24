import React, { useEffect, Suspense } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  navRef,
  isMountedRef,
} from './app/providers/services/NavigatorService';
import AppNavigator from './app/navigation/navigator';

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <SafeAreaProvider>
        <NavigationContainer ref={navRef}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Suspense>
  );
};

export default App;
