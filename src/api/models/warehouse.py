from sqlalchemy import Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql.schema import Column
from db.database import Base


class Warehouse(Base):
    __tablename__ = 'tbl_warehouses'
    id = Column(Integer, primary_key=True)
    region = Column(String(255))
    wh_type = Column(String(255))
    warehouse = Column(String(255))
    district = Column(String(255))
    capacity = Column(String(255))
    occupancy = Column(String(255))
    vacancy = Column(String(255))
    latitude = Column(String(255))
    longitude = Column(String(255))
    address = Column(Text)
    status = Column(String(255))
    
