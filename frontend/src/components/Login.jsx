import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../App.css';

const Login = () => {
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const { email, password } = user;

  const onInputChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const signIn = async (e) => {
    e.preventDefault();

    if (user.email === '') {
      alert('Email Field is empty');
      return;
    } else if (user.password === '') {
      alert('Password Field is empty');
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", user);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token); // Store token
        localStorage.setItem('username', response.data.user.email);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        navigate("/"); // Navigate to home page or another route
      } else {
        setMsg(response.data.message || "Login failed. Please check your credentials.");
      }
      
    } catch (error) {
      console.error("There was an error logging in!", error);
      setMsg("Wrong Email and Password.");
    }
  };

  return (
    <div className='full-background d-flex justify-content-center align-items-center'>
      <div className='card shadow-lg' style={{ maxWidth: '400px', width: '100%' }}>
        <div className='card-body'>
          <h2 className='card-title mb-4 text-center'>Login</h2>
          {msg && <div className="alert alert-danger">{msg}</div>}
          <a href="/Signup" className='btn btn-success w-100 mb-4'>
            Register
          </a>
          <form onSubmit={signIn}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
              <input
                type="email"
                value={email}
                name="email"
                onChange={e => onInputChange(e)}
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Enter your email"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={e => onInputChange(e)}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
