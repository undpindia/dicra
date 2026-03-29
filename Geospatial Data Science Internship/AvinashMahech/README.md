### Project is sumbmitted by Avinash Mahech

## Task1

Task 1 is related to count the number of fires was happend in whole year to each district region.

Data is provided by UNDP which is well created using usupervised model on MODIS satellites data.

The MODIS instrument data that used is MCD14DL which is helpful in detecting thermal and fire annomalies and its spatial resolution
is 1 km. There is confidence column in eacy and every lat and long which denotes probabilities of three classes based upontheir algorithm.
In my case I'd just put 45 threshold confidence chances of happening of fire in that location.

`Data Citation`
> DOI:10.5067/FIRMS/MODIS/MCD14DL.NRT.0061

## Task 2

Task 2 is comparing results of MODIS Active fire products with ESRI 2021 LULC 10m -resolution map in which there is total 11 classes. The classes were developed by ESRI and Microsoft joint venture where they trained millions of parameters on Deep Learning. I'd consider only class 5 which indicates crops by human production that helps to know about stuble burning issues in that region.

`Data Citation`
> Karra, Kontgis, et al. “Global land use/land cover with Sentinel-2 and deep learning.” IGARSS 2021-2021 IEEE International Geoscience and Remote Sensing Symposium. IEEE, 2021

Medium Post Link: https://medium.com/@avi007krishna/stuble-burnig-issue-in-telangana-state-e0d09fcc2d24