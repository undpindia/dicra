"""Create usecase table

Revision ID: 95525cd23d81
Revises: 56b09e64cd25
Create Date: 2023-05-01 15:06:23.314534

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '95525cd23d81'
down_revision = '56b09e64cd25'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'usecases',
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
        sa.ForeignKeyConstraint(['region_id'], ['regions.id'], )
    )


def downgrade() -> None:
    op.drop_table('usecases')
