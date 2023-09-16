"""Create downloadables table

Revision ID: 8c77cd97a4d3
Revises: 3d060e8d529d
Create Date: 2023-07-02 02:54:38.749246

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8c77cd97a4d3'
down_revision = '3d060e8d529d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'tbl_downloadables',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('layer_id', sa.Integer(), nullable=False),
        sa.Column('filename_on_blob', sa.String(length=255)),
        sa.ForeignKeyConstraint(['layer_id'], ['layers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('tbl_downloadables')
