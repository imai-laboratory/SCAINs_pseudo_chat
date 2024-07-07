"""create conversation table

Revision ID: 080fd2fae482
Revises: 5261ad53194a
Create Date: 2024-07-07 14:19:04.529103+09:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '080fd2fae482'
down_revision: Union[str, None] = '5261ad53194a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('name', sa.String, nullable=False)
    )


def downgrade():
    op.drop_table('conversations')
