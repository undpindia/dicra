#Script for creating the Data Automation Folders
##Base DataSource folders

mkdir -p /data/airflow/nfsdata/ndvi
mkdir -p /data/airflow/nfsdata/soc
mkdir -p /data/airflow/nfsdata/cropfire
mkdir -p /data/airflow/nfsdata/tempanomaly
mkdir -p /data/airflow/nfsdata/percanomaly
mkdir -p /data/airflow/nfsdata/ssm
mkdir -p /data/airflow/nfsdata/lst
mkdir -p /data/airflow/nfsdata/lai

##States
mkdir -p /data/airflow/nfsdata/ndvi/telengana

##Processing folders for each DS & state
# NDVI
mkdir -p /data/airflow/nfsdata/ndvi/telengana/base
mkdir -p /data/airflow/nfsdata/ndvi/telengana/download
mkdir -p /data/airflow/nfsdata/ndvi/telengana/process
mkdir -p /data/airflow/nfsdata/ndvi/telengana/publish
mkdir -p /data/airflow/nfsdata/ndvi/telengana/publish/archive
mkdir -p /data/airflow/nfsdata/ndvi/telengana/dppd

# SOC
mkdir -p /data/airflow/nfsdata/ndvi/telengana/base
mkdir -p /data/airflow/nfsdata/ndvi/telengana/download
mkdir -p /data/airflow/nfsdata/ndvi/telengana/process/clipped
mkdir -p /data/airflow/nfsdata/ndvi/telengana/process/cog
mkdir -p /data/airflow/nfsdata/ndvi/telengana/publish/projected
mkdir -p /data/airflow/nfsdata/ndvi/telengana/publish/soil




