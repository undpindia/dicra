"""Update usecase

Revision ID: e3c33d243285
Revises: 95525cd23d81
Create Date: 2023-05-01 18:31:33.034657

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e3c33d243285'
down_revision = '95525cd23d81'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('usecases', sa.Column('created_date', sa.Date(), nullable=False))


def downgrade() -> None:
    op.drop_column('usecases', 'created_date')
