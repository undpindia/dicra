
# Does the license of libraries/dependencies undermine the openness of the project?

DiCRA platform is transferable to any cloud service provider or data center, it has no mandatory dependencies. Rebuilding of code will not be required in case it is moved from the current hosting provider to any other hosting provider. DiCRA has no dependencies in terms of use of software also as it is being developed using  open source technologies only.

All the major tools and libraries used for developing DiCRA are under open source license. So DiCRA has no hard dependencies in terms of use of software as it is being developed using open source technologies.

The following soft dependencies exist which are easily configurable for developers to switch to an open alternative. 

- DiCRA platform requires the functionality to allow policy-makers to search for a village or locality to perform analysis on climate and agriculture indicators. This requires an API which allows for geocoding (process of converting address in text format to geocordinates). We explored the use of (open option) [OSM Geocoder - Nominatim](https://nominatim.org) for this but found that the [spatial accuracy and match rate](https://towardsdatascience.com/comparison-of-geocoding-services-applied-to-stroke-care-facilities-in-vietnam-with-python-ff0ba753a590) is low for our preliminary area of interest which was Telangana. Hence we used [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview) for this use case. In case the developer wishes to deploy the application without using this API, the codebase includes the following module which uses Nominatim instead of Google API.

- Based on our visual identity and User Experience discussions, we have used the [CARTO basemap public styles](https://github.com/CartoDB/basemap-styles#readme) as the basemap for our map views. Even though it provides a BSD 3-Clause License for the code and CC-BY 4.0 for the design, it do have the following limitations.
1. free usage for up to 75,000 mapviews per month
2. none-commercial services only
This service do not need to enable an API or an account to set up the basemap. In case for the visual identity the dark theme is not required, the developer can use 

For the basemaps, we use the following sources
- [CARTO Basemap styles for web and mobile](https://leaflet-extras.github.io/leaflet-providers/preview/#filter=CartoDB.DarkMatter)
- [Google Maps Platform](https://developers.google.com/maps)

Even though they are available for free and non-commercial use, they do come with limitations on the maximum number of available calls. 
The Open Source alternatives for this are:
- [Open-source maps made for self-hosting Free OpenStreetMap Vector Tile](https://openmaptiles.org)
- [Carto Basemap styles](https://github.com/CartoDB/basemap-styles)
