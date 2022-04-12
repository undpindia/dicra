from sqlalchemy import Integer, String,Text,Boolean,DateTime,Date
from sqlalchemy.sql.schema import Column
from db.database import Base

class Parameter(Base):
    __tablename__ = 'tbl_parameters'
    id = Column(Integer, primary_key=True)
    parameter_name= Column(String(255))
    available_date= Column(Date)