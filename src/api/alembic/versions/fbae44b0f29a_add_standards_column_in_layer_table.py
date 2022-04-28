"""Add standards column in layer table

Revision ID: fbae44b0f29a
Revises: c7b5a8e6faae
Create Date: 2022-03-28 10:49:30.528738

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fbae44b0f29a'
down_revision = 'c7b5a8e6faae'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tbl_layers', sa.Column('standards',sa.Text))


def downgrade():
    op.drop_column('tbl_layers', 'standards')
