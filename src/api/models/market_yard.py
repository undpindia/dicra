from sqlalchemy import Integer, String,Text,Boolean,DateTime, Float, BigInteger
from sqlalchemy.sql.schema import Column
from db.database import Base


class Market_point(Base):
    __tablename__ = 'tbl_market_yard'
    id = Column(Integer, primary_key=True)
    district = Column(Text)
    capacity = Column(Text)
    name = Column(Text)
    latitude = Column(Text)
    longitude = Column(Text)

class Market_data(Base):
    __tablename__ = 'tbl_market_yard_day_prices'
    id = Column(BigInteger, primary_key=True)
    index = Column(BigInteger)
    DDate = Column(Text)
    AmcCode = Column(BigInteger)
    AmcName = Column(Text)
    YardCode = Column(BigInteger)
    YardName = Column(Text)
    CommCode = Column(BigInteger)
    CommName = Column(Text)
    VarityCode = Column(BigInteger)
    VarityName = Column(Text)
    ProgArrivals = Column(Float)
    Arrivals = Column(Float)
    Minimum = Column(Float)
    Maximum = Column(Float)
    Model = Column(Float)
    Valuation = Column(Float)
    MarketFee = Column(Float)