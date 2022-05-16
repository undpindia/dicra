## Problem Description

Currently, crop residue burning is frequently taking place in India as farmers often rotate between crops in the harvesting season (May - September & November - April) and want a quick way to prepare the fields for the next crop in a cheap manner.

However, crop residue burning causes climate change and deterioration of the air quality leading to health issues among the population of India.

Main Challenge: How can policy makers decrease the amount of crop residue fires to protect the environment and human health while also considering (economically vulnerable) farmers.

- How can we identify farming communities that are over time reducing the impact on the environment and health by curbing crop residue burning?
- Can non-traditional data sources help in identifying what they are doing or what changes have happened in their economic or social situation compared to communities that are still practicing crop/stubble burning?
- Identify datasets that can help quantify the practice of crop burning among rice farmers in India? This also calls for identifying areas under rice, cropping patterns, air quality indicators, etc.
- Identify positive deviant rice farms in India practicing Climate Smart Agriculture using non-traditional data sources such as mobile phone records, satellite imagery, social media, online data, or financial data.
- Identify changes in socio-economic or policy aspects in regions that are showing positive deviance.
- Diversifying crops, using crop residue for alternate purposes, in-situ management of crop residue, policy measures, etc. are recommended by officials to reduce crop burning. Can data sources help identify such practices and adaptations by communities?

## Approach:

1) Overview of all available data
2) Literature Research about Positive Deviance Modelling 
3) Identify datasets that can quantify the practice of crop burning (areas under rice, cropping patterns, air quality indicators)
4) Identify factors in socio-economic or policy aspects regarding positive deviance
5) Literature Research crop residue alternative purposes & their impact
6) Modeling Positive Deviance 

## Available Data
- Normalized Difference Vegetation Index = NDVI quantifies vegetation by measuring the difference between nearinfrared (which vegetation strongly reflects) and red light (which vegetation absorbs)
- Relative Wealth Index =  The Relative Wealth Index predicts the relative standard of living within countries using privacy protecting connectivity data, satellite imagery, and other novel data sources:
    - ind_pak_relative_wealth_index.csv (Attributes: latitude, longitude, <strong>rwi</strong>, <strong>error</strong>)
    - gadm40_IND_shp files = Shape files of India at the three diffent layers. 
    - rwi_average.xlsx = Shows rwi averages of India (Attributes: NAME_2, NAME_1, rwi_average, population_count_wp, weighted)
    - rwi_median.xlsx = Shows rwi median of India (Attributes: NAME_2, NAME_1, rwi_median, population_count_wp, weighted)
- Population = WorldPop produces different gridded population layers:
    - population_deviance.ipynb: Shows change in population over time as raster file at a resolution of 1 km and Population Counts for any selected administraive boundary at Level 1(State), 2(District),or 3(taluk).
- Sentinel-2 10m Land Use/Land Cover Timeseries = Displays a global map of land use.
- Daily Prices of Market Yard Commodities in Telangana = This dataset contains information on the daily prices of all the commodities across all the market yards in the state of Telangana: 
    - list_market_yards_2021.xlsx
    - day_prices_between_01-12-2021_31-12-2021.csv
    - market_yard_data.csv
    - market_yard_list.xlsx
    - market_yard_prices_01012019_26062019.csv
- Soil Moisture
- Active Fire Data:
    - telangana_fires.csv (Attributes: fireID, latitude, longitude, <strong>brightness</strong>, <strong>scan</strong>, <strong>track</strong>, acq_date, <strong>acq_time</strong>, <strong>satellite</strong>, instrument, <strong>confidence<strong>, <strong>version</strong>, <strong>bright_t31</strong>, frp (Fire Radiative Power in Watt), daynight, <strong>type </strong>)
- Telangana Weather Data =  This dataset provides information about the cumulative rainfall, minimum & maximum temperature, humidity & wind speed across all 589 weatherstations in the state of Telangana.
- Telangana Warehouses Geolocation Data = This dataset contains information about the details of individual warehouses maintained by the State with geo-locations, names, their address, type, capacities and other related information:
    - ts-warehouse-data_march2022.csv (Attributes: s. no, region, wh type, warehouse, district, capacity, occupancy, vacancy, latitude, longitude, address, status)
- Shape of Telangana: 
    - telangana_shapefile.geojson
