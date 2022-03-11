# UNDP Geospatial Data Science Internship Assessment

## Background
UNDP has partnered with the Government of Telangana to jointly initiate the NextGenGov ‘Data for Policy’ initiative on Food Systems. The aim is to incorporate anticipatory governance models for future-fit food systems in Telangana using data-driven policymaking tools and ecosystem-driven approaches. UNDP is keen on augmenting learning capabilities, increasing the predictive or anticipatory capacity to feed into evidence-driven policies in the state, and create r radical traceability and transparency across the system from producers to consumers by building provenance documentation around food that can help build trust in the system at the same time nurture sustainable and healthy practices. The goal is to design, develop and demonstrate anticipatory governance models for food systems in Telangana using digital public goods and community-centric approaches to strengthen data-driven policymaking in the state.
The DiCRA platform is envisioned as a Digital Public Good that will strategically feed into data-driven decision-making in the state. The platform will have the capability to visualize and analyze high-resolution geospatial data (both vector as well as raster layers). The digital platform will curate, integrate and visualize such critical datasets and assets to answer the basic question of - What is growing where? How much is there and the spatial and temporal changes within the state across various indicators relevant to Agriculture and Food Systems? The platform should be able to visualize over time the changes that have happened to the agriculture ecosystem in terms of crop diversity, changes in soil/groundwater, tree cover, and other indicators at a higher resolution to support policy decisions. Such a synthesis of data and analytics can help identify farms that are doing exceptionally well (Positive Deviance) through which repositories of good practices and indigenous knowledge can be documented. This also helps in identifying farms that are not doing good as per the defined indicators (Negative Deviance).

## Crop Residue Burning in India
An Indian Agricultural Research Institute study estimates that in 2008-09, the particulate released by crop residue burning is more than 17 times the total annual particulate pollution in Delhi from all sources—vehicles, industries, garbage burning, etc. Similarly, the total national annual emission for CO2 from crop residue burning is more than 64 times the total annual CO2 pollution emission in Delhi. India is the second-largest producer of rice worldwide. Paddy and wheat cropping are a widespread farming practice in northwestern parts of India; however, the burning of paddy and wheat straw and stubble by farmers after the harvesting season is quite common.

Currently DiCRA Platform is focusing on **Telangana**, and hence for the assessment you will be provided with datasets pertaining to Telangana.

## DATA

**(1) NASA Fire Information for Resource Management Systems**

- Data Information

MODIS standard quality Thermal Anomalies / Fire locations processed by the University of Maryland with a 3-month lag and distributed by FIRMS. These standard data (MCD14ML) replace the NRT (MCD14DL) files when available.
Data is available from 01-01-2015 until 31-08-2021 (downloaded on Jan 28, 2022)

For more details please visit - [NASA FIRMS MODIS or VIIRS Fire/Hotspot Data Download](https://firms.modaps.eosdis.nasa.gov/download/Readme.txt)

- Data Citation and Disclaimer

NASA promotes the full and open sharing of all data with the research and applications
communities, private industry, academia, and the general public. Read the NASA Data and
Information Policy. 

- Citation
See: https://earthdata.nasa.gov/earth-observation-data/near-real-time/citation#ed-firms-citation 

**(2) ESRI have made available a ten class global land use/land cover (LULC) map for the year 2020 at 10 meter resolution available at this [link](https://www.arcgis.com/home/item.html?id=d6642f8a4f6d4685a24ae2dc0c73d4ac).**

## TASKS

We have created a subset of the Fires Dataset and extracted it only for Telangana using the shapefile downloaded from [GADM](https://gadm.org). Please see the visualization of the dataset [here](https://public.flourish.studio/visualisation/8561801/). The data is provided to you as a CSV file (telangana_fires.csv) in the Datasets folder.

### TASK - 1

In this task, we want you to provide a JSON output which summarised the number of fires per administrative boundary per year in Telangana. The json output should include the following keys - adm_name, year, fireCount. Please use the same key names, and the boundary names as available from **[GADM Level 3](https://gadm.org)**

**Expected Deliverable - Code (TASK1.ipynb) + JSON File Output (output1.json)**

### TASK - 2

NASA Fire Information dataset includes categories of fires that are not a result of agricultural practices as well. But for our analysis, we want to create a subset of this which gives the class of the fire as 1 if classified as caused by agricultural practices or 0 if not. The task for you is to use the ESRI LULC Map to propose a methodology and implementation for creating this subset. **As this is an unsupervised model, we will not specificially be testing your code for evaluation metrics but on your approach and implementation. The coding needs to be in PYTHON ONLY.**

The output of this task should be in a JSON format and should include the following keys - fireID, class (1,0)

Along with this implementation, we want you to create a **short medium blog post** (maximum 600 words - include plots/any other visualizations if you have them) on your analysis, methodology, results, and conclusions from this exercise. If you are new to Medium, please use this resource to know [how to write your first blog post](https://help.medium.com/hc/en-us/articles/225168768-Writing-and-publishing-your-first-story)

**Expected Deliverable - Code (TASK2.ipynb) + JSON File Output  (output2.json) + Medium Blog Draft/Published Link**

### How to submit your deliverables to our GitHub Repository [PLEASE FOLLOW ALL THE STEPS DILIGENTLY. THIS IS MOST IMPORTANT TO EVALUATE YOUR SUBMISSION]

- Fork the project Data4Policy & clone locally.
- Create an upstream remote and sync your local copy before you branch.
- **Create a folder with name in the same template as follows - FirstnameLastname** inside the folder **Geospatial Data Science Internship**. 
- Do the work **ONLY** within your folder and make sure that you write good commit messages.
- **Include an md file with the link to your medium blog post.**
- Push to the origin repository.
- Create a new Pull Request in GitHub.

## The Pull Request has to be submitted before the DEADLINE - March 13th SUNDAY (11:59 PM EST)

Check out this link for detailed information on [How to Contribute to a GitHub Project](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/)

## References

- [Stubble burning in Northern India](https://earthobservatory.nasa.gov/images/84680/stubble-burning-in-northern-india)
- [Active Fire Data - NASA | LANCE | FIRMS](https://firms.modaps.eosdis.nasa.gov/active_fire/)
- [NASA Firms Data Download](https://firms.modaps.eosdis.nasa.gov/download/Readme.txt)
- [Data4Policy Github Repository](https://github.com/UNDP-India/Data4Policy/tree/main/References)
- [NASA Fires Visualization for Telangana](https://public.flourish.studio/visualisation/8561801/)
- [Visualizing Climate and Loss: Crop Residue Burning in India](https://histecon.fas.harvard.edu/climate-loss/crops/index.html)
- [Esri 2020 Land Cover - Overview](https://www.arcgis.com/home/item.html?id=d6642f8a4f6d4685a24ae2dc0c73d4ac)
