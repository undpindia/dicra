import configparser
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

config = configparser.ConfigParser()
config.read('config/config.ini')


SQLALCHEMY_DATABASE_URL = config['database']['Sqlalchemyurl']

engine = create_engine(SQLALCHEMY_DATABASE_URL,poolclass=NullPool)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    except:
        db.close()