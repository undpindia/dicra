from sqlalchemy import Integer, String,Text,Boolean,DateTime,Date,ForeignKey
from sqlalchemy.sql.schema import Column
from app.db.db import Base

class Download(Base):
    __tablename__ = 'tbl_downloads'
    id = Column(Integer, primary_key=True)
    layer_id = Column(Integer, ForeignKey('layers.id'), nullable=False)
    name = Column(String(255))
    file_name = Column(String(255))
    email = Column(String(255))
    usage_type = Column(String(255))
    purpose = Column(String(255))

