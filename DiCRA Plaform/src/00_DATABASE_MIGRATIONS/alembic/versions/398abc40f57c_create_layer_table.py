"""Create layer table

Revision ID: 398abc40f57c
Revises: 976e4e92566d
Create Date: 2021-12-17 15:28:48.413560

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '398abc40f57c'
down_revision = '976e4e92566d'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'tbl_layers',
        sa.Column('id',sa.Integer,primary_key=True),
        sa.Column('layer_name',sa.String(255)),
        sa.Column('short_description',sa.Text),
        sa.Column('long_description',sa.Text),
        sa.Column('source',sa.String(255)),
        sa.Column('url',sa.String(255)),
        sa.Column('unit',sa.String(255)),
        sa.Column('color',sa.String(255)),
        sa.Column('update_frequnecy',sa.Integer),
        sa.Column('last_updated',sa.DateTime),
        sa.Column('raster_status',sa.Boolean),
        sa.Column('vector_status',sa.Boolean),
        sa.Column('multiple_files',sa.Boolean),

    )


def downgrade():
    op.drop_table('tbl_layers')

