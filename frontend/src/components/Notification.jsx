import React, { useEffect, useState } from 'react';
import '../styles/notification.css'; // Import your CSS
import Pusher from 'pusher-js';

const Notification = ({ userId }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const pusher = new Pusher('ec84eeedbee40d46e4d7', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('notifications');

    // Bind using the fully qualified event name: 'App\\Event\\NotificationSent'
    channel.bind('App\\Events\\NotificationSent', (data) => {
      console.log('Notification received:', data);

      // Only display notification if the logged-in user is the recipient
      if (data.recipient_id === userId && data.message) {
        setNotification(data.message);

        // Clear notification after 5 seconds
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
    });

    return () => {
      // Unbind the event on cleanup
      channel.unbind('App\\Events\\NotificationSent');
      pusher.unsubscribe('notifications');
    };
  }, [userId]);

  return (
    <>
      {notification && (
        <div className={`notification ${notification ? 'show' : ''}`}>
          {notification}
        </div>
      )}
    </>
  );
};

export default Notification;
