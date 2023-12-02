/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  EventType,
  AndroidImportance,
  TriggerType,
  Trigger,
} from '@notifee/react-native';

if (Platform.OS === 'android') {
  const onMessageReceived = async message => {
    notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    const notification = {
      title: 'Seaats',
      body: message.data.default,
      android: {
        channelId: 'default'
      }
    }
    await notifee.displayNotification(notification);
  };

  messaging().setBackgroundMessageHandler(onMessageReceived);
  messaging().onMessage(onMessageReceived);

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    // Check if the user pressed the "Mark as read" action

    if (type === EventType.PRESS) {
      // Update external API

      eventEmitter.emit('notificationReceived', notification);

      // Remove the notification
      await notifee.cancelNotification(notification.id);
    }
  });

  notifee.onForegroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.PRESS) {
      eventEmitter.emit('notificationReceived', notification);

      await notifee.cancelNotification(notification.id);
    }
  });
}


AppRegistry.registerComponent(appName, () => App);
