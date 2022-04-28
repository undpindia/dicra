from sqlalchemy import Integer, String,Text,Boolean,DateTime,Date
from sqlalchemy.sql.schema import Column
from db.database import Base

class Weather(Base):
    __tablename__ = 'tbl_weather'
    id = Column(Integer, primary_key=True)
    district= Column(String(255))
    mandal= Column(String(255))
    data_date=Column(Date)
    rain=Column(String(200))
    min_temp=Column(String(200))
    max_temp=Column(String(200))
    min_humidity=Column(String(200))
    max_humidity=Column(String(200))
    min_wind_speed=Column(String(200))
    max_wind_speed=Column(String(200))