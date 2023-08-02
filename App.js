/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useCallback, useEffect, useState } from 'react';
import 'react-native-gesture-handler';


import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

import * as Keychain from 'react-native-keychain';
import useUserStore from './api/accountAPI';
import useAuthManager from './context/authManager';
import { palette } from './helper';
import AddBank from './screens/Account/AddBank';
import AddCard from './screens/Account/AddCard';
import AddMobileWallet from './screens/Account/AddMobileWallet';
import ManageCars from './screens/Account/ManageCars';
import NewCar from './screens/Account/NewCar';
import Otp from './screens/Account/Otp';
import SubmitDriverDocuments from './screens/Account/SubmitDriverDocuments';
import Chat from './screens/Chat/Chat';
import ChatsList from './screens/Chat/ChatsList';
import SearchCommunities from './screens/Communities/SearchCommunities';
import ViewCommunities from './screens/Communities/ViewCommunities';
import ViewCommunity from './screens/Communities/ViewCommunity';
import ChangePasswordScreen from './screens/Guest/ChangePasswordScreen';
import ForgotPasswordScreen from './screens/Guest/ForgotPasswordScreen';
import Announcement from './screens/HomeScreen/Announcement';
import AllTrips from './screens/Rides/AllTrips';
import Checkout from './screens/Rides/Checkout';
import Referral from './screens/Account/Referral';

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

const App = () => {
  const authManager = useAuthManager();
  const userStore = useUserStore();
  const [state, setState] = useState('LOADING');

  const config = {
    screens: {
      LoggedIn: {
        screens: {
          TabScreen: {
            screens: {
              Home: {
                screens: {
                  "View Trip": 'ride/:tripId'
                }
              }
            }
          }
        },
      },
    },
  };

  const linking = {
    prefixes: ['alsekka://', 'https://alsekka.com'],
    config
  };


  const loadJWT = useCallback(async () => {
    try {
      const value = await Keychain.getGenericPassword();
      if (!value) {
        authManager.setAccessToken(null);
        authManager.setRefreshToken(null);
        authManager.setAuthenticated(false);
        return setState("Guest");
      }
      const jwt = JSON.parse(value.password);

      authManager.setAccessToken(jwt.accessToken || null);
      authManager.setRefreshToken(jwt.refreshToken || null);
      authManager.setAuthenticated(jwt.accessToken !== null);
      await userStore.userInfo();
      setState("LoggedIn");
    } catch (error) {
      console.log(error);
      console.log(`Keychain Error: ${error.message}`);
      setState("Guest");
      authManager.setAccessToken(null);
      authManager.setRefreshToken(null);
      authManager.setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    loadJWT()
  }, [loadJWT])

  if (state === 'LOADING') {
    return (<></>);
  } else {
    return (
      <NavigationContainer linking={linking}>
        <RootStack.Navigator>
          {
            authManager.authenticated === false ? (
              <RootStack.Screen name="Guest" component={Guest} options={{ headerShown: false }} />
            ) : (
              <RootStack.Screen name="LoggedIn" component={LoggedInStack} options={{ headerShown: false }} />
            )
          }
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }

}

const LoggedInStack = ({ route, navigation }) => {
  return (
    <UserStack.Navigator initialRouteName="TabScreen">
      <UserStack.Screen name="TabScreen" component={LoggedInHome} options={{ headerShown: false }} />
      <UserStack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
    </UserStack.Navigator>
  );
};

const LoggedInHome = ({ route, navigation }) => {
  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{ tabBarActiveTintColor: palette.primary, tabBarInactiveTintColor: palette.dark }}>
      <Tab.Screen name="Home" component={UserHomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="Find Rides" component={BookRideNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="Post Rides" component={PostRideNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return (<MaterialIcons name="directions-car" size={size} color={color} />);
          }
        }} />
      <Tab.Screen name="Communities" component={CommunityNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return (<MaterialIcons name="forum" size={size} color={color} />);
          }
        }} />
      <Tab.Screen name="Account" component={AccountNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return (<MaterialIcons name="person" size={size} color={color} />);
          }
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
    </CommunityStack.Navigator>
  );
};

const AccountNavigator = ({ route, navigation }) => {
  return (
    <AccountStack.Navigator initialRouteName='Account Home'>
      <AccountStack.Screen name="Account Home" component={Account} options={{ headerShown: false }} />
      <AccountStack.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
      <AccountStack.Screen name="Add Card" component={AddCard} options={{ headerShown: false }} />
      <AccountStack.Screen name="All Trips" component={AllTrips} options={{ headerShown: false }} />
      <AccountStack.Screen name="Manage Cars" component={ManageCars} options={{ headerShown: false }} />
      <AccountStack.Screen name="New Car" component={NewCar} options={{ headerShown: false }} />
      <AccountStack.Screen name="Chats List" component={ChatsList} options={{ headerShown: false }} />
      <AccountStack.Screen name="Add Bank" component={AddBank} options={{ headerShown: false }} />
      <AccountStack.Screen name="Add Mobile Wallet" component={AddMobileWallet} options={{ headerShown: false }} />
      <AccountStack.Screen name="Referral" component={Referral} options={{ headerShown: false }} />
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

export default App;
