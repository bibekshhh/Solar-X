import axios from 'axios';
import express from 'express';
import cors from 'cors';

var app = express()
app.use(cors())

app.get('/data', async(req, res) => {
    console.log('Helo bitch')
    const latitude = req.query.lat;
    const longitude = req.query.long;

    console.log(latitude, longitude)

    async function fetchData(lat, long, time) {
        try {
            const resPos = await axios({
                method: 'get',
                url: `http://127.0.0.1:8000/solarPos?latitude=${lat}&longitude=${long}&parHour=${time.substring(0,2)}&parMin=${time.substring(3,5)}`,
                headers: {}
            });

            const posData = await resPos.data;
            const [elevation, azimuth] = [posData.elevation, posData.azimuth]

            // console.log(time, azimuth, elevation)
            if (elevation == 'dark' && azimuth == 'dark') return null

            return { "time": time, "elevation": elevation, "azimuth": azimuth }

        } catch (err) {
            console.log(err)
        }
    }


    async function resPromise(lat, long, month) {

        const arrOfTime = ["00:30", "01:30", "02:30", "03:30", "04:30",
            "05:30", "06:30", "07:30", "08:30", "09:30",
            "10:30", "11:30", "12:30", "13:30", "14:30",
            "15:30", "16:30", "17:30", "18:30", "19:30",
            "20:30", "21:30", "22:30", "23:30"
        ];

        var SolarPosData = [];

        for (let i = 0; i < arrOfTime.length; i++) {
            var data = await fetchData(lat, long, arrOfTime[i]);
            SolarPosData.push(data)
        }

        const res = await Promise.all(SolarPosData)
        var irradianceData = [];
        var solarposData = []

        try {
            for (let i = 0; i < res.length; i++) {
                if (res[i] != null) {
                    solarposData.push(res[i])
                        // console.log(res[i])

                    if (res[i + 1] != null) {
                        var meanElevation = (res[i].elevation + res[i + 1].elevation) / 2;
                        var meanAzimuth = (res[i].azimuth + res[i + 1].azimuth) / 2;
                    }

                    const resIrradiance = await axios({
                        method: 'get',
                        url: `https://re.jrc.ec.europa.eu/api/v5_2/DRcalc?lat=${lat}&lon=${long}&raddatabase=PVGIS-ERA5&outputformat=json&browser=0&month=${month}&usehorizon=1&userhorizon=&localtime=1&js=1&global=1&angle=${meanElevation}&aspect=${meanAzimuth}`,
                        headers: {
                            'Cookie': 'cck1=%7B%22cm%22%3Atrue%2C%22all1st%22%3Atrue%2C%22closed%22%3Atrue%7D; jrc_cookie=!/x9/KmnLI0kNDb5CHgKqdN92BGozdH9KycFCunChMlJ/0nWw1JGAdgGBgRAnCnsG+peWia55fTuaLOU=; TS01316d01=01f4fc03dda1ee2fcf0ec577b354e04dc96fcd0ba02b3871be954eafe4badbdc04ddfe7cf61796dad8e598c464e54c548316eb7566'
                        },
                        Host: 're.jrc.ec.europa.eu',
                        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
                    });
                    const resIrradianceData = (await resIrradiance.data)["outputs"]["daily_profile"];

                    if (!resIrradianceData || !resIrradiance) return

                    for (let j = 0; j < resIrradianceData.length; j++) {
                        if (resIrradianceData[j].time == res[i].time) {
                            irradianceData.push(resIrradianceData[j]);
                        }
                    }
                }
            }
        } catch (error) {
            throw error
        }

        return [solarposData, irradianceData];
    };


    async function displayData(lat, long, month) {
        var [solarposData, irradianceData] = await resPromise(lat, long, month);

        var [global, direct, diffuse] = [0, 0, 0];

        for (let i = 0; i < irradianceData.length; i++) {
            var fetchedGlobalIrr = parseFloat(irradianceData[i]["G(i)"]);
            var fetchedDirectIrr = parseFloat(irradianceData[i]["Gb(i)"]);
            var fetchedDiffuseIrr = parseFloat(irradianceData[i]["Gd(i)"]);

            if ([fetchedGlobalIrr, fetchedDirectIrr, fetchedDiffuseIrr] != null || [fetchedGlobalIrr, fetchedDirectIrr, fetchedDiffuseIrr] != undefined) {
                global += fetchedGlobalIrr;
                direct += fetchedDirectIrr;
                diffuse += fetchedDiffuseIrr;
            }
        }

        return [
            solarposData,
            irradianceData, [{
                "Global": parseFloat(global.toFixed(2)),
                "Direct": parseFloat(direct.toFixed(2)),
                "Diffuse": parseFloat(diffuse.toFixed(2))
            }]
        ];
    }

    console.log(await displayData(latitude, longitude, 12))
    res.json(await displayData(latitude, longitude, 12));
    return await displayData(latitude, longitude, 12);
});

app.listen(8080, () => {
    console.log(`Listening on PORT: 8080`)
})