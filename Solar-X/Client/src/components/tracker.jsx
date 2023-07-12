import { useState, useContext } from "react";

import context from "../contexts/context.js";
import pvAreaContext from "../contexts/area.js";
import { useEffect } from "react";
import axios from "axios";

function ReturnErrorRow(){
    return(
        <tr>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
    )
}

function ReturnRow(props){
    var index = props.index;
    var solarposData = props.solarposData;
    var pvArea = props.pvArea;
    return(
        <tr>
            <td>{props.time}</td>
            <td>{(solarposData[index].elevation).toFixed(5)}</td>
            <td>{(solarposData[index].azimuth).toFixed(5)}</td>
            <td>{(props.global*pvArea).toFixed(2)}</td>
            <td>{(props.direct*pvArea).toFixed(2)}</td>
            <td>{(props.diffuse*pvArea).toFixed(2)}</td>
        </tr>
    )
}

const PerformaceTracker = () => {
    const {data} = useContext(context);
    const {pvArea} = useContext(pvAreaContext);

    const [solarposData, irradianceData, totalIrradiance] = data;
    // console.log([solarposData, irradianceData, totalIrradiance])

    const [elevation, setElevation] = useState(0)
    const [azimuth, setAzimuth] = useState(0)
   

    useEffect(() => {
        const interval = setInterval(() => {
            async function fetchData(){
                try{
                    const res = await axios({
                        method: 'get',
                        url: 'http://127.0.0.1:8000/solarPos?latitude=27.68&longitude=85.37&parHour=-1&parMin=-1',
                        headers: { }
                    })
    
                    const resData = await res.data;
                    setElevation(resData.elevation)
                    setAzimuth(resData.azimuth)
                } catch (error){
                    console.log(error)
                }
            }
            fetchData();
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);

    return(
        <>
        <div className="PV_performaceTracker">
            <div className="item">
                <h2 className="title">Your PV Output Summary</h2>
            </div>

            <div className="hoverBoards">
                <div className="item">
                    <div className="title">Current Sun Position</div>
                    <div className="data">
                        <div>
                            <span>Elevation: </span>
                            <span className="sun_elevation">{
                                elevation == "dark" ? "dark"
                                : elevation.toFixed(4)
                            }°</span>
                        </div>
                        <div>
                            <span>Azimuth: </span>
                            <span className="sun_azimuth">{
                                azimuth == "dark" ? "dark"
                                : (azimuth <= 0 && azimuth >= -180) ? (0 - (180 - (360 + azimuth))).toFixed(4) : ""
                                }
                            °</span>
                        </div>
                    </div>
                </div>

                <div className="item">
                    <div className="title">Solar Irradiance Data</div>
                    <div className="data">
                        <div>
                            <span>Direct: </span>
                            <span className="irradiance_direct">{
                                totalIrradiance == undefined ? ""
                                : ((totalIrradiance[0].Direct*pvArea)/1000).toFixed(2)
                            } kW</span>
                        </div>
                        <div>
                            <span>Diffuse: </span>
                            <span className="irradiance_diffused">{
                                totalIrradiance == undefined ? ""
                                : ((totalIrradiance[0].Diffuse*pvArea)/1000).toFixed(2)} kW</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="item table">
                <table>
                    <thead>
                        <th>Time</th>
                        <th>Elevation [°]</th>
                        <th>Azimuth [°]</th>
                        <th>Global [W/m2]</th>
                        <th>Direct [W/m2]</th>
                        <th>Diffuse [W/m2]</th>
                    </thead>
                    <tbody>
                        {
                            irradianceData == undefined ? <ReturnErrorRow></ReturnErrorRow>
                            : (irradianceData.map((value, index) => {
                                    return <ReturnRow index={index} pvArea={pvArea} solarposData={solarposData} time={value.time} global={value["G(i)"]} direct={value["Gb(i)"]} diffuse={value["Gd(i)"]}></ReturnRow>
                                }))
                        }
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}

export default PerformaceTracker