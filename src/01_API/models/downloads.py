from sqlalchemy import Integer, String,Text,Boolean,DateTime,Date
from sqlalchemy.sql.schema import Column
from db.database import Base

class Downloads(Base):
    __tablename__ = 'tbl_downloads'
    id = Column(Integer, primary_key=True)
    layername = Column(String(255))
    type = Column(String(255))
    parameterdate = Column(Date)
    region = Column(String(255))
    name = Column(String(255))
    email = Column(String(255))
    usage_type = Column(String(255))
    purpose = Column(String(255))
