"""create parameter table

Revision ID: 14dedf473cc9
Revises: 398abc40f57c
Create Date: 2021-12-20 13:52:58.721477

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '14dedf473cc9'
down_revision = '398abc40f57c'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'tbl_parameters',
        sa.Column('id',sa.Integer,primary_key=True),
        sa.Column('parameter_name',sa.String(255)),
        sa.Column('available_date',sa.Date)
    )


def downgrade():
    op.drop_table('tbl_parameters')
