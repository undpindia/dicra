
# Does the license of libraries/dependencies undermine the openness of the project?

DiCRA platform is transferable to any cloud service provider or data center, it has no mandatory dependencies. Rebuilding of code will not be required in case it is moved from the current hosting provider to any other hosting provider. DiCRA has no dependencies in terms of use of software also as it is being developed using  open source technologies only.

All the major tools and libraries used for developing DiCRA are under open source license. So DiCRA has no hard dependencies in terms of use of software as it is being developed using open source technologies.

The following soft dependencies exist which are easily configurable for developers to switch to an open alternative. 

#### - DiCRA platform requires the functionality to allow policy-makers to search for a village or locality to perform analysis on climate and agriculture indicators. This requires an API which allows for geocoding (process of converting address in text format to geocordinates). 

![image](https://user-images.githubusercontent.com/42402451/174806830-5f85df66-344a-472a-a302-6ce3f0239b17.png)

We explored the use of (open option) [OSM Geocoder - Nominatim](https://nominatim.org) for this but found that the [spatial accuracy and match rate](https://towardsdatascience.com/comparison-of-geocoding-services-applied-to-stroke-care-facilities-in-vietnam-with-python-ff0ba753a590) is low for our preliminary area of interest which was Telangana. Hence we used [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview) for this use case. In case the developer wishes to deploy the application without using this API, the codebase includes the following module which uses Nominatim instead of Google API.

![image](https://user-images.githubusercontent.com/42402451/174806420-a20af85f-6c73-4289-8d5b-6b2b7841d557.png)

#### - Based on our visual identity and user experience discussions, we have used the [CARTO basemap public styles](https://github.com/CartoDB/basemap-styles#readme) as the basemap for our map views. Even though it provides a BSD 3-Clause License for the code and CC-BY 4.0 for the design, it do have the following limitations.
1. free usage for up to 75,000 mapviews per month
2. none-commercial services only

![image](https://user-images.githubusercontent.com/42402451/174807087-0abc4891-8f23-4f19-9bec-6a9f653f6c22.png)

This service do not need to enable an API or an account to set up the basemap. If the dark theme is not required, the developer can use alternatives quite easily by updating the code base using the modules we have made configurable such as [Open Map Tiles](https://openmaptiles.org)

![image](https://user-images.githubusercontent.com/42402451/174832037-2efda74c-a5cd-4230-9082-46beded85f8a.png)

#### - DiCRA also includes a Satellite View which uses the Google Basemap which requires an account registration as well as setting up of API. But the codebase also includes an option to reconfigure it to use USGS or ESRI Basemaps instead of Google service.

![image](https://user-images.githubusercontent.com/42402451/174832426-68ed8645-0291-4c3a-be95-e7eceb001bb0.png)


