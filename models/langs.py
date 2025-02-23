from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import func
from db import db



class Lang(db.Model):
    __tablename__ = 'langs'


    id = db.Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = db.Column(db.String(255), nullable = False)
    creation = db.Column(db.String(255), nullable = False)
    creator = db.Column(db.String(255), nullable = False)
    description = db.Column(db.String(255), nullable = False)
    typing = db.Column(db.String(255), nullable = False)
    download = db.Column(db.String(255), nullable = False)
    tutorial = db.Column(db.String(255), nullable = False)
    docs = db.Column(db.String(255), nullable = False)

    def dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'creation': self.creation,
            'creator' : self.creator,
            'description': self.description,
            'typing': self.typing,
            'download': self.download,
            'tutorial': self.tutorial,
            'docs': self.docs
        }
    