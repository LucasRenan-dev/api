"""empty message

Revision ID: 72c28e5bc421
Revises: a058b239ecf2
Create Date: 2025-05-17 19:41:31.109980

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '72c28e5bc421'
down_revision = 'a058b239ecf2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('senha_hash', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_users_email'), ['email'], unique=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_users_email'))

    op.drop_table('users')
    # ### end Alembic commands ###
