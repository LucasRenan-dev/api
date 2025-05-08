from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import func
from sqlalchemy.orm import validates
from db import db
from werkzeug.security import generate_password_hash, check_password_hash



class User(db.Model):
    __tablename__ = 'users'


    id = db.Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    senha_hash = db.Column(db.String(255), nullable=False)  # Hash do Werkzeug cabe em 128 chars
    ativo = db.Column(db.Boolean, nullable=False, default=True)

    # Garante que o email seja válido
    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email: 
            raise ValueError("Email inválido")
        return email

    # Propriedade para segurança da senha
    @property
    def senha(self):
        raise AttributeError('Senha não é legível')

    @senha.setter
    def senha(self, senha):
        self.senha_hash = generate_password_hash(senha)

    def verificar_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)

    def __repr__(self):
        return f'<User {self.email}>'