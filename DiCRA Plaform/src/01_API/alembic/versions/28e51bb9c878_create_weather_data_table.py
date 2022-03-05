"""create weather data table

Revision ID: 28e51bb9c878
Revises: 65cef9815eb2
Create Date: 2022-02-17 13:28:57.279677

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '28e51bb9c878'
down_revision = '65cef9815eb2'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'tbl_weather',
        sa.Column('id',sa.Integer,primary_key=True),
        sa.Column('district',sa.String(255)),
        sa.Column('mandal',sa.String(255)),
        sa.Column('data_date',sa.Date),
        sa.Column('rain',sa.String(200)),
        sa.Column('min_temp',sa.String(200)),
        sa.Column('max_temp',sa.String(200)),
        sa.Column('min_humidity',sa.String(200)),
        sa.Column('max_humidity',sa.String(200)),
        sa.Column('min_wind_speed',sa.String(200)),
        sa.Column('max_wind_speed',sa.String(200))
    )


def downgrade():
    op.drop_table('tbl_weather')
