import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
import Greeting from './Component/Greeting.jsx'
import Counter from './Component/state.jsx'
import InteractiveGreeting from './Component/InteractiveGreeting.jsx'
import InteractiveGreeting3 from './Component/InteractiveGreeting3.jsx'
import FareCal from './Component/fareCal.jsx'

createRoot(document.getElementById('root')).render(
  <div>
    <Greeting person="Shahid..!" />
    <Counter />
    <InteractiveGreeting />
    <InteractiveGreeting3 />
    <FareCal colour="lightblue"/>
  </div>
)
