This folder describes how we preprocess all yield data and boundary data we have for the state Karnataka, India.

In 'yields_format.ipynb', we merge all crop yield data provided as csv files given per district per year per season. Since the layout of the files is not completely similar, we should make sure they match eventually.

Then, in 'yields_geometry.ipynb', for each insurance unit within the crop yield dataset, we check whether we can find a very good match within the boundary data in order to specify the geometry of the insurance unit. Since there are differences in spellings/labelings between both files, we do not find a match for each insurance unit within the crop yield dataset.

Next, we move to 'aggregation_rf.ipynb'. For some parameters, we aggregate images over time such that we have less nodata values for the following parameters: Leaf Area Index (LAI), Land Surface Temperature (LST), Normalized Difference Vegetation Index (NDVI) and Surface Soil Moisture (SSM). We aggregate the files in two different ways:
1. aggregation per year per season (summer, kharif, rabi)
2. aggregation per year per season per period (sow, between, harvest)

The schedule we use for growing season in India is shown below.

|Season |   Sow   | Between | Harvest |
|-------|---------|---------|---------|
|Summer | Feb-Mar |   Apr   | May-Jun |
|Kharif | Jun-Jul |   Aug   | Sept-Oct|
|Rabi   | Oct-Nov |   Dec   | Jan-Feb |

Lastly, in 'dataframe_rf.ipynb', we create a geodataframe including all information needed to run a model. For each of the previous specified parameters, we calculate the average per geometry within the combined yields_geometry geodataframe. For LST, we also calculate the maximum value per geometry. We make sure that each datapoint within the yields_geometry geodataframe includes the average parameter value for the correct year and season. Furthermore, we use aggregation method 2, so we have a parameter per period for each datapoint.  

Now, we can use the derived geodataframe as input data for a model.