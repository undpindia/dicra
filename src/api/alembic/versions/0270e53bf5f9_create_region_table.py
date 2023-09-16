"""Create region table

Revision ID: 0270e53bf5f9
Revises: 
Create Date: 2023-04-07 02:53:03.704691

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0270e53bf5f9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'regions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('layers')
