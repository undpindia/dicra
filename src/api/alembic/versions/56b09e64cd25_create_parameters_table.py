"""create parameters table

Revision ID: 56b09e64cd25
Revises: 28da5d5be2ad
Create Date: 2023-04-12 03:08:46.450280

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '56b09e64cd25'
down_revision = '28da5d5be2ad'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'parameters',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('available_date', sa.Date(), nullable=True),
        sa.Column('layer_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['layer_id'], ['layers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('parameters')
