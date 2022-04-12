"""Add category column in layer table

Revision ID: 65cef9815eb2
Revises: 5dc24c7056e5
Create Date: 2022-01-10 12:23:51.500215

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '65cef9815eb2'
down_revision = '5dc24c7056e5'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tbl_layers', sa.Column('category',sa.String(255)))

def downgrade():
    op.drop_column('tbl_layers', 'category')
