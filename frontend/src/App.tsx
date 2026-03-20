import { useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Input from './components/ui/Input'
import Icon from './components/ui/Icon'
import Button from './components/ui/button'
import Avatar from './components/ui/Avatar'

import LogInForm from './components/section/LogInForm'
import SignUpForm from './components/section/SignUpForm'
import CreatePost from './components/section/CreatePost'
import {Link} from "react-router-dom"

import CardPost from './components/ui/CardPost'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
          <div className="flex flex-row">
            <LogInForm/>
            <SignUpForm/>
          </div>
          <CreatePost />
          <CardPost
            isFirst={true}
            username="John Doe"
            avatarUrl="/path/to/avatar.jpg"
            timeAgo="2 hours ago"
            content="This is a sample post content. It can be as long as you want, but it will be truncated after a certain point to maintain a clean layout."
          />
      </div>
    </>
  )
}

export default App
