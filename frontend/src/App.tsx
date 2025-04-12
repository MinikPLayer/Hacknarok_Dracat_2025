import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import Login from "./components/login/login";
import CustomNavbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import {useContext} from "react";
import Register from "./components/register/register";
import Logout from "./components/logout/logout";
import Main from "./components/main/main";
import UserProfile from "./components/userProfile/userProfile";
import {AuthProvider} from "./AuthContext";

function App() {
  return (
<div className={`App`}>
            <BrowserRouter>
                <AuthProvider>
                {/* Navbar */}
                <CustomNavbar/>

                <div className="background-main min-vh-100">
                    <Routes>
                        <Route path="/" element={<Homepage/>}/>
                        <Route path="/userProfile" element={<UserProfile/>}/>

                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/logout" element={<Logout/>}/>
                        <Route path="/main" element={<Main/>}/>
                    </Routes>
                </div>
                {/* Routes */}


                {/* Footer */}
                <Footer/>
                </AuthProvider>
            </BrowserRouter>
        </div>
  );
}

export default App;
