from sqlalchemy import Integer, String,Text,Boolean,DateTime,Date,ForeignKey
from sqlalchemy.sql.schema import Column
from app.db.db import Base

class Parameter(Base):
    __tablename__ = 'parameters'
    id = Column(Integer, primary_key=True)
    available_date= Column(Date)
    layer_id = Column(Integer, ForeignKey('layers.id'), nullable=False)