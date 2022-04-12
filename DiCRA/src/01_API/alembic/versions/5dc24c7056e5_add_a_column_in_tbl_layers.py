"""Add a column in tbl_layers

Revision ID: 5dc24c7056e5
Revises: 6ae0bc32ba1c
Create Date: 2021-12-30 12:58:00.775568

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5dc24c7056e5'
down_revision = '6ae0bc32ba1c'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tbl_layers', sa.Column('display_name',sa.String(255)))


def downgrade():
    op.drop_column('tbl_layers', 'display_name')
