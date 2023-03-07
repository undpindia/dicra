import requests
import os 
from datetime import datetime, timedelta


## A function has been created to download real-time temperature-min or max and rainfall data from IMD 

def download(variable):   #variables can be
                                        # "rain"- rainfall
                                        # "min"- temperature minimum
                                        # "max" -  temperature maximum

    if variable == 'min' or variable == 'max':        #To download temperature data

        #Control File is .ctl extension file which has information about binary files like .grd 
        #Control File is essential to convert .grd file to .nc file

        with open(variable+'/'+variable+'.ctl', 'r') as f:   # read from given .ctl of particular variable (tmin or tmax)
            data = f.read()

        date = datetime.today() - timedelta(days=1)       #get the date in real-time 
                                                        # in this case, a day before sytem's dae has been taken

        grdfile = variable+date.strftime('%d%m%Y')+'.grd'   #creating file names from datetime format like min08112022.grd
        ncfile = variable+date.strftime('%d%m%Y')+'.nc'     #similar min08112022.nc
        ctlfile = variable+date.strftime('%d%m%Y')+'.ctl'   #similar min08112022.ctl

        dateval = date.strftime('%d%b%Y').upper()           #getting date in "01JAN2022" format

        data = data.replace("P:\TEMP.GRD", grdfile )        #replace temp directory from data read from temp.ctl file 
                                                            #of given variable with current date .grd file
        data = data.replace("1JAN1994", dateval )           #Similary, date has also been replaced
        print(data)                                         # Print data in control file to check

        with open(variable+'/'+ctlfile, 'w') as f:          #open an empty ctl file of given date and write
            f.write(data)
            f.close()

        url = 'https://imdpune.gov.in/cmpg/Realtimedata/'+variable+'/'+grdfile  #get grd file of given variable from url
        r = requests.get(url, allow_redirects=True)             #store data using requests libary
        with open (variable+'/'+grdfile, "wb") as outfile:      #open an empty grd file of name grdfile and write data to it
            outfile.write(r.content)                            #write downloaded content to this file 
        outfile.close()

#Before this step, install cdo in using "sudo apt install cdo"

        cmd = 'cd '+variable+' ; cdo -f nc import_binary '+ctlfile+' '+ncfile   
        print(cmd)
        #Get the command line to convert grd to netcdf
        #cd rain ; cdo -f nc import_binary min08112022.ctl min08112022.nc

        os.system(cmd)     #Run above bash command to convert


    else:  #IF VARIABLE NOT FROM MIN OR MAX OR RAIN
        print("wrong input variable!") 

#Date as user input can also be added in above function

#EXAMPLE:
download('min')
