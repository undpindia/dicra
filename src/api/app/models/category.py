from sqlalchemy import Column, Integer, String
from app.db.db import Base

class Category(Base):
    __tablename__ = "category"
    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String)