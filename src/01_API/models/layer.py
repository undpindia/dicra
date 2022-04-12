from sqlalchemy import Integer, String,Text,Boolean,DateTime
from sqlalchemy.sql.schema import Column
from db.database import Base

class Layer(Base):
    __tablename__ = 'tbl_layers'
    id = Column(Integer, primary_key=True)
    layer_name = Column(String(255))
    short_description = Column(Text)
    long_description = Column(Text)
    source=Column(String(255))
    url = Column(String(255))
    unit = Column(String(255))
    color= Column(String(255))
    update_frequnecy = Column(Integer)
    last_updated = Column(DateTime)
    raster_status = Column(Boolean)
    vector_status = Column(Boolean)
    multiple_files = Column(Boolean)
    display_name=Column(String(255))
    category=Column(String(255))