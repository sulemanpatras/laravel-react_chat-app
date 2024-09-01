import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [errors, setErrors] = useState('');
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { name, email, password } = user;

    const onInputChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    async function signup(e) {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:8000/api/register", user);
            navigate('/');
        } catch (error) {
            setErrors('Registration Failed');
            setUser({ name: "", email: "", password: "" });
        }
    }

    return (
        <div className='full-background d-flex justify-content-center align-items-center'>
            <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="card-title mb-4 text-center">Signup</h2>
                    {errors && <div className="alert alert-danger mb-4">{errors}</div>}
                    <a href="/" className='btn btn-success w-100 mb-4'>
                        Home
                    </a>
                    <form onSubmit={signup}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputName1" className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={e => onInputChange(e)}
                                className="form-control"
                                id="exampleInputName1"
                                placeholder="Enter your name"
                            />
                        </div>
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
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={e => onInputChange(e)}
                                className="form-control"
                                id="exampleInputPassword1"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="exampleCheck1"
                                onChange={togglePasswordVisibility}
                            />
                            <label className="form-check-label" htmlFor="exampleCheck1">Show password</label>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
