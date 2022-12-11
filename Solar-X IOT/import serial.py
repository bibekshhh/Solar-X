import serial
import time

serialcomm = serial.Serial('com5',9600)
serialcomm.timeout = 3

while True:
    for i in range(180):
        elev = str(i) + ';'
        ax = str(i*2) + ';'
        serialcomm.write(elev.encode())
        print(elev)
        serialcomm.write(ax.encode())
        print(ax)
        time.sleep(5)
        print(serialcomm.readline().decode('ascii'))

serialcomm.close()
