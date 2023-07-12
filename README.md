# Solar-X
Realtime Solar Position Tracker to track the Sun position for correct PV (Photo Voltaic Cell or Solar Panel) orientation i.e (azimuth &amp; elevation). A performance tracker is implemented based on PVGIS-ERA5 database of past 15 years of Solar Irradiance data for a specific latitude and longitude at a certain time interval.


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

### Run the ExpressJS API Server

```
cd API
```

```
node server.js
```

#### Move to the Client directory
```
cd ../Client
```

Installing node packages for Client directory
```
npm install
```

## At last, move to parent /Solar-X directory 
```
cd ../
```

```
npm run dev
```

You'll be assigned a localhost link in your CLI Terminal, redirecting to the application.
