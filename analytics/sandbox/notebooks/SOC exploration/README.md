# Soil Organic Carbon

Soil organic carbon (SOC) refers only to the carbon component of organic compounds.<br>
Sequestering carbon in SOC has been suggested as one way to mitigate climate change by reducing atmospheric carbon dioxide.<br>
The argument is that small increases of SOC over very large areas in agricultural and pastoral lands will significantly reduce atmospheric carbon dioxide.<br>
SOC is crucial to soil health, fertility and ecosystem services, including food production – making its preservation and restoration essential for sustainable development.<br><br>


## Download data:
SOC data can be downloaded using script "SOC_Download.ipynb"

## Types of Soil Organic Carbon data

### Products:
Soil Organic Carbon Content (dg/kg)<br>
Soil Organic Carbon Density (g/dm3)<br>
Soil Organic Carbon stock (tonnes/ha)<br>
<br>
### Depths:
0-5cm<br>
5-15cm<br>
15-30cm<br>
30-60cm<br>
60-100cm<br>
100-200cm<br>
<br>

## Issue!
The Soil Organic Carbon (SOC) stocks in SoilGrids 2020 were obtained with a calculate first interpolate later approach. The SOC stocks in SoilGrids version 2017 were obtained with a interpolate first calculate later approach, where the stocks were calculated from the maps of the input properties. So instead of having data of different years, soilgrids are "improved" product from 2017 to 2020. <br><br>

## Soil Organic Carbon Driving Factors

Terrain Factor: levation, slope gradient slope position, slope direction, rock coverage, soil thickness<br>
Soil physical index : Gavel content, soil bulk density soil water content<br>
Soil chemical index: Total N, total P, total K, effective P, quick available K, soil C/N, soil pH<br>
Applying organic fertilizer, Applying Nitrogenous fertilizer, Applying phosphate fertilizer Applying potash fertilizer <br>
stubble, straw returning, Straw yield<br>

## Deviance Map

INPUTS: DEM, Bulk Density, Clay content and  NDVI <br>
OUTPUT: Soil Organic Carbon (SOC) Content<br>
Linear Regression Model: score =0.59<br>
Normalized value for difference in True and Predicted SOC<br>
Range -1  to 1 showing negative to positive deviance<br>
![Positive and Negative Deviances](download.png)


## Details of Soil Products that has been used in this analysis

### Soil Organic Carbon Content
Unit: dg/kg
Raster Available: YES <br>
Vector available: YES <br>
Vector type: Polygon    <br>
Multiple layers: NO <br>
### Bulk Density
Unit: cg/cm3
Raster Available: YES <br>
Vector available: YES <br>
Vector type: Polygon     <br>
Multiple layers: NO <br>
### Clay content
Unit: g/kg
Raster Available: YES <br>
Vector available: YES <br>
Vector type: Polygon     <br>
Multiple layers: NO <br>
<br>

## References

He G, Zhang Z, Zhang J, Huang X. Soil Organic Carbon Dynamics and Driving Factors in Typical Cultivated Land on the Karst Plateau. Int J Environ Res Public Health. 2020 Aug 6;17(16):5697. doi: 10.3390/ijerph17165697. PMID: 32781763; PMCID: PMC7459649.<br>
Hengl T, Mendes de Jesus J, Heuvelink GB, Ruiperez Gonzalez M, Kilibarda M, Blagotić A, Shangguan W, Wright MN, Geng X, Bauer-Marschallinger B, Guevara MA, Vargas R, MacMillan RA, Batjes NH, Leenaars JG, Ribeiro E, Wheeler I, Mantel S, Kempen B. SoilGrids250m: Global gridded soil information based on machine learning. PLoS One. 2017 Feb 16;12(2):e0169748. doi: 10.1371/journal.pone.0169748. PMID: 28207752; PMCID: PMC5313206.<br>
Albanna, Basma & Heeks, Richard & Pawelke, Andreas & Boy, Jeremy & Handl, Julia & Gluecker, Andreas. (2021). Data-powered positive deviance: Combining traditional and non-traditional data to identify and characterise development-related outperformers. Development Engineering. 7. 100090. 10.1016/j.deveng.2021.100090.<br>
Identifying Safe(r) Public Spaces for Women in Mexico City | by Data Powered Positive Deviance DPPD | Medium. https://dppd.medium.com/identifying-safe-r-public-spaces-for-women-in-mexico-city-4f3d49d269d6. Accessed: 2022-07-18<br>






