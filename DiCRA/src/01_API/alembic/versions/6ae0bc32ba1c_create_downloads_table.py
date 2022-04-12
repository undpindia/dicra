"""create downloads table

Revision ID: 6ae0bc32ba1c
Revises: 14dedf473cc9
Create Date: 2021-12-20 19:06:28.710731

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6ae0bc32ba1c'
down_revision = '14dedf473cc9'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'tbl_downloads',
        sa.Column('id',sa.Integer,primary_key=True),
        sa.Column('layername',sa.String(255)),
        sa.Column('type',sa.String(255)),
        sa.Column('parameterdate',sa.String(255)),
        sa.Column('region',sa.String(255)),
        sa.Column('name',sa.String(255)),
        sa.Column('email',sa.String(255)),
        sa.Column('usage_type',sa.String(255)),
        sa.Column('purpose',sa.String(255))  
    )


def downgrade():
    op.drop_table('tbl_downloads')
