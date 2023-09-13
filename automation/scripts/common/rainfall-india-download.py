import requests
import os 
from datetime import datetime, timedelta


## A function has been created to download real-time temperature-min or max and rainfall data from IMD 

def download(variable):   #variables can be
                                        # "rain"- rainfall

    
    if variable == 'rain':        #In case of rainfall data, little file naming differs from temperature data
        
        with open(variable+'/'+'rain.ctl', 'r') as f:   #Open rainfall .ctl file
            data = f.read()

        date = datetime.today() - timedelta(days=1)       #Get the date
        #Create file names as per given in IMD data storage
        grdfile = 'rain_ind0.25_'+date.strftime('%y_%m_%d')+'.grd'    
        ncfile = 'rain_ind0.25_'+date.strftime('%y_%m_%d')+'.nc'
        ctlfile = 'rain_ind0.25_'+date.strftime('%y_%m_%d')+'.ctl'

        #REST ALL STEPS ARE SAME AS PREVIOUS VARIABLES WITH FEW CHANGES IN NAMING OF RAIN VARIABLE
        dateval = date.strftime('%d%b%Y').upper()        

        data = data.replace("rain_ind0.grd", grdfile )
        data = data.replace("01JUN2006", dateval )
        print(data)

        with open(variable+'/'+ctlfile, 'w') as f:
            f.write(data)
            f.close()
        url = 'https://imdpune.gov.in/cmpg/Realtimedata/Rainfall/'+grdfile

        r = requests.get(url, allow_redirects=True)
        with open (variable+'/'+grdfile, "wb") as outfile:
            outfile.write(r.content)
        outfile.close()

        cmd = 'cd '+variable+' ; cdo -f nc import_binary '+ctlfile+' '+ncfile
        #cd rain ; cdo -f nc import_binary rain_ind0.25_22_11_08.ctl rain_ind0.25_22_11_08.nc
        print(cmd)
        os.system(cmd)

    else:  #IF VARIABLE NOT FROM MIN OR MAX OR RAIN
        print("wrong input variable!") 

#Date as user input can also be added in above function

#EXAMPLE:
download('rain')