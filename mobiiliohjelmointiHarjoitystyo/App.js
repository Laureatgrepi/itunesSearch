import React from 'react';
import { StyleSheet, Text, View, Button, Alert,TextInput,FlatList } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import LibraryScreen from './LibraryScreen';


export default class App extends React.Component{
  
  render() {
    return<MyApp/>;
  }
}
const MyApp = createStackNavigator({
  Home:{screen: HomeScreen},
  History:{screen: HistoryScreen},
  Library:{screen: LibraryScreen}
}
);

