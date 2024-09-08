import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Pusher from 'pusher-js';
import Sidebar from './Sidebar';
import CollapseButton from './CollapseButton';
import Notification from './Notification';


const Message = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState({});
  const [formMessages, setFormMessages] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsername(storedUser.name);
      setUserId(storedUser.id);
    } else {
      setUsername('Guest');
      setUserId(null);
    }

    Pusher.logToConsole = true;
    const pusher = new Pusher('ec84eeedbee40d46e4d7', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('chat');

    const handleMessage = data => {
      if (data.recipient_id === userId || data.sender_id === userId) {
        setMessages(prevMessages => {
          const updatedMessages = { ...prevMessages };
          if (!updatedMessages[data.sender_id]) {
            updatedMessages[data.sender_id] = [];
          }
          if (!updatedMessages[data.sender_id].some(msg => msg.id === data.id)) {
            updatedMessages[data.sender_id].push(data);
          }
          return updatedMessages;
        });

        if (data.sender_id !== userId) {
          setUnreadMessages(prevUnreadMessages => ({
            ...prevUnreadMessages,
            [data.sender_id]: (prevUnreadMessages[data.sender_id] || 0) + 1
          }));
        }
      }
    };


    channel.bind('message', handleMessage);

    return () => {
      channel.unbind('message', handleMessage);

      pusher.unsubscribe('chat');
    };
  }, [selectedUser, userId]);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/messages/${userId}/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(prevMessages => ({
        ...prevMessages,
        [user.id]: data
      }));

      setUnreadMessages(prevUnreadMessages => ({
        ...prevUnreadMessages,
        [user.id]: 0
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
  
    if (!selectedUser) {
      setError('Please select a user to chat with.');
      return;
    }
    if (!userId) {
      setError('Please login first to chat.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sender_id: userId,
          recipient_id: selectedUser.id,
          content: formMessages
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      if (data.success) {
        setFormMessages('');
        setError('');
  
        // Update local messages state
        setMessages(prevMessages => ({
          ...prevMessages,
          [selectedUser.id]: [...(prevMessages[selectedUser.id] || []), {
            sender_id: userId,
            recipient_id: selectedUser.id,
            content: formMessages,
            id: data.message.id
          }]
        }));
  
        // Notify recipient (Not the sender)
        if (userId !== selectedUser.id) {
          await fetch('http://127.0.0.1:8000/api/notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              message: `New message from ${username}: ${formMessages}`, 
              recipient_id: selectedUser.id 
            }),
          });
        }
  
        setUnreadMessages(prevUnreadMessages => ({
          ...prevUnreadMessages,
          [selectedUser.id]: 0
        }));
      } else {
        console.error('Failed to send message:', data.message);
      }
    } catch (error) {
      console.error('There was an error sending the message:', error);
    }
  };
  


  useEffect(() => {
    if (selectedUser && messages[selectedUser.id]?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Test notification!' }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Notification triggered');
    } catch (error) {
      console.error('Error:', error);
    }

  
  
  };
  
  
  return (
    <>
      <div className="container mt-5">
        
        <CollapseButton isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
        <Sidebar 
          isCollapsed={isCollapsed} 
          onUserSelect={handleUserSelect} 
          unreadMessages={unreadMessages} 
          selectedUserId={selectedUser?.id} // Pass the selected user ID
        />
        {isAuthenticated ? (
          <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
        ) : (
          <Link to="/login" className="btn btn-primary mb-3">Login</Link>
        )}
<Notification userId={userId} />


        <div className="chat-container bg-light p-4 rounded shadow-sm mt-4">
          <div className="user-info mb-5 text-center">
            <input
              className="username-input fs-5 fw-semibold text-info bg-transparent border-0 mb-3"
              value={username}
              readOnly
              style={{ textAlign: 'center', cursor: 'default' }}
            />
            {selectedUser && (
              <div className="chatting-with text-secondary">
                <h5>Chatting with: <span className="text-dark">{selectedUser.name}</span></h5>
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}
          <div className="messages-container list-group list-group-flush border rounded mb-3 p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {(messages[selectedUser?.id] || []).map((message) => (
              <div key={message.id} className={`message-item d-flex flex-column mb-2 p-2 ${message.sender_id === userId ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ borderRadius: '10px' }}>
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="message-sender mb-1">
                    {message.sender_id === userId ? 'Me' : selectedUser?.name}
                  </strong>
                </div>
                <div className="message-content small">
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="message-input mt-4">
            <form onSubmit={submit} className="d-flex">
            <input
                className="form-control rounded-0 border-end-0"
                placeholder="Write a message..."
                value={formMessages}
                onChange={(e) => {
                  setFormMessages(e.target.value);        }}
                style={{ borderRadius: '10px 0 0 10px' }}
              />
              <button type="submit" className="btn btn-primary rounded-0">Send</button>
             

            </form>
          </div>
        </div>    
      </div>
    </>
  );
};

export default Message;