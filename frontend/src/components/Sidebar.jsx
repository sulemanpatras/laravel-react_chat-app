import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sidebar = ({ isCollapsed, onUserSelect, unreadMessages, selectedUserId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem("user"));

        const response = await axios.get('http://127.0.0.1:8000/api/allusers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data)) {
          const filteredUsers = response.data.filter(user => user.id !== storedUser.id);
          setUsers(filteredUsers);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('There was an error fetching the user data!', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    onUserSelect(user); // Trigger the callback to the parent component
  };

  return (
    <div className={`sidebar${isCollapsed ? ' collapsed' : ''} d-flex flex-column flex-shrink-0 p-3 bg-light vh-100`}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <svg className="bi me-2" width="16" height="16"></svg>
        <span className="fs-4 fw-bold">Users</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.id} className="nav-item">
              <a href="#"
                className={`nav-link ${selectedUserId === user.id ? 'active bg-primary text-white' : 'link-dark'}`}
                onClick={() => handleUserSelect(user)}
              >
                <svg className="bi me-2" width="16" height="16"></svg>
                {user.name}
{unreadMessages[user.id] > 0 && (
  <span className="badge bg-danger ms-2">{unreadMessages[user.id]}</span>
)}

              </a>
            </li>
          ))
        ) : (
          <li className="nav-item">
            <span className="nav-link">No users available</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
