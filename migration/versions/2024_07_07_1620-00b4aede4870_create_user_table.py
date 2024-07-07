"""create user table

Revision ID: 00b4aede4870
Revises: 
Create Date: 2024-07-07 16:20:20.914900+09:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '00b4aede4870'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True, unique=True, index=True),
        sa.Column('name', sa.String, index=True, nullable=False),
        sa.Column('email', sa.String, unique=True, index=True, nullable=False),
        sa.Column('role', sa.Integer, nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.current_timestamp())
    )


def downgrade():
    op.drop_table('users')
