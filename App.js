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

import HomeScreen from './screens/Guest/HomeScreen';
import SignUpScreen from './screens/Guest/SignUpScreen';
import LoginScreen from './screens/Guest/LoginScreen';
import MapScreen from './screens/BookRide/MapScreen';
import RideFinder from './screens/BookRide/RideFinder';
import BookRide from './screens/BookRide/BookRide';
import PostRide from './screens/PostRide/PostRide';
import Account from './screens/Account/Account';
import UserHome from './screens/HomeScreen/UserHome';
import ViewTrip from './screens/PostRide/ViewTrip';
import ManageTrip from './screens/Rides/ManageTrip';
import Wallet from './screens/Account/Wallet';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { palette } from './helper';
import Checkout from './screens/Rides/Checkout';
import AllTrips from './screens/Rides/AllTrips';
import AddCard from './screens/Account/AddCard';
import ManageCars from './screens/Account/ManageCars';
import NewCar from './screens/Account/NewCar';
import Announcement from './screens/HomeScreen/Announcement';
import SubmitDriverDocuments from './screens/Account/SubmitDriverDocuments';
import ViewCommunities from './screens/Communities/ViewCommunities';
import Chat from './screens/Chat/Chat';
import ChatsList from './screens/Chat/ChatsList';
import AddBank from './screens/Account/AddBank';
import SearchCommunities from './screens/Communities/SearchCommunities';
import ViewCommunity from './screens/Communities/ViewCommunity';

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
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Guest" component={Guest} options={{ headerShown: false }} />
        <RootStack.Screen name="LoggedIn" component={LoggedInStack} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
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
      <AccountStack.Screen name="Chats List" component={ChatsList} options={{headerShown: false}} />
      <AccountStack.Screen name="Add Bank" component={AddBank} options={{headerShown: false}} />
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
