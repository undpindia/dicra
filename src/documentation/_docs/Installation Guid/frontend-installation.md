---
title:  Front End Installation
category: Installation Guid
order: 1
---

Operating System : Ubuntu

Technology : ReactJS

### Running Web App using Development Server

Steps:

1. Clone the github repo containing the frontend app `git clone https://github.com/undpindia/dicra.git`
2. Navigate to web_portal folder `cd dicra/src/web_portal`
3. Unzip package-lock.zip `unzip package-lock.zip`
4. Create .env file and add

        REACT_APP_APIEND= api_key

        // hosted_url= replace dicra api backend url

        REACT_APP_APIEND_RASTER= https://{hosted_url}/LAYER_DETAILS_ID/RASTER_TILE/raster_tile.tif

        REACT_APP_APIEND_VECTOR= https://{hosted_url}/LAYER_DESC_ID/VECTOR/CURRENT_BOUNDS/LTDATE.geojson

        REACT_APP_APIEND_DOWNLOADS= {api_key}/downloadfile?layerId=LAYER_ID&filename=FILE_NAME&name=USER_NAME&email=EMAIL_ID&usage_type=USAGE_TYPE purpose=PURPOSE

        REACT_APP_API_KEY = google_map_api_key
        // state_name= replace with telangana , uttarakhand , gujarat , jharkhand , kerala , maharashtra , odisha
       PUBLIC_URL=/state_name

5. Run the command `npm install` then it will install the required packages for running the application
6.  a) The state config information were added in cd dicra/src/web_porta/src/components/MapComponent/ExampleConfig/{configstatename}.js

    b) Copy the config of the state of your choice and paste it in config.js file located in cd dicra/src/web_porta/src/components/MapComponent/Config/config.js

    c) Now change in PUBLIC_URL key in the env file with the state name

7. To create the production build we need to run the command npm run build. After the successful execution of the command it will create a folder called build, it contain all the build files (this build corresponds to particular state_name that you have provided above, like wise if you want for other states change the env and repeat the build process again)

8. Upload all the build files to nginx website deployment location

9. Make changes to the web server configuration


### Running Web App Production Build In a web Server(Nginx)

Steps:

1. Clone the github repo containing the frontend app `git clone https://github.com/undpindia/dicra.git`
2. Navigate to web_portal folder `cd dicra/src/web_portal`
3. Unzip package-lock.zip `unzip package-lock.zip`
4. Create .env file and add
   
        REACT_APP_APIEND= api_key

        // hosted_url= replace dicra api backend url

        REACT_APP_APIEND_RASTER= https://{hosted_url}/LAYER_DETAILS_ID/RASTER_TILE/raster_tile.tif


        REACT_APP_APIEND_VECTOR= https://{hosted_url}/LAYER_DESC_ID/VECTOR/CURRENT_BOUNDS/LTDATE.geojson


        REACT_APP_APIEND_DOWNLOADS= {api_key}/downloadfile?layerId=LAYER_ID&filename=FILE_NAME&name=USER_NAME&email=EMAIL_ID&usage_type=USAGE_TYPE&purpose=PURPOSE

        REACT_APP_API_KEY = google_map_api_key

        // state_name= replace with telangana , uttarakhand , gujarat , jharkhand , kerala , maharashtra , odisha

        PUBLIC_URL=/state_name

5. Run the command npm install then it will install the required packages for running the application.

6.  a) The state config information were added in cd dicra/src/web_porta/src/components/MapComponent/ExampleConfig/{configstatename}.js

    b) Copy the config of the state of your choice and paste it in config.js file located in cd dicra/src/web_porta/src/components/MapComponent/Config/config.js

    c) Now change in PUBLIC_URL key in the env file with the state name

7. To create the production build we need to run the command npm run build. After the successful execution of the command it will create a folder called build, it contain all the build files (this build corresponds to particular state_name that you have provided above, like wise if you want for other states change the env and repeat the build process again)

8. Upload all the build files to nginx website deployment location

9. Make changes to the web server configuration


### Running Web App Production Build in Azure Blob
Steps:

1. Clone the github repo containing the frontend app `git clone https://github.com/undpindia/dicra.git`
2. Navigate to web_portal folder `cd dicra/src/web_portal`
3. Unzip package-lock.zip `unzip package-lock.zip`
4. Create .env file and add 

        REACT_APP_APIEND= api_key
        
        // hosted_url= replace dicra api backend url
        
        REACT_APP_APIEND_RASTER= https://{hosted_url}/LAYER_DETAILS_ID/RASTER_TILE/raster_tile.tif

        REACT_APP_APIEND_VECTOR= https://{hosted_url}/LAYER_DESC_ID/VECTOR/CURRENT_BOUNDS/LTDATE.geojson

        REACT_APP_APIEND_DOWNLOADS= {api_key}/downloadfile?layerId=LAYER_ID&filename=FILE_NAME&name=USER_NAME&email=EMAIL_ID&usage_type=USAGE_TYPE&purpose=PURPOSE

    
         REACT_APP_API_KEY = google_map_api_key
       
        // state_name= replace with telangana , uttarakhand , gujarat , jharkhand , kerala , maharashtra , odish
   
        PUBLIC_URL=/state name

5. Run the command npm install then it will install the required packages for running the application

6.  a) The state config information were added in cd dicra/src/web_porta/src/components/MapComponent/ExampleConfig/{configstatename}.js

    b) Copy the config of the state of your choice and paste it in config.js file located in cd dicra/src/web_porta/src/components/MapComponent/Config/config.js

    c) Now change in PUBLIC_URL key in the env file with the state name

7. To create the production build we need to run the command npm run build. After the successful execution of the command it will create a folder called build, it contain all the build files (this build corresponds to particular state_name that you have provided above, like wise if you want for other states change the env and repeat the build process again)

8. To deploy react production build in Azure we need to create a storage account in Azure

9. After the successful Deployment of the storage account Goto static website menu and enable static website option and fill index document name as index.html and leave error document path as empty (its optional). After saving this it will provide us a primary endpoint.

   Screenshot of the same is given below. We can use the primary endpoint to test our react production build, deployed in the storage account and same can be done after the completion of step 6.

10. After the completion of Static website enabling section it will create two containers called `$logs` & `$web`. And we need to upload the build files created in step 3 to `$web` container. We can upload Build files to $web container using multiple ways ie., Azure storage explorer, Visual studio extension Azure storage by Microsoft

    Steps followed to upload build files to `$web` using Azure storage are

     * Goto azure storage extension on visual studio code
     * Sign In using Azure credentials
     * Expand storage account we have created for web app deployment
     * Under the Blob Container menu we can able to see `$web` container, right click on that, choose option Deploy to static website via azure storage, browse the build folder and complete the deployment.

    After completing the above steps we can test the deployment using the primary endpoint

    ![Image]({{ site.baseurl }}/images/image16.png)

11. Create CDN profile for the front end Create cdn profiles on Home->CDN profiles menu. after successful deployment of cdn profile, create cdn endpoint at the end point creation menu specify name as any meaningful name .
origin type : Storage static website origin hostname : the hostname generated by the url when completing the first step

    WE CAN ADD CUSTOM DOMAIN FOR OUR CDN HERE

12. Create Web application Firewall Policies (WAF) Goto home -> Web application Firewall Policies (WAF) menu Click create button On the basic tab under the project details section select AzureCDN Under the Instance details section select Policy mode select Prevention Add necessary custom rules under Custom rules tab Finally associate cdn end point at the Association tab and create the WAF policy