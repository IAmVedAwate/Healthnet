import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import RouteManager from './RouteManager'
import Navigation from './Navigation'
import GetAllBeds from './components/beds/GetAllBeds'
import AddBed from './components/beds/AddBed'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigation/>
      <RouteManager/>
    </>
  )
}

export default App
