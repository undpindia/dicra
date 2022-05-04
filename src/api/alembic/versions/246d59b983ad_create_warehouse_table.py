"""create warehouse table

Revision ID: 246d59b983ad
Revises: 56de15d98076
Create Date: 2022-03-23 14:52:11.829727

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '246d59b983ad'
down_revision = '56de15d98076'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'tbl_warehouses',
        sa.Column('id',sa.Integer,primary_key=True),
        sa.Column('region',sa.String(255)),
        sa.Column('wh_type',sa.String(255)),
        sa.Column('warehouse',sa.String(255)),
        sa.Column('district',sa.String(255)),
        sa.Column('capacity',sa.String(255)),
        sa.Column('occupancy',sa.String(255)),
        sa.Column('vacancy',sa.String(255)),
        sa.Column('latitude',sa.String(255)),
        sa.Column('longitude',sa.String(255)),
        sa.Column('address',sa.Text),
        sa.Column('status',sa.String(255))  
    )


def downgrade():
    op.drop_table('tbl_warehouses')
