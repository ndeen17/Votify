import React, { useState } from "react";
import { authApi } from "./authApi";
import { setUserState } from "../user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./form.css";
import logSvg from "../../assets/log.svg";
import regSvg from "../../assets/register.svg";

import { toast } from "react-toastify";
import { Oval, ThreeDots } from "react-loader-spinner";

export default function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { useLoginMutation, useRegisterMutation } = authApi;
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  // FORM STATE
  const [formType, setFormType] = useState("register");
  // INPUT STATE
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const lengthVal = (string) => {
    if (string.length > 2) {
      return true;
    } else {
      return false;
    }
  };
  const [pending, setPending] = useState("");
  // REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!navigator.onLine) {
      toast.warn("You are offline");
      return;
    }
    if (!lengthVal(username) || !lengthVal(email) || !lengthVal(password)) {
      toast.warn("characters must be more than two");
      return;
    }
    setPending("regPending");
    const userData = await register({
      name: username,
      email,
      password,
    }).unwrap();
    setPending("");
    if (userData === "invalidRegister") {
      toast.warn("Fill all the fields properly");
      return;
    }
    if (userData === "userAlreadyExist") {
      toast.error("Account alredy exist");
      return;
    }
    if (userData === "serverError") {
      toast.error("server error, try again later");
      return;
    }
    if (userData.user.email) {
      dispatch(setUserState(userData));
      navigate("/dash");
      return;
    }
  };

  // LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!navigator.onLine) {
      toast.warn("You are offline");
      return;
    }
    if (!lengthVal(email) || !lengthVal(password)) {
      toast.warn("characters must be more than two");
      return;
    }
    setPending("logPending");
    const userData = await login({
      email: email,
      password,
    }).unwrap();
    setPending("");
    if (userData === "invalidLogin") {
      toast.warn("Fill all the fields properly");
      return;
    }
    if (userData === "userDoesNotExist") {
      toast.error("Account does not exist");
      return;
    }
    if (userData === "youArenotAuthorizeToAccessThisRoute") {
      toast.error("Password is incorrect");
      return;
    }
    if (userData === "serverError") {
      toast.error("server error, try again later");
      return;
    }
    if (userData.user.email) {
      dispatch(setUserState(userData));
      navigate("/dash");
      return;
    }
  };

  return (
    <div>
      <div
        className={
          formType === "login" ? "container " : "container sign-up-mode"
        }
      >
        <div className="forms-container">
          <div className="signin-signup">
            <form action="#" className="sign-in-form" onSubmit={handleLogin}>
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {pending !== "logPending" && (
                <input
                  type="submit"
                  value="Login"
                  className="button btn solid"
                />
              )}
              {pending === "logPending" && (
                <button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="button btn solid"
                >
                  <Oval
                    height={25}
                    width={25}
                    color="white"
                    wrapperStyle={{ marginRight: "5px" }}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="white"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                  />
                  <div>Loading</div>
                  <div>
                    <ThreeDots
                      height="20"
                      width="20"
                      radius="2"
                      color="white"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{ marginLeft: "5px", marginTop: "5px" }}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                </button>
              )}

              {/* <p className="social-text">Or Sign in with social platforms</p> */}
              {/* <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div> */}
            </form>

            <form action="#" className="sign-up-form" onSubmit={handleRegister}>
              <h2 className="title">Sign up</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {pending !== "regPending" && (
                <input
                  type="submit"
                  className="button btn"
                  value={"Register"}
                />
              )}
              {pending === "regPending" && (
                <button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="button btn"
                >
                  <Oval
                    height={25}
                    width={25}
                    color="white"
                    wrapperStyle={{ marginRight: "5px" }}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="white"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                  />
                  <div>Loading</div>
                  <div>
                    <ThreeDots
                      height="20"
                      width="20"
                      radius="2"
                      color="white"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{ marginLeft: "5px", marginTop: "5px" }}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                </button>
              )}
              {/* <p className="social-text">Or Sign up with social platforms</p> */}
              {/* <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div> */}
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>Click this button to register</p>
              <button
                className="button btn transparent"
                id="sign-up-btn"
                onClick={() => {
                  setFormType("register");
                }}
              >
                Sign up
              </button>
            </div>
            <img src={logSvg} className="image" alt="log.svg" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>Click this button to login</p>
              <button
                className="button btn transparent"
                id="sign-in-btn"
                onClick={() => {
                  setFormType("login");
                }}
              >
                Sign in
              </button>
            </div>
            <img src={regSvg} className="image" alt="register.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}
