from sqlalchemy import Integer, String,Text,Boolean,DateTime, Float, BigInteger
from sqlalchemy.sql.schema import Column
from db.database import Base
from geoalchemy2 import Geometry

class Firepoints(Base):
    __tablename__ = 'tbl_points'
    id = Column(Integer, primary_key=True)
    brightness = Column(Float)
    scan = Column(Float)
    track = Column(Float)
    acq_date = Column(Text)
    acq_time = Column(BigInteger)
    satellite = Column(Text)
    instrument = Column(Text)
    confidence = Column(BigInteger)
    version = Column(Text)
    bright_t31 = Column(Float)
    frp = Column(Float)
    daynight = Column(Text)
    geometry = Column(Geometry(geometry_type='POINT'))