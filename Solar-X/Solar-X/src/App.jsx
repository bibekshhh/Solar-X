import { useState } from 'react'
import reactLogo from './assets/react.svg'

//importing css and shit
import './styles/left.css'
import './styles/tracker.css'
import './styles/style.css'

//importing contexts
import context from "./contexts/context.js";
import peakPowerContext from "./contexts/peakPower.js";
import systLossContext from "./contexts/systLoss.js";
import pvAreaContext from "./contexts/area.js";

//importing components
import ProvidedInputs from './components/input.jsx'
import SimulationOutput from './components/simOutput.jsx'
import PerformaceTracker from './components/tracker.jsx'

function App() {

  const [data, setData] = useState([]);
  const [peakPower, setPeakPower] = useState(0);
  const [systemLoss, setSystemLoss] = useState(0);
  const [pvArea, setAreaContext] = useState(1)

  return (
    <context.Provider value={{data, setData}}>
      <peakPowerContext.Provider value={{peakPower, setPeakPower}}>
        <systLossContext.Provider value={{systemLoss, setSystemLoss}}>
          <pvAreaContext.Provider value={{pvArea, setAreaContext}}>
            <div className="container">
                <div className="wrapper">
                    <div className="main">
                        <div className="data-summary">
                            <ProvidedInputs />
                            <SimulationOutput />
                        </div>
                        <PerformaceTracker />
                    </div>
                </div>
            </div>
          </pvAreaContext.Provider>
        </systLossContext.Provider>
      </peakPowerContext.Provider>
    </context.Provider>
  )
}

export default App
