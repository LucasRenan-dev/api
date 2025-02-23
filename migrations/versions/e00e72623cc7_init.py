"""init

Revision ID: e00e72623cc7
Revises: 8de4070eaa94
Create Date: 2025-02-07 21:03:37.197039

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e00e72623cc7'
down_revision = '8de4070eaa94'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('langs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('download_link', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('tutorial', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('docs', sa.String(length=255), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('langs', schema=None) as batch_op:
        batch_op.drop_column('docs')
        batch_op.drop_column('tutorial')
        batch_op.drop_column('download_link')

    # ### end Alembic commands ###
