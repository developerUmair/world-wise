import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/featues/Auth/AuthSlice"; // Import the login action
import Input from "./Input";
import Button from "./Button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let baseUrl = useSelector(state => state.auth.baseUrl);


  const dispatch = useDispatch(); // Initialize the dispatch function
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/auth/register`,
        {
          username,
          email,
          password,
        }
      );

      if (response.status === 200) {
        const { token } = response.data;

        // Store the token in localStorage
        localStorage.setItem("token", token);

        // Dispatch the login action to authenticate the user
        dispatch(login(token));

        // Show success notification
        toast.success("Registration successful! Redirecting to game...");

        // Navigate to /game after registration
        navigate("/game");
      }
    } catch (error) {
      console.error("Registration error:", error); // Log error to debug
      toast.error("Registration failed! Try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <form onSubmit={handleRegister} className="login-form">
        <h1 className="login-title">🎉 Register Now! 🎉</h1>
        <Input
          type="text"
          value={username}
          setType={setUsername}
          className="input-field"
          placeholder="Username"
        />
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
        <Button type="submit" className="register-button">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
