##Custom docker file to install the dependencies
FROM apache/airflow:2.5.1
USER root
RUN apt-get update \
&& apt-get install -y build-essential \
&& apt-get install  -y gdal-bin \
&& apt-get install -y libgdal-dev
RUN export CPLUS_INCLUDE_PATH=/usr/include/gdal
RUN export C_INCLUDE_PATH=/usr/include/gdal
RUN apt-get install python3-gdal
USER airflow
RUN pip3 install GDAL==$(gdal-config --version | awk -F'[.]' '{print $1"."$2}')
COPY requirements.txt .
RUN pip3 install -r requirements.txt

