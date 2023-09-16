from sqlalchemy import Integer, String,Text,Boolean,DateTime,Date,ForeignKey
from sqlalchemy.sql.schema import Column
from app.db.db import Base

class Downloadables(Base):
    __tablename__ = 'tbl_downloadables'
    id = Column(Integer, primary_key=True)
    layer_id = Column(Integer, ForeignKey('layers.id'), nullable=False)
    filename_on_blob=Column(String(255))