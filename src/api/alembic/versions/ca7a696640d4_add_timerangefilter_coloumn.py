"""Add timerangefilter coloumn

Revision ID: ca7a696640d4
Revises: 583c79074d1f
Create Date: 2022-04-05 13:01:23.418751

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ca7a696640d4'
down_revision = '583c79074d1f'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tbl_layers', sa.Column('timerangefilter',sa.Boolean))


def downgrade():
    op.drop_column('tbl_layers', 'timerangefilter')
