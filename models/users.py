from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import func
from sqlalchemy.orm import validates
from db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'


    id = db.Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    senha_hash = db.Column(db.String(255), nullable=False)  


    def get_id(self):
        return str(self.id)
    
    #manipulacao de seguranca da senha
    @property
    def password(self):
        raise AttributeError('A senha nao é um atributo legivel!')
    
    @password.setter
    def password(self, password):
        self.senha_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.senha_hash, password)
    
    # Validações
    @validates('email')
    def validate_email(self, key, email):
        assert '@' in email, "Email inválido"
        return email.lower() 
    
    @validates('name')
    def validate_name(self, key, name):
        assert len(name) >= 3, "Nome deve ter pelo menos 3 caracteres"
        return name.title() 