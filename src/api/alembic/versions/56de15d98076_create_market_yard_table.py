"""create market_yard_table

Revision ID: 56de15d98076
Revises: fe1f33dae5d1
Create Date: 2022-03-21 11:22:41.172492

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '56de15d98076'
down_revision = 'fe1f33dae5d1'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'tbl_market_yard',
        sa.Column('id',sa.Integer,primary_key=True),
        sa.Column('district',sa.Text),
        sa.Column('capacity',sa.Text),
        sa.Column('name',sa.Text),
        sa.Column('latitude',sa.Text),
        sa.Column('longitude',sa.Text)
    )


def downgrade():
    op.drop_table('tbl_market_yard')
