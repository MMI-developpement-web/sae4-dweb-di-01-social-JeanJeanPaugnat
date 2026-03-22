import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import LogIn from './routes/LogIn.tsx';
import SignUp from './routes/SignUp.tsx';
import CreatePost from './routes/CreatePost.tsx';
import Feed from './routes/Feed.tsx';
import Home from './routes/Home.tsx';

import Navbar from './components/ui/Navbar.tsx';
import ProfilePage from './routes/ProfilePage.tsx';
import PublicProfilePage from './routes/PublicProfilePage.tsx';
import { showMyProfile, showPublicProfile } from './utils/ProfileData.ts';
// import './index.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <LogIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/create-post',
    element: <CreatePost />,
  },
  {
    path: '/feed',
    element: <Feed />,
  },
  {
    path: '/profile/me',
    element: <ProfilePage />,
    loader: showMyProfile,
  },
  {
    path: '/profile/:username',
    element: <PublicProfilePage />,
    loader: showPublicProfile,
  }

], {
  basename: import.meta.env.BASE_URL
});



  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
