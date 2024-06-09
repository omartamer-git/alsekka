/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'react-native-gesture-handler';


import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, PermissionsAndroid } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import * as TaskManager from 'expo-task-manager';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import Account from './screens/Account/Account';
import Wallet from './screens/Account/Wallet';
import BookRide from './screens/BookRide/BookRide';
import MapScreen from './screens/BookRide/MapScreen';
import RideFinder from './screens/BookRide/RideFinder';
import HomeScreen from './screens/Guest/HomeScreen';
import LoginScreen from './screens/Guest/LoginScreen';
import SignUpScreen from './screens/Guest/SignUpScreen';
import UserHome from './screens/HomeScreen/UserHome';
import PostRide from './screens/PostRide/PostRide';
import ViewTrip from './screens/PostRide/ViewTrip';
import ManageTrip from './screens/Rides/ManageTrip';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { I18nManager, NativeModules, Platform, StatusBar, TextInput, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import RNRestart from 'react-native-restart'; // Import package from node modules
import useUserStore from './api/accountAPI';
import useAuthManager from './context/authManager';
import { palette, rem, styles } from './helper';
import AddBank from './screens/Account/AddBank';
import AddCard from './screens/Account/AddCard';
import AddMobileWallet from './screens/Account/AddMobileWallet';
import ManageCars from './screens/Account/ManageCars';
import NewCar from './screens/Account/NewCar';
import Otp from './screens/Account/Otp';
import Referral from './screens/Account/Referral';
import SubmitDriverDocuments from './screens/Account/SubmitDriverDocuments';
import Withdraw from './screens/Account/Withdraw';
import Chat from './screens/Chat/Chat';
import ChatsList from './screens/Chat/ChatsList';
import CommunityMembers from './screens/Communities/CommunityMembers';
import CommunitySettings from './screens/Communities/CommunitySettings';
import NewCommunity from './screens/Communities/NewCommunity';
import SearchCommunities from './screens/Communities/SearchCommunities';
import ViewCommunities from './screens/Communities/ViewCommunities';
import ViewCommunity from './screens/Communities/ViewCommunity';
import ChangePasswordScreen from './screens/Guest/ChangePasswordScreen';
import ForgotPasswordScreen from './screens/Guest/ForgotPasswordScreen';
import Announcement from './screens/HomeScreen/Announcement';
import AllTrips from './screens/Rides/AllTrips';
import Checkout from './screens/Rides/Checkout';

import { stopLocationUpdatesAsync } from 'expo-location';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import { passengerPendingRatings } from './api/ridesAPI';
import { registerDevice } from './api/utilAPI';
import BottomModal from './components/BottomModal';
import Button from './components/Button';
import DismissableError from './components/DismissableError';
import PendingRatingsModal from './components/PendingRatingsModal';
import useAppManager from './context/appManager';
import useLocale from './locale/localeContext';
import './locale/translate';
import AddReferral from './screens/Account/AddReferral';
import DebtPayment from './screens/Account/DebtPayment';
import ViewWithdrawals from './screens/Account/ViewWithdrawals';
import Payment from './screens/BookRide/Payment';
import RideBooked from './screens/BookRide/RideBooked';
import CustomerService from './screens/Chat/CustomerService';
import useErrorManager from './context/errorManager';
import UserPreferences from './screens/Account/UserPreferences';


const RootStack = createNativeStackNavigator();
const GuestStack = createNativeStackNavigator();

const UserStack = createNativeStackNavigator();

const BookingStack = createNativeStackNavigator();
const PostRideStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const UserHomeStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const { t, i18n } = useTranslation();

  const authManager = useAuthManager();

  const postDriverLocation = useUserStore((state) => state.postDriverLocation);
  const userInfo = useUserStore((state) => state.userInfo);
  const getAvailableCards = useUserStore((state) => state.getAvailableCards);
  const getBankAccounts = useUserStore((state) => state.getBankAccounts);
  const getMobileWallets = useUserStore((state) => state.getMobileWallets);
  const userId = useUserStore((state) => state.id);
  const unreadMessages = useUserStore((state) => state.unreadMessages);
  const verified = useUserStore((state) => state.verified);
  const linkDevice = useUserStore((state) => state.linkDevice);

  const appManager = useAppManager();
  const [state, setState] = useState('LOADING');
  I18nManager.allowRTL(true);
  // const { t } = useTranslation();

  const config = {
    screens: {
      LoggedIn: {
        screens: {
          TabScreen: {
            screens: {
              'Find Rides': {
                screens: {
                  "Book Ride": 'ride/:rideId'
                }
              },
              Account: {
                screens: {
                  "Add Referral": 'referral/:referralCode'
                }
              },
              Communities: {
                screens: {
                  "View Community": "community/:communityId"
                }
              }
            }
          }
        },
      },
    },
  };

  const linking = {
    prefixes: ['seaats://', 'https://seaats.app/share/', 'https://www.seaats.app/share/'],
    config
  };

  const localeContext = useLocale();
  Text.defaultProps = {};
  Text.defaultProps.maxFontSizeMultiplier = 1.3;

  TextInput.defaultProps = {};
  TextInput.defaultProps.maxFontSizeMultiplier = 1.3;


  useEffect(function () {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
    let locale;
    if (Platform.OS === "ios") {
      locale = NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0];
    } else {
      locale = NativeModules.I18nManager.localeIdentifier;
    }

    if (locale.split('_')[0] === 'ar') {
      localeContext.setLanguage('ar');
      if (I18nManager.isRTL) {
        // OK - do nothing
        i18n.changeLanguage('ar');
      } else {
        I18nManager.forceRTL(true);
        RNRestart.restart();
      }
    } else {
      if (I18nManager.isRTL) {
        I18nManager.forceRTL(false);
        RNRestart.restart();
      } else {
        // OK - do nothing
        i18n.changeLanguage('en');
      }
    }
  }, []);

  const [modalFineLocation, setModalFineLocation] = useState(false);
  const [modalBackgroundLocation, setModalBackgroundLocation] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(hasPermission => {
        if (!hasPermission) {
          setModalFineLocation(true);
        }
      })
    }
  }, []);

  function requestLocationPermissions() {
    setModalFineLocation(false);
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: t('location_perm'),
        message: t('location_perm_desc'),
        buttonNeutral: t('ask_later'),
        buttonNegative: t('cancel'),
        buttonPositive: t('allow'),
      },
    ).then((granted) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setModalBackgroundLocation(true);
      }
    })
  }

  function requestBgLocationPermissions() {
    setModalBackgroundLocation(false);
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: t('bg_location_perm'),
        message: t('bg_location_perm_desc'),
        buttonNeutral: t('ask_later'),
        buttonNegative: t('cancel'),
        buttonPositive: t('allow'),
      },
    );
  }

  useEffect(
    function () {
      if (Platform.OS === 'ios') {
        requestTrackingPermission();

        PushNotificationIOS.addEventListener("register", (deviceToken) => {
          registerDevice(deviceToken);
          appManager.setDeviceToken(deviceToken);
        });

        PushNotificationIOS.requestPermissions();

      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

        messaging().requestPermission().then(function () {
          // Get the device token
          messaging()
            .getToken()
            .then(token => {
              registerDevice(token);
              appManager.setDeviceToken(token);
            })
            .catch(error => {
              console.error('Error getting device token:', error);
            });
        });
      }
    }, []);

  TaskManager.defineTask("UPDATE_LOCATION_DRIVER", ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;
      const lat = locations[0].coords.latitude;
      const lng = locations[0].coords.longitude;
      const timestamp = locations[0].timestamp;
      if (authManager.authenticated) {
        postDriverLocation(lat, lng, timestamp);
      } else {
        stopLocationUpdatesAsync("UPDATE_LOCATION_DRIVER");
      }
      // do something with the locations captured in the background
    }
  });


  const loadJWT = useCallback(async function () {
    try {
      const value = await Keychain.getGenericPassword();

      if (!value || JSON.parse(value.password).accessToken === null) {
        console.log("VALUE FALSE")

        authManager.setAccessToken(null);
        authManager.setRefreshToken(null);
        authManager.setAuthenticated(false);
        return setState("Guest");
      } else {
        console.log("VALUE TRUE")
        console.log(value);
      }
      const jwt = JSON.parse(value.password);

      authManager.setAccessToken(jwt.accessToken || null);
      authManager.setRefreshToken(jwt.refreshToken || null);
      authManager.setAuthenticated(jwt.accessToken !== null);
    } catch (error) {
      console.log(error);
      setState("Guest");
      authManager.setAccessToken(null);
      authManager.setRefreshToken(null);
      authManager.setAuthenticated(false);
    }
  }, []);

  useEffect(function () {
    appManager.getAllowedEmails();
  }, [])

  useEffect(function () {
    loadJWT()
  }, [loadJWT]);

  useEffect(() => {
    if (authManager.authenticated) {
      let promises = [userInfo(), getAvailableCards(), getBankAccounts(), getMobileWallets()];

      Promise.all(promises).then(() => setState("LoggedIn"))      
    }
  }, [authManager.authenticated]);

  // const errorManager = useErrorManager();
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const [pendingRatings, setPendingRatings] = useState();

  useEffect(function () {
    if (appManager.deviceToken && userId) {
      linkDevice(appManager.deviceToken);
    }
  }, [appManager.deviceToken, userId]);

  useEffect(() => {
    console.log(authManager.authenticated);
    if (authManager.authenticated) {
      const pending = passengerPendingRatings().then(pending => {
        if (!pending.complete) {
          setPendingRatings(pending);
        }
      });
    }
  }, [authManager.authenticated]);

  const LoggedInStack = ({ route, navigation }) => {
    return (
      <UserStack.Navigator initialRouteName="TabScreen" screenOptions={{headerShown: false}}>
        <UserStack.Screen name="TabScreen" component={LoggedInHome} />
        <UserStack.Screen name="Chat" component={Chat} />
        <UserStack.Screen name="Customer Service" component={CustomerService} />
      </UserStack.Navigator>
    );
  };

  const LoggedInHome = ({ route, navigation }) => {
    return (
      <Tab.Navigator initialRouteName='Home' screenOptions={{ headerShown: false, tabBarActiveTintColor: palette.primary, tabBarInactiveTintColor: palette.gray }}>
        <Tab.Screen name="Home" component={UserHomeNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
            tabBarLabel: ({ color }) => (
              <Text style={[styles.text, { color }, styles.font10]}>{t('home')}</Text>
            ),
            title: t('home')
          }} />
        <Tab.Screen name="Find Rides" component={BookRideNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="search" size={size} color={color} />
            ),
            tabBarLabel: ({ color }) => (
              <Text style={[styles.text, { color }, styles.font10]}>{t('find_rides')}</Text>
            ),
            title: t('find_rides')
          }} />
        <Tab.Screen name="Post Ride" component={PostRideNavigator}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (<MaterialIcons name="directions-car" size={size} color={color} />);
            },
            tabBarLabel: ({ color }) => (
              <Text style={[styles.text, { color }, styles.font10]}>{t('post_ride')}</Text>
            ),

            title: t('post_ride')
          }} />
        <Tab.Screen name="Communities" component={CommunityNavigator}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (<MaterialIcons name="forum" size={size} color={color} />);
            },
            tabBarLabel: ({ color }) => (
              <Text style={[styles.text, { color }, styles.font10]}>{t('communities')}</Text>
            ),
            title: t('communities')
          }} />
        <Tab.Screen name="Account" component={AccountNavigator}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <View style={{ position: 'relative' }}>
                  <MaterialIcons name="person" size={size} color={color} />
                  {unreadMessages > 0 &&
                    <View style={[styles.positionAbsolute, styles.bgRed, styles.br24, { top: 0, right: 0, width: 10 * rem, height: 10 * rem }]}>
                    </View>
                  }
                </View>
              );
            },
            tabBarLabel: ({ color }) => (
              <Text style={[styles.text, { color }, styles.font10]}>{t('account')}</Text>
            ),
            title: t('account')
          }} />

      </Tab.Navigator>
    );
  }

  const Guest = ({ route, navigation }) => {
    return (
      <GuestStack.Navigator screenOptions={{headerShown: false}}>
        <GuestStack.Screen name="Home" component={HomeScreen} />
        <GuestStack.Screen name="Sign Up" component={SignUpScreen} />
        <GuestStack.Screen name="Login" component={LoginScreen} />
        <GuestStack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
        <GuestStack.Screen name="Change Password" component={ChangePasswordScreen} />
        <GuestStack.Screen name="Otp" component={Otp} />
      </GuestStack.Navigator>
    );
  }


  const BookRideNavigator = ({ route, navigation }) => {
    return (
      <BookingStack.Navigator initialRouteName='Find a Ride' screenOptions={{headerShown: false}}>
        <BookingStack.Screen name="Find a Ride" component={MapScreen} />
        <BookingStack.Screen name="Choose a Ride" component={RideFinder} />
        <BookingStack.Screen name="Book Ride" component={BookRide} />
        <BookingStack.Screen name="Payment" component={Payment} />
        <BookingStack.Screen name="Ride Booked" component={RideBooked} />
        <UserHomeStack.Screen name="View Trip" component={ViewTrip} />
      </BookingStack.Navigator>
    );
  }


  const PostRideNavigator = ({ route, navigation }) => {
    return (
      <PostRideStack.Navigator initialRouteName='Post a Ride' screenOptions={{headerShown: false}}>
        <PostRideStack.Screen name="Post a Ride" component={PostRide} />
        <PostRideStack.Screen name="Driver Documents" component={SubmitDriverDocuments} />
        <PostRideStack.Screen name="New Car" component={NewCar} />
      </PostRideStack.Navigator>
    );
  }

  const CommunityNavigator = ({ route, navigator }) => {
    return (
      <CommunityStack.Navigator screenOptions={{headerShown: false}}>
        <CommunityStack.Screen name="View Communities" component={ViewCommunities} />
        <CommunityStack.Screen name="View Community" component={ViewCommunity} />
        <CommunityStack.Screen name="Search Communities" component={SearchCommunities} />
        <CommunityStack.Screen name="New Community" component={NewCommunity} />
        <CommunityStack.Screen name="Community Settings" component={CommunitySettings} />
        <CommunityStack.Screen name="Community Members" component={CommunityMembers} />
      </CommunityStack.Navigator>
    );
  };

  const AccountNavigator = ({ route, navigation }) => {
    return (
      <AccountStack.Navigator initialRouteName='Account Home' screenOptions={{headerShown: false}}>
        <AccountStack.Screen name="Account Home" component={Account} />
        <AccountStack.Screen name="Wallet" component={Wallet} />
        <AccountStack.Screen name="UserPreferences" component={UserPreferences} />
        <AccountStack.Screen name="Withdraw" component={Withdraw} />
        <AccountStack.Screen name="View Withdrawals" component={ViewWithdrawals} />
        <AccountStack.Screen name="Debt Payment" component={DebtPayment} />
        <AccountStack.Screen name="Add Card" component={AddCard} />
        <AccountStack.Screen name="All Trips" component={AllTrips} />
        <AccountStack.Screen name="Manage Cars" component={ManageCars} />
        <AccountStack.Screen name="New Car" component={NewCar} />
        <AccountStack.Screen name="Chats List" component={ChatsList} />
        <AccountStack.Screen name="Add Bank" component={AddBank} />
        <AccountStack.Screen name="Add Mobile Wallet" component={AddMobileWallet} />
        <AccountStack.Screen name="Referral" component={Referral} />
        <AccountStack.Screen name="Add Referral" component={AddReferral} />
      </AccountStack.Navigator>
    );
  }

  const UserHomeNavigator = ({ route, navigation }) => {
    return (
      <UserHomeStack.Navigator screenOptions={{headerShown: false}}>
        <UserHomeStack.Screen name="User Home" component={UserHome} />
        <UserHomeStack.Screen name="View Trip" component={ViewTrip} />
        <UserHomeStack.Screen name="Manage Trip" component={ManageTrip} />
        <UserHomeStack.Screen name="Checkout" component={Checkout} />
        <UserHomeStack.Screen name="All Trips" component={AllTrips} />
        <UserHomeStack.Screen name="Announcement" component={Announcement} />
        <UserHomeStack.Screen name="Driver Documents" component={SubmitDriverDocuments} />
      </UserHomeStack.Navigator>
    );
  }

  if (state === 'LOADING') {
    return (
      <>
        <StatusBar barStyle={'light-content'} backgroundColor={palette.primary} />
        <View style={[styles.bgPrimary, styles.flexOne, styles.w100, styles.p24, styles.fullCenter]}>
          <Image source={require('./assets/logo.png')} resizeMode='contain' style={{ width: '70%', height: '9.5%' }} />
        </View>
      </>
    );
  } else {
    return (
      <React.Fragment>
        {
          modalFineLocation &&
          <BottomModal modalVisible={modalFineLocation} onHide={() => setModalFineLocation(false)}>
            <View style={[styles.w100, styles.flexGrow, styles.flexOne, styles.fullCenter]}>
              <Text style={[styles.text, styles.textCenter, styles.w100, styles.font28, styles.bold, styles.dark]}>{t('location_perm')}</Text>
              <Text style={[styles.text, styles.textCenter, styles.font18, styles.mt10, styles.dark]}>
                {t('location_perm_desc')}
              </Text>
              <Button text={t('allow')} onPress={requestLocationPermissions} bgColor={palette.primary} textColor={palette.lightGray} />
              <Button text={t('cancel')} onPress={() => setModalFineLocation(false)} bgColor={palette.dark} textColor={palette.lightGray} />
            </View>
          </BottomModal>
        }

        {
          modalBackgroundLocation &&
          <BottomModal modalVisible={modalBackgroundLocation} onHide={() => setModalBackgroundLocation(false)}>
            <View style={[styles.w100, styles.flexGrow, styles.flexOne, styles.fullCenter]}>
              <Text style={[styles.text, styles.textCenter, styles.w100, styles.font28, styles.bold, styles.dark]}>{t('bg_location_perm')}</Text>
              <Text style={[styles.text, styles.textCenter, styles.font18, styles.mt10, styles.dark]}>
                {t('bg_location_perm_desc')}
              </Text>
              <Button text={t('allow')} onPress={requestBgLocationPermissions} bgColor={palette.primary} textColor={palette.lightGray} />
              <Button text={t('cancel')} onPress={() => setModalBackgroundLocation(false)} bgColor={palette.dark} textColor={palette.lightGray} />
            </View>
          </BottomModal>
        }

        {
          pendingRatings &&
          <PendingRatingsModal pendingRatings={pendingRatings} />
        }
        <StatusBar barStyle={'light-content'} backgroundColor={palette.primary} />
        <NavigationContainer
          ref={navigationRef}
          linking={linking}
          onReady={() => {
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          }}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
            }
            routeNameRef.current = currentRouteName;
          }}
        >
          <RootStack.Navigator screenOptions={{headerShown: false}}>
            {
              authManager.authenticated === false || (verified === false && !appManager.verificationsDisabled) ? (
                <RootStack.Screen name="Guest" component={Guest} />
              ) : (
                <RootStack.Screen name="LoggedIn" component={LoggedInStack} />
              )
            }
          </RootStack.Navigator>
        </NavigationContainer>

        <DismissableError />
      </React.Fragment>
    );
  }

}

export default codePush(App);
