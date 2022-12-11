import { useContext } from "react";

import context from "../contexts/context.js";
import peakPowerContext from "../contexts/peakPower.js";
import systLossContext from "../contexts/systLoss.js";
import pvAreaContext from "../contexts/area.js";

const SimulationOutput = () => {
    const {data} = useContext(context);
    const {peakPower} = useContext(peakPowerContext);
    const {systemLoss} = useContext(systLossContext);
    const {pvArea} = useContext(pvAreaContext);


    console.log(systemLoss)
    console.log(pvArea)

    const [solarposData, irradianceData, totalIrradiance] = data;
    console.log([solarposData, irradianceData, totalIrradiance])

    return(
        <>
        <div className="simulation-output">
            <div className="item">
                <h3 className="title">Simulation Output:</h3>
            </div>
            <div className="item">
                <span>Irradiance Received [W/m2]: </span>
                <span className="total_irradiance_received">{
                        (totalIrradiance == undefined ? 0 : parseFloat(totalIrradiance[0].Global*pvArea))
                    }</span>
            </div>

            <div className="lossCalculation">
                <div>Changes in Output due to:</div>
                <div className="item">
                    <span>Angle of incidence  [%]: </span>
                    <span>-1.31</span>
                </div>
                <div className="item">
                    <span>Spectral effects  [%]: </span>
                    <span>-0.45</span>
                </div>
                <div className="item">
                    <span>Temperature and low irradiance  [%]: </span>
                    <span>-8.33</span>
                </div>
                <div className="item">
                    <span>Total loss  [%]: </span>
                    <span className="total_loss">{(10.09 + systemLoss)}</span>
                </div>
            </div>

            <hr />

            <div className="item bold">
                <span>PV energy production [kWh]: </span>
                <span className="total_pv_energy_produced">
                    {
                        (totalIrradiance == undefined ? ""
                        : ((totalIrradiance[0].Global*pvArea)/1000 * (1 - ((10.09 + systemLoss)/100)) * peakPower).toFixed(2)        
                        )
                    }
                </span>
            </div>
        </div>
        </>
    )
}

export default SimulationOutput