"""Add datafromvector column in layerconfig

Revision ID: 0c9e141a9f0e
Revises: de1f9ec54d2d
Create Date: 2022-04-18 12:48:15.112864

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0c9e141a9f0e'
down_revision = 'de1f9ec54d2d'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tbl_layers', sa.Column('datafromvector',sa.Boolean))


def downgrade():
    op.drop_column('tbl_layers', 'datafromvector')
