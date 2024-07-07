"""add role column to users

Revision ID: a2ff0645425f
Revises: 0f650ed9d11d
Create Date: 2024-07-07 14:45:51.044626+09:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a2ff0645425f'
down_revision: Union[str, None] = '0f650ed9d11d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('users', sa.Column('role', sa.String, nullable=False, server_default='user'))


def downgrade():
    op.drop_column('users', 'role')
