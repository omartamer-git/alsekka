/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'react-native-gesture-handler';


import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, PermissionsAndroid, TouchableOpacity } from 'react-native';

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
import useAppStateManager from './context/appStateManager';
import LottieView from 'lottie-react-native';
import { AppState } from 'react-native';


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

  // const authManager = useAuthManager();
  const authAccessToken = useAuthManager((state) => state.accessToken);
  const authRefreshToken = useAuthManager((state) => state.refreshToken);
  const authAuthenticated = useAuthManager((state) => state.authenticated);
  const authSetState = useAuthManager((state) => state.setState);

  const postDriverLocation = useUserStore((state) => state.postDriverLocation);
  const userInfo = useUserStore((state) => state.userInfo);
  const getAvailableCards = useUserStore((state) => state.getAvailableCards);
  const getBankAccounts = useUserStore((state) => state.getBankAccounts);
  const getMobileWallets = useUserStore((state) => state.getMobileWallets);
  const userId = useUserStore((state) => state.id);
  const unreadMessages = useUserStore((state) => state.unreadMessages);
  const verified = useUserStore((state) => state.verified);
  const linkDevice = useUserStore((state) => state.linkDevice);

  const [guest, setGuest] = useState(true);

  // const appManager = useAppManager();
  const setDeviceToken = useAppManager((state) => state.setDeviceToken);
  const deviceToken = useAppManager((state) => state.deviceToken);
  const verificationsDisabled = useAppManager((state) => state.verificationsDisabled);

  // const appStateManager = useAppStateManager();
  const appStateLoading = useAppStateManager((state) => state.loading);
  const appStateSetLoading = useAppStateManager((state) => state.setLoading);

  // const [state, setState] = useState('LOADING');
  I18nManager.allowRTL(true);
  // const { t } = useTranslation();

  const config = useMemo(() => ({
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
  }), []);

  const linking = useMemo(() => ({
    prefixes: ['seaats://', 'https://seaats.app/share/', 'https://www.seaats.app/share/'],
    config
  }), [])

  // useEffect(() => {
  //   let newGuest = authAuthenticated === false || (verified === false && !verificationsDisabled);
  //   if(guest !== newGuest) {
  //     setGuest(newGuest);
  //   }
  // }, [authAuthenticated, verified, verificationsDisabled])

  const localeContext = useLocale();
  Text.defaultProps = {};
  Text.defaultProps.maxFontSizeMultiplier = 1.15;

  TextInput.defaultProps = {};
  TextInput.defaultProps.maxFontSizeMultiplier = 1.15;


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

  const requestLocationPermissions = useCallback(() => {
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
  }, [t]);

  const requestBgLocationPermissions = useCallback(() => {
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
  }, [t])

  useEffect(
    function () {
      if (Platform.OS === 'ios') {
        requestTrackingPermission();

        PushNotificationIOS.addEventListener("register", (deviceToken) => {
          registerDevice(deviceToken);
          setDeviceToken(deviceToken);
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
              setDeviceToken(token);
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
      if (authAuthenticated) {
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
        authSetState({
          accessToken: null,
          refreshToken: null,
          authenticated: false
        });

        return appStateSetLoading(false);
      }

      const jwt = JSON.parse(value.password);

      authSetState({
        accessToken: jwt.accessToken || null,
        refreshToken: jwt.refreshToken || null,
        authenticated: jwt.accessToken !== null
      })

      try {
        await Promise.all([userInfo(), getAvailableCards(), getBankAccounts(), getMobileWallets()]);
      } catch (err) {
        console.log(err);
      } finally {
        appStateSetLoading(false);
      }
    } catch (error) {
      appStateSetLoading(false);
    }
  }, []);

  useEffect(function () {
    loadJWT()
  }, [loadJWT, authAccessToken]);

  // const errorManager = useErrorManager();
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const [pendingRatings, setPendingRatings] = useState();

  useEffect(function () {
    if (deviceToken && userId) {
      linkDevice(deviceToken);
    }
  }, [deviceToken, userId]);

  useEffect(() => {
    if (authAuthenticated) {
      const pending = passengerPendingRatings().then(pending => {
        if (!pending.complete) {
          setPendingRatings(pending)
        }
      });
    }
  }, [authAuthenticated])

  const LoadingSplashScreen = memo((props) => {
    const [takingTooLong, setTakingTooLong] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
      setTimeout(() => {
        setTakingTooLong(true);
      }, 5000);

      return () => clearTimeout(timerRef.current);
    }, []);


    return (
      <>
        <StatusBar barStyle={'light-content'} backgroundColor={palette.primary} />
        <View style={[styles.bgPrimary, styles.flexOne, styles.w100, styles.p24, styles.fullCenter]}>
          <View style={[styles.flexOne, styles.w100, styles.fullCenter]}>
            <Image source={require('./assets/logo.png')} resizeMode='contain' style={{ width: '70%', height: '9.5%' }} />
          </View>
          <LottieView source={require('./assets/loading_animation.json')} style={{ width: 75, height: 75 }} loop autoPlay />
          {takingTooLong &&
            <TouchableOpacity onPress={() => appStateSetLoading(false)} style={[styles.w100, styles.p16, styles.fullCenter]}>
              <Text style={[styles.text, styles.white, styles.textCenter, styles.bold]}>{t('splashscreen_failsafe')}</Text>
            </TouchableOpacity>
          }
        </View>
      </>
    )
  });

  const appState = useRef(AppState.currentState)
  const stateRef = useRef(appStateLoading);

  useEffect(() => {
    stateRef.current = appStateLoading;
  }, [appStateLoading]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = useCallback((nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (stateRef.current === true) {
        // console.log(stateRef.current);
        authSetState({
          accessToken: null,
          refreshToken: null,
          authenticated: false
        });
        loadJWT(); // Re-run the JWT loading function
      }
    }
    appState.current = nextAppState
  }, [authSetState, loadJWT])

  const LoggedInStack = ({ route, navigation }) => {
    return (
      <UserStack.Navigator initialRouteName="TabScreen">
        <UserStack.Screen name="TabScreen" component={LoggedInHome} options={{ headerShown: false }} />
        <UserStack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <UserStack.Screen name="Customer Service" component={CustomerService} options={{ headerShown: false }} />
      </UserStack.Navigator>
    );
  };

  const LoggedInHome = ({ route, navigation }) => {
    return (
      <Tab.Navigator initialRouteName='Home' screenOptions={{ tabBarActiveTintColor: palette.primary, tabBarInactiveTintColor: palette.gray }}>
        <Tab.Screen name="Home" component={UserHomeNavigator}
          options={{
            headerShown: false,
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
            headerShown: false,
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
            headerShown: false,
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
            headerShown: false,
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
            headerShown: false,
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
      <GuestStack.Navigator>
        <GuestStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <GuestStack.Screen name="Sign Up" component={SignUpScreen} options={{ headerShown: false }} />
        <GuestStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <GuestStack.Screen name="Forgot Password" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <GuestStack.Screen name="Change Password" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <GuestStack.Screen name="Otp" component={Otp} options={{ headerShown: false }} />
      </GuestStack.Navigator>
    );
  }


  const BookRideNavigator = ({ route, navigation }) => {
    return (
      <BookingStack.Navigator initialRouteName='Find a Ride'>
        <BookingStack.Screen name="Find a Ride" component={MapScreen} options={{ headerShown: false }} />
        <BookingStack.Screen name="Choose a Ride" component={RideFinder} options={{ headerShown: false }} />
        <BookingStack.Screen name="Book Ride" component={BookRide} options={{ headerShown: false }} />
        <BookingStack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
        <BookingStack.Screen name="Ride Booked" component={RideBooked} options={{ headerShown: false }} />
        <UserHomeStack.Screen name="View Trip" component={ViewTrip} options={{ headerShown: false }} />
      </BookingStack.Navigator>
    );
  }


  const PostRideNavigator = ({ route, navigation }) => {
    return (
      <PostRideStack.Navigator initialRouteName='Post a Ride'>
        <PostRideStack.Screen name="Post a Ride" component={PostRide} options={{ headerShown: false }} />
        <PostRideStack.Screen name="Driver Documents" component={SubmitDriverDocuments} options={{ headerShown: false }} />
        <PostRideStack.Screen name="New Car" component={NewCar} options={{ headerShown: false }} />
      </PostRideStack.Navigator>
    );
  }

  const CommunityNavigator = ({ route, navigator }) => {
    return (
      <CommunityStack.Navigator>
        <CommunityStack.Screen name="View Communities" component={ViewCommunities} options={{ headerShown: false }} />
        <CommunityStack.Screen name="View Community" component={ViewCommunity} options={{ headerShown: false }} />
        <CommunityStack.Screen name="Search Communities" component={SearchCommunities} options={{ headerShown: false }} />
        <CommunityStack.Screen name="New Community" component={NewCommunity} options={{ headerShown: false }} />
        <CommunityStack.Screen name="Community Settings" component={CommunitySettings} options={{ headerShown: false }} />
        <CommunityStack.Screen name="Community Members" component={CommunityMembers} options={{ headerShown: false }} />
      </CommunityStack.Navigator>
    );
  };

  const AccountNavigator = ({ route, navigation }) => {
    return (
      <AccountStack.Navigator initialRouteName='Account Home'>
        <AccountStack.Screen name="Account Home" component={Account} options={{ headerShown: false }} />
        <AccountStack.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
        <AccountStack.Screen name="Withdraw" component={Withdraw} options={{ headerShown: false }} />
        <AccountStack.Screen name="View Withdrawals" component={ViewWithdrawals} options={{ headerShown: false }} />
        <AccountStack.Screen name="Debt Payment" component={DebtPayment} options={{ headerShown: false }} />
        <AccountStack.Screen name="Add Card" component={AddCard} options={{ headerShown: false }} />
        <AccountStack.Screen name="All Trips" component={AllTrips} options={{ headerShown: false }} />
        <AccountStack.Screen name="Manage Cars" component={ManageCars} options={{ headerShown: false }} />
        <AccountStack.Screen name="New Car" component={NewCar} options={{ headerShown: false }} />
        <AccountStack.Screen name="Chats List" component={ChatsList} options={{ headerShown: false }} />
        <AccountStack.Screen name="Add Bank" component={AddBank} options={{ headerShown: false }} />
        <AccountStack.Screen name="Add Mobile Wallet" component={AddMobileWallet} options={{ headerShown: false }} />
        <AccountStack.Screen name="Referral" component={Referral} options={{ headerShown: false }} />
        <AccountStack.Screen name="Add Referral" component={AddReferral} options={{ headerShown: false }} />
      </AccountStack.Navigator>
    );
  }

  const UserHomeNavigator = ({ route, navigation }) => {
    return (
      <UserHomeStack.Navigator >
        <UserHomeStack.Screen name="User Home" component={UserHome} options={{ headerShown: false }} />
        <UserHomeStack.Screen name="View Trip" component={ViewTrip} options={{ headerShown: false }} />
        <UserHomeStack.Screen name="Manage Trip" component={ManageTrip} options={{ headerShown: false }} />
        <UserHomeStack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
        <UserHomeStack.Screen name="All Trips" component={AllTrips} options={{ headerShown: false }} />
        <UserHomeStack.Screen name="Announcement" component={Announcement} options={{ headerShown: false }} />
        <UserHomeStack.Screen name="Driver Documents" component={SubmitDriverDocuments} options={{ headerShown: false }} />
      </UserHomeStack.Navigator>
    );
  }


  if (appStateLoading) {
    return (
      <LoadingSplashScreen />
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
          <RootStack.Navigator>
            {
              authAuthenticated === false || (verified === false && !verificationsDisabled) ? (
                <RootStack.Screen name="Guest" component={Guest} options={{ headerShown: false }} />
              ) : (
                <RootStack.Screen name="LoggedIn" component={LoggedInStack} options={{ headerShown: false }} />
              )
            }
          </RootStack.Navigator>
        </NavigationContainer>

        <DismissableError />
      </React.Fragment>
    );
  }

}

App.whyDidYouRender = true;


export default codePush(App);
