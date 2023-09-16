FROM osgeo/gdal:ubuntu-small-3.2.0

RUN apt-get update
RUN apt-get -y install python3-pip
RUN pip install rasterstats
RUN pip uninstall fastapi python-multipart
RUN pip install fastapi python-multipart

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]