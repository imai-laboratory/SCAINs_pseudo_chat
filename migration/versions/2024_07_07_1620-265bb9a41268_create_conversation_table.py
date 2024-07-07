"""create conversation table

Revision ID: 265bb9a41268
Revises: 00b4aede4870
Create Date: 2024-07-07 16:20:30.314945+09:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '265bb9a41268'
down_revision: Union[str, None] = '00b4aede4870'
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
