# Temperature Anomalies 

A temperature anomaly is the departure, positive or negative, of a temperature from a base temperature that is normally chosen as an average of temperatures over a certain reference period or a long term average temperature. 
Agricultural production is vulnerable to climate change with temperature abnormalities being the most detrimental factor affecting crop growth. Given the crucial effect of temperature on the crop yields and agricultural practices, and so the livelihood of an area. It becomes crucial to measure temperature anomalies to understand the patterns and devise strategies accordingly. 

There are multiple updated and peer-reviewed surface temperature anomaly products available, notably produced by NASA/GISS (GISTEMP), National Oceanic and Atmospheric Administration (NOAA) National Centers for Environmental Information (NCEI) with the Merged Land-Ocean Surface Temperature Analysis, the HadCRUT, Japanese Meteorological Agency (JMA) and Berkeley Earth.
These analyses use considerably different methods for the calculation of historical global and regional mean time series but broadly agree on the trends and interannual variations in the global annual mean time series, though they differ at more regional scales as a function of data coverage and interpolation method.All of the most commonly cited surface temperature analyses split up the calculation of global anomaly fields into separate LSAT and SST anomaly analyses. These independent LSAT and SST analyses are combined into a total (LSAT and SST) global surface temperature index from which spatially averaged global and regional time series can be computed (note this is not strictly equal to the true surface air temperature anomaly; Cowtan et al., 2015). Likewise, the uncertainty analyses for the LSAT and SST are performed separately, then combined into total global uncertainty.


## Temperature Anomaly Calculation Methods

	
Best dataset available:
https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land-monthly-means?tab=form

Features of data: 
2m temperature 
Monthly average Temperature 1950-Present
Resolution: ~11.1 KMs

**METHODS:**

NASA CLIMATE:
A temperature anomaly is a calculation of how much colder or warmer a measured temperature is at a given weather station compared to an average value for that location and time, which is calculated over a 30-year reference period (1951-1980).
(The Raw Truth on Global Temperature Records – Climate Change: Vital Signs of the Planet)

INTERNATIONAL RESEARCH INSTITUTE FOR  CLIMATE AND SOCIETY:
An anomaly is the difference between an actual value and some long-term average value.
For example, if

X = actual value of average temperature for January, 1982 and
Xbar = long-term average temperature for January (an average over many years)
anom = anomaly value for January, 1982
then anom = X - Xbar
Source: (How are anomalies calculated?)

INTERNATIONAL GEE TIME-SERIES ANALYSIS

INBUILT FUNCTION GOOGLE EARTH ENGINE TO CALCULATE TEMPERATURE ANOMALIES 
Here, same ERA5 data will be present but from year 1981-Present
(Climatological Anomalies — wxee documentation)


JAPAN METEOROLOGICAL ASSOCIATION METHOD
The procedure for estimating the global mean temperature anomaly is outlined below.
1) An average is obtained for monthly-mean temperature anomalies against the 1991-2020 baseline over land in each 5° x 5° grid box worldwide.
2) An average is obtained for monthly mean sea surface temperature anomalies against the 1991-2020 baseline in each 5° x 5° grid box worldwide in which at least one in-situ observation exists.
3) An average is obtained for the values in 1) and 2) according to the land-to-ocean ratio for each grid box.
4) Monthly mean global temperature anomaly is obtained by averaging the anomalies of all the grid boxes weighted with the area of the grid box.
5) Annual and seasonal mean global temperature anomalies are obtained by averaging monthly-mean global temperature anomalies.
(https://web.archive.org/web/20220623113538/https://ds.data.jma.go.jp/tcc/tcc/products/gwp/temp/explanation.html)


Conclusion
All the methods can be compiled into the following steps:
Calculate 30/50 year monthly/annual averages of global temperature data.
Calculate the deviation of specific month/year from average value calculated. 
Create the temperature anomaly maps according to various levels of geographical boundaries such as district/ mandal.


## References 
https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018JD029522#jgrd55486-bib-0001
https://iopscience.iop.org/article/10.1088/1748-9326/ab154b
https://web.archive.org/web/20220623113538/https://ds.data.jma.go.jp/tcc/tcc/products/gwp/temp/explanation.html
https://wxee.readthedocs.io/en/latest/examples/climatology_anomaly.html
https://www.pnas.org/doi/10.1073/pnas.1701762114
https://en.wikipedia.org/wiki/Temperature_anomaly#:~:text=Temperature%20anomalies%20are%20a%20measure,rather%20than%20as%20absolute%20temperatures.
