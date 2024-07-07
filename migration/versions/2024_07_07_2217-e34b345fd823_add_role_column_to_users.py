"""add role column to users

Revision ID: e34b345fd823
Revises: 4d80f791e7d5
Create Date: 2024-07-07 22:17:59.186364+09:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e34b345fd823'
down_revision: Union[str, None] = '4d80f791e7d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('users', sa.Column('role', sa.Integer, nullable=False))


def downgrade():
    op.drop_column('users', 'role')
