import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Game from "./App/components/Game";
import Login from "./App/components/Login";
import Register from "./App/components/Register";
import { login, logout } from "./store/featues/Auth/AuthSlice";

const App = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isLogin, setIsLogin] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(login(token));
    }
  }, [dispatch]);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/game"
            element={isAuthenticated ? <Game /> : <Navigate to="/" replace />}
          />

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/game" replace />
              ) : (
                <div>
                  {isLogin ? <Login /> : <Register />}
                  <button
                    className="btn"
                    onClick={() => setIsLogin(!isLogin)}
                    style={{ marginTop: "20px" }}
                  >
                    {isLogin
                      ? "Don't have an account? Register"
                      : "Already have an account? Login"}
                  </button>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
