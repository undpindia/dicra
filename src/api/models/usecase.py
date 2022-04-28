from sqlalchemy import Integer, String,Text,Boolean
from sqlalchemy.sql.schema import Column
from db.database import Base


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
