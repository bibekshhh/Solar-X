# Solar-X
Realtime Solar Position Tracker to track the Sun position for correct PV orientation i.e (azimuth &amp; elevation). A performance tracker based on PVGIS-ERA5 database of past 15 years of Solar Irradiance data for a specific latitude and longitude at a certain date.


## Run the app via following steps:

```
git clone https://github.com/bibekshhh/Solar-X.git
```
```
cd Solar-X
```

### Executing python file

```
cd "Fast API"
```

### Install python dependencies

```
pip install fastapi "uvicorn[standard]"
```

Run the main.py (FastAPI)
```
python -m uvicorn main:app --reload
```

### Run the web app

```
cd Solar-X
```

Installing node packages for parent directory
```
npm install
```

#### Move to child Solar-X/Solar-X directory
```
cd Solar-X/Solar-X/src
```

Installing node packages for child directory
```
npm install
```

```
node ./app.js
```

## At last, move to parent /Solar-X directory and 
```
npm run dev
```

You'll be assigned a localhost link in your CLI Terminal, redirecting to the application.
