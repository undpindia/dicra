from sqlalchemy import Integer, String
from sqlalchemy.sql.schema import Column
from db.database import Base

class Job(Base):
    __tablename__ = 'jobs'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
