import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import InputTest from './components/ui/Input'
import Icon from './components/ui/Icon'
import Button from './components/ui/button'
import Avatar from './components/ui/Avatar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Button text="Sign up" />
        <Button variant="outline" text="Cancel" />
        <Button variant="warning" size="lg" text="Supprimer" />
        <Button variant="outline" size="lg" text="Supprimer" />
        <Button variant="default" icon="github" text="Reload" />
        <Button variant="outline" icon="camera" />
        <Button variant="default" icon="image"/>
        <Button variant="warning" size="icon" icon="trash" />
        
        <Avatar url="https://avatars.githubusercontent.com/u/110604?v=4" />
        <Avatar editable url="https://avatars.githubusercontent.com/u/110604?v=4" />
        <Avatar editable />
        <Avatar size="xl" url="https://avatars.githubusercontent.com/u/110604?v=4" />
        <Avatar size="sm" editable url="https://avatars.githubusercontent.com/u/110604?v=4" />
      </div>
    </>
  )
}

export default App
