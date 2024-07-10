"""add login_id column to users

Revision ID: 45605ebcd5c5
Revises: 4d80f791e7d5
Create Date: 2024-07-10 14:18:26.037342+09:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '45605ebcd5c5'
down_revision: Union[str, None] = '4d80f791e7d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('users', sa.Column('login_id', sa.String, unique=True, nullable=False))


def downgrade():
    op.drop_column('users', 'login_id')
