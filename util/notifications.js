import notifee, { TriggerType } from '@notifee/react-native';

export async function createLocalNotification(title, body) {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    await notifee.displayNotification({
        title: title,
        body: body,
        android: {
            channelId,
            pressAction: {
                id: 'default',
            },
        },
    });
}

export async function scheduleLocalNotification(title, body, date) {
    await notifee.requestPermission();

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
    };

    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Create a trigger notification
    await notifee.createTriggerNotification(
        {
            title: title,
            body: body,
            android: {
                channelId: channelId,
            },
        },
        trigger,
    );
}