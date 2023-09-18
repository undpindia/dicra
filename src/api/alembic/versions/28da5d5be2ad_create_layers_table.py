"""Create layers table

Revision ID: 28da5d5be2ad
Revises: 0270e53bf5f9
Create Date: 2023-04-07 03:07:51.026903

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '28da5d5be2ad'
down_revision = '0270e53bf5f9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'category',
         sa.Column('id', sa.Integer(), nullable=False),
         sa.Column('category_name', sa.String(length=255), nullable=True),
         sa.PrimaryKeyConstraint('id')
    )


    op.create_table(
        'layers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('unit', sa.String(length=255), nullable=True),
        sa.Column('xaxislabel', sa.String(length=255), nullable=True),
        sa.Column('isavailable', sa.Boolean(), nullable=True),
        sa.Column('layer_name', sa.String(length=255), nullable=True),
        sa.Column('citation', sa.Text(), nullable=True),
        sa.Column('last_updated', sa.DateTime(), nullable=True),
        sa.Column('standards', sa.Text(), nullable=True),
        sa.Column('short_description', sa.Text(), nullable=True),
        sa.Column('raster_status', sa.Boolean(), nullable=True),
        sa.Column('timerangefilter', sa.Boolean(), nullable=True),
        sa.Column('long_description', sa.Text(), nullable=True),
        sa.Column('vector_status', sa.Boolean(), nullable=True),
        sa.Column('showcustom', sa.Boolean(), nullable=True),
        sa.Column('source', sa.String(length=255), nullable=True),
        sa.Column('multiple_files', sa.Boolean(), nullable=True),
        sa.Column('datafromvector', sa.Boolean(), nullable=True),
        sa.Column('url', sa.String(length=255), nullable=True),
        sa.Column('display_name', sa.String(length=255), nullable=True),
        sa.Column('yaxislabel', sa.String(length=255), nullable=True),
        sa.Column('region_id', sa.Integer(), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['region_id'], ['regions.id'], ),
        sa.ForeignKeyConstraint(['category_id'], ['category.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('layers')
    op.drop_table('category')



