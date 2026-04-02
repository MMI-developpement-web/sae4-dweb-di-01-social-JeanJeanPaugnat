import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import LogIn from './routes/LogIn.tsx';
import SignUp from './routes/SignUp.tsx';
import CreatePost from './routes/CreatePost.tsx';
import EditPostPage from './routes/EditPost.tsx';
import Feed from './routes/Feed.tsx';
import Home from './routes/Home.tsx';

import ProfilePage from './routes/ProfilePage.tsx';
import EditProfilePage from './routes/EditProfilePage.tsx';
import { showPublicProfile, showMyProfile } from './utils/ProfileData.ts';
import { getPost } from './utils/PostData.ts';
import { hydrateAuth } from './utils/UserData.ts';
import { hydrateTheme } from './store/themeStore.ts';
import './index.css';


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
    path: '/edit-post/:postId',
    element: <EditPostPage />,
    loader: async ({ params }) => {
      return getPost(Number(params.postId));
    },
  },
  {
    path: '/profile/edit',
    element: <EditProfilePage />,
    loader: showMyProfile,
  },
  {
    path: '/profile/:username',
    element: <ProfilePage />,
    loader: showPublicProfile,
  },

], {
  basename: import.meta.env.BASE_URL
});

hydrateTheme();
hydrateAuth().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
});
