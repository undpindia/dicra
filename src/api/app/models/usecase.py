import datetime
from sqlalchemy import Column, Integer, String,Text,Boolean,ForeignKey,Date
from app.db.db import Base

class Usecase(Base):
    __tablename__ = 'tbl_usecases'
    id = Column(Integer, primary_key=True)
    project_name = Column(String(255))
    project_type = Column(String(255))
    short_description = Column(Text)
    long_description=Column(Text)
    url = Column(String(255))
    image = Column(String(255))
    username = Column(String(255))
    email_id = Column(String(255))
    approved = Column(Boolean)
    region_id = Column(Integer, ForeignKey('regions.id'), nullable=False)
    created_date=Column(Date,default=datetime.date.today)





