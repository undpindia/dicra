from sqlalchemy import Column, Integer, String
from app.db.db import Base

class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
