"""add isavailable coloumn in layer table

Revision ID: fe1f33dae5d1
Revises: 28e51bb9c878
Create Date: 2022-03-10 10:27:36.371220

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fe1f33dae5d1'
down_revision = '28e51bb9c878'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tbl_layers', sa.Column('isavailable',sa.Boolean))


def downgrade():
    op.drop_column('tbl_layers', 'isavailable')
