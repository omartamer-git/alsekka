/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import type { Node } from 'react';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import MapScreen from './screens/MapScreen';
import RideFinder from './screens/RideFinder';
import BookRide from './screens/BookRide';
import PostRide from './screens/PostRide';
import Account from './screens/Account';
import UserHome from './screens/UserHome';
import ViewTrip from './screens/ViewTrip';
import ManageTrip from './screens/ManageTrip';
import Wallet from './screens/Wallet';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { palette } from './helper';
import Checkout from './screens/Checkout';
import AllTrips from './screens/AllTrips';
import AddCard from './screens/AddCard';
import ManageCars from './screens/ManageCars';
import NewCar from './screens/NewCar';

const RootStack = createNativeStackNavigator();
const GuestStack = createNativeStackNavigator();

const BookingStack = createNativeStackNavigator();
const PostRideStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const UserHomeStack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Guest" component={Guest} options={{ headerShown: false }} />
        <RootStack.Screen name="LoggedIn" component={LoggedInHome} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

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
    </PostRideStack.Navigator>
  );
}

const AccountNavigator = ({ route, navigation }) => {
  return (
    <AccountStack.Navigator initialRouteName='Account Home'>
      <AccountStack.Screen name="Account Home" component={Account} options={{ headerShown: false }} />
      <UserHomeStack.Screen name="Wallet" component={Wallet} options={{headerShown: false}} />
      <UserHomeStack.Screen name="Add Card" component={AddCard} options={{headerShown: false}} />
      <UserHomeStack.Screen name="All Trips" component={AllTrips} options={{headerShown: false}} />
      <UserHomeStack.Screen name="Manage Cars" component={ManageCars} options={{headerShown: false}} />
      <UserHomeStack.Screen name="New Car" component={NewCar} options={{headerShown: false}} />
    </AccountStack.Navigator>
  );
}

const UserHomeNavigator = ({route, navigation}) => {
  return (
    <UserHomeStack.Navigator >
      <UserHomeStack.Screen name="User Home" component={UserHome}  options={{ headerShown: false }} />
      <UserHomeStack.Screen name="View Trip" component={ViewTrip} options={{headerShown: false}} />
      <UserHomeStack.Screen name="Manage Trip" component={ManageTrip} options={{headerShown: false}} />
      <UserHomeStack.Screen name="Checkout" component={Checkout} options={{headerShown: false}} />
      <UserHomeStack.Screen name="All Trips" component={AllTrips} options={{headerShown: false}} />
    </UserHomeStack.Navigator>
  );
}

export default App;
