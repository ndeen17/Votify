// React Import
import React from "react";
import ReactDOM from "react-dom/client";

// Component Import
import App from "./App";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// Css Import
import "./index.css";

// Custom Import
import { store } from "./app/store";

// Third party import
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Footer from "./components/footer/Footer";

// import { electionApiSlice } from "./features/election/electionApiSlice";

// store.dispatch(electionApiSlice.endpoints.getElections.initiate());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <div>
                <App />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={true}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable={true}
                  pauseOnHover
                  theme="light"
                />
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
