import axios from "axios";
import { useState, useContext } from "react"

import context from "../contexts/context.js";
import peakPowerContext from "../contexts/peakPower.js";
import systLossContext from "../contexts/systLoss.js";
import pvAreaContext from "../contexts/area.js";

const ProvidedInputs = () => {
    const {setData} = useContext(context);
    const {setPeakPower} = useContext(peakPowerContext);
    const {setSystemLoss} = useContext(systLossContext);
    const {setAreaContext} = useContext(pvAreaContext);

   const [lat, setLat] = useState(27.68);
   const [long, setLong] = useState(85.37);
   const [PVpower, setPVpower] = useState(0.75);
   const [systLoss, setSystLoss] = useState(14);
   const [area, setArea] = useState(1);


   const handleSubmit = async (event) => {
        await event.preventDefault();

        setPeakPower(PVpower);
        setSystemLoss(systLoss);
        setAreaContext(area);

        const res = await axios({
            method: 'get',
            url: `http://127.0.0.1:8080/data?lat=${lat}&long=${long}`,
            headers: { }
        });

        // console.log(await res.data)

        var [solarposData, irradianceData, totalIrradiance] = await res.data;
        await setData([solarposData, irradianceData, totalIrradiance]);
   }

   return(
    <>
    <form onSubmit={handleSubmit}>
        <div className="providedInputs">
            <div className="item">
                <h3 className="title">Provided Inputs:</h3>
            </div>
            <div className="location">
                <div className="latitude item">
                    <span>Latitude: </span>
                    <span>
                        <input 
                        type="number" 
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className="user_laititude" 
                        placeholder="Laititude"/>
                    </span>
                </div>
                <div className="longitude item">
                    <span>Longitude: </span>
                    <span>
                        <input type="number" 
                        value={long}
                        onChange={(e) => setLong(e.target.value)}
                        className="user_longitude" 
                        placeholder="Longitude"/>
                    </span>
                </div>
            </div>

            <div className="database item">
                <span>Database used: </span>
                <span>PVGIS-ERA5</span>
            </div>

            <div className="aboutPV">
                <div className="item">
                    <span>Solar Panel's Area [m2] </span>
                    <span>
                        <input 
                        type="number" 
                        value={area} 
                        onChange={
                            async (e) => {
                                setArea(e.target.value)
                                setPVpower(e.target.value*0.15);
                            }
                        }
                        className="PV_Area" />
                    </span>
                </div>

                <div className="item">
                    <span>Peak PV Power [kWp]: </span>
                    <span>
                        <input 
                        type="number" 
                        value={PVpower.toFixed(2)}
                        disabled={true}
                        className="peak_PV_power" />
                    </span>
                </div>

                <div className="item">
                    <span>System Loss  %: </span>
                    <span>
                        <input 
                        type="number" 
                        value={systLoss} 
                        onChange={(e) => setSystLoss(e.target.value)}
                        className="PV_system_loss" />
                    </span>
                </div>
            </div>

            <div>
                <button 
                type="submit" 
                className="submit_input">Calculate</button>
            </div>
        </div>
    </form>
    </>
   )
}

export default ProvidedInputs