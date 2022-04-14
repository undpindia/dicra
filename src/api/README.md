# DiCRA - Backend API
### What is repository for? ###
This repository has the API code for our application. 
### How do I get set up? ###
#### Running Backend Server using Uvicorn (Development server)
It requires Ubuntu, Python, PostgreSQL with PostGIS extension.
To run the API Server using Uvicorn do the following.
- Install all required packages using the command
  ```sh
  pip install -r requirements.txt
  ```
- Change Database connection url  on sqlalchemy.url in alembic.ini and SQLALCHEMY_DATABASE_URL in **/db/database.py**
- To run database migration, use
  ```sh
  alembic upgrade head
  ```
  It will create  all the necessary tables.
- Finally we can run the Uvicorn development server using the command
  ```sh
  python main.py
  ```
  it will start a Uvicorn development server on
  ```sh
  http://localhost:5004
  ```
 ## Running Backend server using Gunicorn systemmd managed unit service and     Caddy
To run Backend server using Gunicorn systemmd managed unit service and Caddy as Reverse Proxy do the following.
- Create conda virtual environment using the command 
    ```sh
    conda create -n environmentname python=3
    ```
- Activate the conda virtual environment using the command
    ```sh
    conda activate environmentname
    ```
- Install all the required packages using
    ```sh
    pip install -r requirements.txt
    ```
- Change Database connection url  on sqlalchemy.url in alembic.ini and SQLALCHEMY_DATABASE_URL in **/db/database.py**
- To run  database migration, use
  ```sh
  alembic upgrade head
  ```
  It will create  all the necessary tables
- Delete line 70 and 71 from main.py
- Change User, Group,WorkingDirectory, Environment in the  gunicorn.service file in this repository
- Create a Gunicorn service by running
  ```sh
  sudo nano /etc/systemd/system/gunicorn.service
  ```
  and copy and paste all the changed content in the provious step from gunicorn.service file
- Register the unit file gunicorn.service with Systemd by executing the following commands.
    ```sh
    sudo systemctl daemon-reload
    sudo systemctl enable gunicorn.service
    sudo systemctl start gunicorn.service
    ```
    The systemctl enable command  will add our Gunicorn service to resume running when the VM reboots.
    
    The systemctl start command will quickly start the Gunicorn service and invokes the ExecStart command.
    
    To check the status of our gunicorn.service at any point of time, run the following command.
    ```sh
    sudo systemctl status gunicorn.service
    ```
- Install Caddy 2 web server

  We can install Caddy web server using the following commands
    ```sh
    echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list
    sudo apt update
    sudo apt install -y caddy 
    ```
    We can check the Caddy server status by running 
    ```sh
    systemctl status caddy
    ```
- Now we will configure our Caddy 2 Web server to serve the FastAPI app running on port 8000 via a reverse proxy. To do so, lets edit the /etc/caddy/Caddyfile by running the following command.
    ```sh
    sudo nano /etc/caddy/Caddyfile
    ```
    Replace the contents of the Caddyfile and it should look like below
    ```sh
    :80
    reverse_proxy 0.0.0.0:8000
    ```
    Restart the caddy server by running the following command
    ```sh
    sudo systemctl restart caddy
    ```
### Configuration File ###
Set the appropriate parameters in the config.ini in the  **/config** folder. Given below are the various parameters that needs to be entered in this file.
- Temporaryfiles - Temporary file path 
- Accounturl - Azure Storage account url
- Containername - Azure Storage container name
- Districtboundary - District boundary path stored in **/boundaries** folder

Also, the backend service  uses Azure blob for storing files. Please set up the appropriate storage account and containers in Azure.