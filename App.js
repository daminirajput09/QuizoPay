/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import AppNavigator from './src/Navigator'
import { MyProvider } from './src/components/UseContext';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import LottieView from 'lottie-react-native';
import PushNotification from "react-native-push-notification";

const App = () => {

  const [connected, setConnected] = useState(true);

  useEffect(() => {
    configurePushNotification();
    NetInfo.addEventListener(state => {
      const { isConnected } = state
      setConnected(isConnected)
    })
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken()
    }
  }

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmtoken', JSON.stringify(fcmToken));
      //console.log("fcm token value", JSON.stringify(fcmToken));
    } else {
      //console.log("Failed", "No token received");
    }
  }

  const configurePushNotification = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        //console.log("TOKEN:", token);
      },
    
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        //console.log("NOTIFICATION:", notification);
        // process the notification here
      },
      // Android only
      senderID: "309964270624",
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    });
  }

  return (
    <>
      { connected ?
        <MyProvider>
          <AppNavigator />
        </MyProvider> :
        <>
          <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <LottieView
              source={require('./assets/splash/NoInternet1.json')}
              autoPlay
              loop={true}
              style={{ height: '80%', width: '80%', alignSelf: 'center', paddingTop: 100 }}
            />
          </View>
        </>
      }
    </>
  );

};

export default App;