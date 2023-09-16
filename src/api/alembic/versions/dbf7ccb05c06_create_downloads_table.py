"""Create downloads table

Revision ID: dbf7ccb05c06
Revises: 8c77cd97a4d3
Create Date: 2023-07-02 03:06:30.014636

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dbf7ccb05c06'
down_revision = '8c77cd97a4d3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'tbl_downloads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('layer_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255)),
        sa.Column('file_name', sa.String(length=255)),
        sa.Column('email', sa.String(length=255)),
        sa.Column('usage_type', sa.String(length=255)),
        sa.Column('purpose', sa.String(length=255)),
        sa.ForeignKeyConstraint(['layer_id'], ['layers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('tbl_downloads')
