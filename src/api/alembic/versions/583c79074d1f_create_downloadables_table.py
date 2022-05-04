"""create downloadables table

Revision ID: 583c79074d1f
Revises: 817f06a069ae
Create Date: 2022-04-04 18:18:03.735338

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '583c79074d1f'
down_revision = '817f06a069ae'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
    'tbl_downloadfiles',
    sa.Column('id',sa.Integer,primary_key=True),
    sa.Column('parameter',sa.String(255)),
    sa.Column('filename_on_blob',sa.String(255))
    )


def downgrade():
    op.drop_table('tbl_downloadfiles')
