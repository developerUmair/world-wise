import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { login } from "../../store/featues/Auth/AuthSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigation

  let baseUrl = useSelector(state => state.auth.baseUrl);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        {
          email,
          password,
        }
      );
      const { token } = response.data;

      if (response.status === 200) {
        localStorage.setItem("token", token);
        dispatch(login(token));
        toast.success("Login successful!");

        // Redirect to the game screen
        navigate("/game");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="register-form">
        <Input
          type="email"
          value={email}
          setType={setEmail}
          className="input-field"
          placeholder="Email"
        />
        <Input
          type="password"
          value={password}
          setType={setPassword}
          className="input-field"
          placeholder="Password"
        />
        
        <Button type='submit' className='login-button'>Login</Button>
        {/* <button className="login-button" type="submit">
          Login
        </button> */}
      </form>
    </div>
  );
};

export default Login;
