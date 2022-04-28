from sqlalchemy import Integer, String,Text,Boolean,DateTime,Date
from sqlalchemy.sql.schema import Column
from db.database import Base

class Downloadables(Base):
    __tablename__ = 'tbl_downloadfiles'
    id = Column(Integer, primary_key=True)
    parameter = Column(String(255))
    filename_on_blob = Column(String(255))
