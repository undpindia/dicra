"""create usecase table

Revision ID: 976e4e92566d
Revises: 
Create Date: 2021-12-17 11:52:38.250416

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '976e4e92566d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'tbl_usecases',
        sa.Column('id',sa.Integer,primary_key=True),
        sa.Column('project_name',sa.String(255)),
        sa.Column('project_type',sa.String(255)),
        sa.Column('short_description',sa.String(255)),
        sa.Column('long_description',sa.Text),
        sa.Column('url',sa.String(255)),
        sa.Column('image',sa.String(255)),
        sa.Column('username',sa.String(255)),
        sa.Column('email_id',sa.String(255)),
        sa.Column('approved',sa.Boolean),
    )


def downgrade():
    op.drop_table('tbl_usecases')
