import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import InputTest from './components/ui/Input'
import Icon from './components/ui/Icon'
import Button from './components/ui/button'

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
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <Icon  size={48} color="blue" />
        <InputTest variant="secondary" placeholder="Type something..." />

      </div>
      <h1>Vite + React</h1>
      <div className="card">
          <p className='bg-red-500'>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
