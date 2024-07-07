"""create user table

Revision ID: 5261ad53194a
Revises: 
Create Date: 2024-07-07 14:19:01.033304+09:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5261ad53194a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True, unique=True, index=True),
        sa.Column('name', sa.String, index=True, nullable=False),
        sa.Column('email', sa.String, unique=True, index=True, nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.current_timestamp())
    )


def downgrade():
    op.drop_table('users')
