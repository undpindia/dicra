## Deploy ReactJS app to Azure Blob Storage through GitHub Actions

### Pre-requisites:
- Azure subscription
- Git installed on your computer
- Github Account
- Azure storage account with static websites enabled

### GitHub Actions

- Add storage account connection string on github Action secrets.
- In GitHub, click on Settings :
<img width="468" alt="image" src="https://user-images.githubusercontent.com/42402451/163324262-64cd0961-2462-41cc-8a82-4b671080987f.png">

- Click on Secrets followed by Actions

<img width="133" alt="image" src="https://user-images.githubusercontent.com/42402451/163324435-d08be09a-9e20-44db-89a2-dd9b6f10fccd.png">

- Click on "New repository secret"

<img width="468" alt="image" src="https://user-images.githubusercontent.com/42402451/163324516-e88fe63c-470c-4bcb-9b4a-0f3cd2660c9e.png">

- Create a key named AZURE_STORAGE then paste the connection string from the storage account that we have created for hosting Click on "Add secret".

<img width="468" alt="image" src="https://user-images.githubusercontent.com/42402451/163324575-0e343e7b-10da-4b02-b72f-10a89bc10012.png">

- GitHub Workflows in Github Actions:
Add a folder .github/workflows to your source code. Inside that folder, create a text file named deploytoserver.yml (file name can be any meaningful name with .yml extension)with the following content:

**name: Deploy React App to Azure Storage**

<img width="792" alt="image" src="https://user-images.githubusercontent.com/42402451/163325139-ca2ca733-cc64-4097-96dd-9a336a8468b0.png">


- On every push and pull request to the main Branch the workflow automatically triggers and takes the build of the updated code and deploy on the Azure storage.

- Once this file gets pushed or created on GitHub, you can see that the workflow gets kicked off. Click on Actions and you will see a workflow running. 

<img width="388" alt="image" src="https://user-images.githubusercontent.com/42402451/163324840-821e3b50-f688-4d3e-84b8-ad290a0b2695.png">

- If all goes well, the workflow will turn green, meaning that it completed successfully:

<img width="468" alt="image" src="https://user-images.githubusercontent.com/42402451/163324879-5af87ac9-e6ad-434d-bbf8-edbf9c05e519.png">


