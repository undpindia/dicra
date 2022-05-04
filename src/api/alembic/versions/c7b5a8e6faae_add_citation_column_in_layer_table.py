"""Add citation column in layer table

Revision ID: c7b5a8e6faae
Revises: 246d59b983ad
Create Date: 2022-03-28 10:46:13.506394

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c7b5a8e6faae'
down_revision = '246d59b983ad'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tbl_layers', sa.Column('citation',sa.Text))
    


def downgrade():
    op.drop_column('tbl_layers', 'citation')
    
