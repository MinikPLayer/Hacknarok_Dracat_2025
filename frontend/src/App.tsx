import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import Login from "./components/login/login";
import CustomNavbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Register from "./components/register/register";
import Logout from "./components/logout/logout";
import Main from "./components/main/main";
import {AuthProvider} from "./AuthContext";
import UserProfile from './components/userProfile/userProfile';
import MapWithPins from "./components/mapWithPins/mapWithPins";
import ImageSwiper from "./components/imageSwiper/imageSwiper";
import Notifications from "./components/notifications/notifications"
import FormModule from './components/form/formModule';
import FeedbackForm from "./components/feedbackForm/feedbackForm";

import RankingPage from './components/ranking/ranking';
import LlamaChat from "./components/llamaChat/llamaChat";
import WorldResults from "./components/llamaChat/worldResults";
import AddPlace from './components/newPlace/newPlace';
import TripsPage from './components/tripsPage/tripsPage';
import StorytellingPage from './components/storyTelling/storyTelling';
import ExplorePage from './components/explore/explore';
import AchievementsPage from './components/achievements/achievements';


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
                        <Route path="/userProfile" element={<UserProfile isOwnProfile={true}/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/logout" element={<Logout/>}/>
                        <Route path="/main" element={<Main/>}/>
                        <Route path="/map" element={<MapWithPins/>}/>
                        <Route path="/swiper" element={<ImageSwiper/>}/>
                        <Route path="/notifications" element={<Notifications/>}/>
                        <Route path="/userProfile/:id" element={<UserProfile isOwnProfile={false}/>}/>
                        <Route path="/form" element={<FormModule/>}/>
                        <Route path="/feedback" element={<FeedbackForm/>}/>
                        <Route path="/ranking" element={<RankingPage/>}/>
                        <Route path="/chat" element={<LlamaChat/>}/>
                        <Route path="/worlds" element={<WorldResults/>}/>
                        <Route path='/newPlace' element={<AddPlace/>}/>
                        <Route path='/trips' element={<TripsPage/>}/>
                        <Route path='/storyTelling' element={<StorytellingPage/>}/>
                        <Route path="/explore" element={<ExplorePage/>}/>
                        <Route path="/achievements" element={<AchievementsPage/>}/>


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
