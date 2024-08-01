---
title: Backend Installation
category: Installation Guid
order: 2
---

Operating System: Ubuntu Technology: Python Database : PostgreSQL with postgis extension

### Running Backend Server using uvicorn (Development server)

Steps:

1. Clone Github Repo containing Backend API `git clone https://github.com/undpindia/dicra.git`
2. Navigate to api folder `cd dicra/src/api`
3. Install all required packages using the command `pip install -r requirements.txt`
4. Create a file with the name `config.ini` inside `/config/`. The content of the file should be in the given format. 


{% highlight shell %}
[paths]
Temporaryfiles=temporary file path
[azureblob]
Accounturlazure=account url
Containername=azure container name
Filepath=parameter path in blob
Lulcpath=lulc raster path
[boundaries]
Districtboundary=district_boundarypath
[database]
Sqlalchemyurl=postgresql://username:password@host/dbname
[gunicorn]
Accesslogpath=accesslogpath
Errorlogpath=errorlogpath
{% endhighlight %}

 5. Change `sqlalchemy.url` inside `alembic.ini`
 6. To run all database migrations `run alembic upgrade head`. It will create all the necessary tables
 7. Finally we can run the uvicorn development server using the command `python main.py`. It will start a uvicorn development server `http://localhost:5004`


### Running Backend server using gunicorn systemmd managed unit service and Caddy
Steps:

1. Clone Github Repo containing Backend API `git clone https://github.com/undpindia/dicra.git`
2. Create conda virtual environment using the command `conda create -n environmentname python=3`
3. Activate the conda virtual environment using the command `conda activate envname`
4. Install all the required packages using `pip install -r requirements.txt`
5. Change User, Group, WorkingDirectory, Environment in the gunicorn.service file from the repo
6. Create a gunicorn service by running `sudo nano /etc/systemd/system/gunicorn.service`
7. Register the unit file `gunicorn.service` with Systemd by executing the following commands.

{% highlight shell %}
sudo systemctl daemon-reload
sudo systemctl enable gunicorn.service
sudo systemctl start gunicorn.service
{% endhighlight %}

The `systemctl enable` command will add our gunicorn service to resume running when the VM reboots.

The `systemctl start` command will quickly start the gunicorn service and invokes the `ExecStart` command.

To check the status of our gunicorn.service at any point of time, run the following command. `sudo systemctl status gunicorn.service` 

8. Install caddy 2 web server We can install caddy web server using the following command


{% highlight shell %}
echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list
sudo apt update
sudo apt install -y caddy
{% endhighlight %}

We can check the caddy server status by running `systemctl status caddy`

9. Now we will configure our Caddy 2 Web server to serve the FastAPI app running on port 8000 via a reverse proxy. To do so, lets edit the `/etc/caddy/Caddyfile` by running the following command. sudo nano `/etc/caddy/Caddyfile`

Replace the contents of the Caddyfile and it should look like below

{% highlight shell %}
:80
reverse_proxy 0.0.0.0:8000
{% endhighlight %}

Restart the caddy server by running the following command `sudo systemctl restart caddy`
