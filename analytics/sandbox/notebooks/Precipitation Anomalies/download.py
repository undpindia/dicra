
import cdsapi

c = cdsapi.Client()

years = list(range(1950,2023))
years = [str(year) for year in years]

months = list(range(1,13))
months = [str(month) for month in months]
c.retrieve(
    'reanalysis-era5-land-monthly-means',
    {
        'product_type': 'monthly_averaged_reanalysis',
        'variable': 'total_precipitation',
        'year': years,
        'month': months,
        'time': '00:00',
        'format': 'netcdf',
    },
    'precipitation.nc')