"""Create new usecase table

Revision ID: 3d060e8d529d
Revises: e3c33d243285
Create Date: 2023-05-06 14:02:51.791072

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3d060e8d529d'
down_revision = 'e3c33d243285'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'tbl_usecases',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('project_name', sa.String(length=255), nullable=True),
        sa.Column('project_type', sa.String(length=255), nullable=True),
        sa.Column('short_description', sa.Text(), nullable=True),
        sa.Column('long_description', sa.Text(), nullable=True),
        sa.Column('url', sa.String(length=255), nullable=True),
        sa.Column('image', sa.String(length=255), nullable=True),
        sa.Column('username', sa.String(length=255), nullable=True),
        sa.Column('email_id', sa.String(length=255), nullable=True),
        sa.Column('region_id', sa.Integer(), nullable=False),
        sa.Column('approved', sa.Boolean(), nullable=True),
        sa.Column('created_date', sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(['region_id'], ['regions.id'], )
    )


def downgrade() -> None:
    op.drop_table('tbl_usecases')
