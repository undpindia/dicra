"""Add showcustom column in layerconfig

Revision ID: de1f9ec54d2d
Revises: ca7a696640d4
Create Date: 2022-04-18 12:26:36.389944

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'de1f9ec54d2d'
down_revision = 'ca7a696640d4'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tbl_layers', sa.Column('showcustom',sa.Boolean))


def downgrade():
    op.drop_column('tbl_layers', 'showcustom')
