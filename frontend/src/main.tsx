import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import Root from './routes/Root.tsx';
import LogIn from './routes/LogIn.tsx';
import SignUp from './routes/SignUp.tsx';
import CreatePost from './routes/CreatePost.tsx';
import Feed from './routes/Feed.tsx';

import Navbar from './components/ui/Navbar.tsx';

// import './index.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
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
  }
]);



  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
      <Navbar variant="default" />
    </React.StrictMode>,
  )
