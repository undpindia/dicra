from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy import Column, Integer, String
from app.db.db import Base

class Layer(Base):
    __tablename__ = 'layers'
    id = Column(Integer, primary_key=True)
    unit = Column(String(255))
    xaxislabel = Column(String(255))
    isavailable = Column(Boolean)
    layer_name = Column(String(255))
    citation = Column(Text)
    last_updated = Column(DateTime)
    standards = Column(Text)
    short_description = Column(Text)
    raster_status = Column(Boolean)
    timerangefilter = Column(Boolean)
    long_description = Column(Text)
    vector_status = Column(Boolean)
    showcustom = Column(Boolean)
    source = Column(String(255))
    multiple_files = Column(Boolean)
    datafromvector = Column(Boolean)
    url = Column(String(255))
    display_name = Column(String(255))
    yaxislabel = Column(String(255))
    region_id = Column(Integer, ForeignKey('regions.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('category.id'), nullable=False)
