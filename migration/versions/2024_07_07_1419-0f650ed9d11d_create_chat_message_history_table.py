"""create chat_message_history table

Revision ID: 0f650ed9d11d
Revises: 080fd2fae482
Create Date: 2024-07-07 14:19:19.225465+09:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0f650ed9d11d'
down_revision: Union[str, None] = '080fd2fae482'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'chat_message_history',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('conversation_id', sa.Integer, sa.ForeignKey('conversations.id')),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id')),
        sa.Column('message_number', sa.Integer),
        sa.Column('content', sa.JSON),
        sa.Column('created_at', sa.DateTime, default=sa.func.current_timestamp())
    )


def downgrade():
    op.drop_table('chat_message_history')
