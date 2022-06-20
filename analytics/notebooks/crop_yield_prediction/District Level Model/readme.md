## Folder Introduction
The files in this folder are related to analysis of historical crop yields and predictions (for missing data) on district level. First, the focus is on building a crop yield prediction model that determines the crop yield for Maize per district. Note that Maize is mainly harvested in the Kharif season. 

Once we achieve the aim of this folder, we select two district; the district which performs best in terms of crop yield (positive deviance) and the district which performs worst in terms of crop yield (negative deviance). Then, we aim to investigate these districts on mandal level. Again, we select a few of these mandals based on their deviances regarding crop yield. For these selected mandals, field data can be collected, e.g. interviews and farm boundaries. 

Next, based on the satellite data and the derived ground truth data for these mandals, we predict crop yield on field level. Now, further research can be done to identify why some of these farms are doing exceptionally well compared to other farms. This is essential in proposing effective agricultural interventions to the policy makers.

## Data Sources 
We derive the historical data on district level from the [Directorate of Economics and Statistics](https://desagri.gov.in/document-report-category/selected-zone-tehsil-district-block-year-wise/#).

The data ranges from 1997-1998 up to 2019-2020, but we would like to emphasize that for most of the districts data is available in a smaller range. Also, note that there are no crop yield predictions for the district Hyderabad. As this district mainly consists of building area, we assume no Maize is harvested here. Furthermore, the district Hanamkonda is formerly known as Warangal Urban.

Other variables/factors which we think are of interest regarding crop yield are listed below together with their data source:
- [Leaf Area Index](https://land.copernicus.eu/global/products/lai) (2014-2022)
- [Normalized Difference Vegetation Index](https://dicra.undp.org.in/) (2016-2022)
- [Land Surface Temperature](https://land.copernicus.eu/global/products/lst) (2010-2022)
- [Rainfall](https://data.telangana.gov.in/search/field_tags/rainfall-384)
- [Irrigation](https://developers.google.com/earth-engine/datasets/catalog/USGS_GFSAD1000_V1?hl=en#bands)
- [Soil Type](To be added later)
- [Soil Moisture](https://dicra.undp.org.in/)
- [Crop Disease](To be added later)
- [Land Cover](https://dicra.undp.org.in/) (2017-2021)

## Extension on Data Sources for field level
- [Farmers' Field Boundaries]()
- [Crop Type]()