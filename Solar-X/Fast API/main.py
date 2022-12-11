from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import math
import time

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def sunPosition(lat, long, parHour, parMin):

    # Latitude [rad]
    lat_rad = math.radians(lat)

    # Get Julian date - 2400000
    day = time.gmtime().tm_yday

    if (parHour == -1 or parMin==-1):
        hour = time.gmtime().tm_hour + \
           time.gmtime().tm_min/60.0 + \
           time.gmtime().tm_sec/3600.0
    else:
        hour = parHour - 5 + (parMin - 45)/60.0
        
    delta = time.gmtime().tm_year - 1949
    leap = delta / 4
    jd = 32916.5 + delta * 365 + leap + day + hour / 24

    # The input to the Atronomer's almanach is the difference between
    # the Julian date and JD 2451545.0 (noon, 1 January 2000)
    t = jd - 51545

    # Ecliptic coordinates

    # Mean longitude
    mnlong_deg = (280.460 + .9856474 * t) % 360

    # Mean anomaly
    mnanom_rad = math.radians((357.528 + .9856003 * t) % 360)

    # Ecliptic longitude and obliquity of ecliptic
    eclong = math.radians((mnlong_deg + 
                           1.915 * math.sin(mnanom_rad) + 
                           0.020 * math.sin(2 * mnanom_rad)
                          ) % 360)
    oblqec_rad = math.radians(23.439 - 0.0000004 * t)

    # Celestial coordinates
    # Right ascension and declination
    num = math.cos(oblqec_rad) * math.sin(eclong)
    den = math.cos(eclong)
    ra_rad = math.atan(num / den)
    if den < 0:
        ra_rad = ra_rad + math.pi
    elif num < 0:
        ra_rad = ra_rad + 2 * math.pi
    dec_rad = math.asin(math.sin(oblqec_rad) * math.sin(eclong))

    # Local coordinates
    # Greenwich mean sidereal time
    gmst = (6.697375 + .0657098242 * t + hour) % 24
    # Local mean sidereal time
    lmst = (gmst + long / 15) % 24
    lmst_rad = math.radians(15 * lmst)

    # Hour angle (rad)
    ha_rad = (lmst_rad - ra_rad) % (2 * math.pi)

    # Elevation
    el_rad = math.asin(
        math.sin(dec_rad) * math.sin(lat_rad) + \
        math.cos(dec_rad) * math.cos(lat_rad) * math.cos(ha_rad))

    # Azimuth
    az_rad = math.asin(
        - math.cos(dec_rad) * math.sin(ha_rad) / math.cos(el_rad))

    if (math.sin(dec_rad) - math.sin(el_rad) * math.sin(lat_rad) < 0):
        az_rad = math.pi - az_rad
    elif (math.sin(az_rad) < 0):
        az_rad += 2 * math.pi

    az = math.degrees(az_rad)
    print(az)
    if (az >= 0 and az <= 180):
        az = az = 0 - (180 - az)
    elif (az > 180 and az < 360 ):
        az = 180 - (360 - az)

    el = math.degrees(el_rad)
    if (el < 0):
        return {"elevation": "dark", "azimuth": "dark"}

    return {"elevation": math.degrees(el_rad), "azimuth": az}

@app.get("/solarPos")
async def returnPos(latitude: float = 27.68, longitude: float = 85.37, parHour: float=1, parMin: float=30):
    return sunPosition(latitude, longitude, parHour, parMin)
