from flask import Flask, request, jsonify
from flask_migrate import Migrate
from db import db 
from flask_cors import CORS    #importa as libs para fazer a aplicação funcionar

#importa os modelos para o DB
from models.langs import Lang
from models.frameworks import Framework



app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:pgadm@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
migrate = Migrate(app, db)


#APP ROUTES, POST, GET, DELETE E PATCH (INSERIR, CONSULTAR, REMOVER E ATUALIZAR, RESPECTIVAMENTE...) DAS LINGUAGENS DE PROGRAMAÇÃO
@app.route('/langs', methods=['POST'])
def add_language():
    data = request.get_json()
    newLang = Lang(name=data['name'], creation=data['creation'], creator=data['creator'], description=data['description'], typing=data['typing'], download=data['download'], tutorial=data['tutorial'], docs=data['docs'])
    db.session.add(newLang)
    db.session.commit()
    return jsonify({'message': 'linguagem cadastrada com sucesso'}), 201


@app.route('/langs', methods=['GET'])
def get_languages():
    langs = Lang.query.all()
    return jsonify([lang.dict() for lang in langs])


@app.route('/langs/<uuid:lang_id>', methods=['GET'])
def get_book(lang_id):
    lang = Lang.query.get_or_404(lang_id)
    return jsonify(lang.dict())

@app.route('/langs/<uuid:lang_id>', methods=['PATCH'])
def update_lang(lang_id):
    lang = Lang.query.get_or_404(lang_id)
    data = request.get_json()
    for key, value, in data.items():
        setattr(lang, key, value)
    db.session.coomit()
    return jsonify({"message": "linguagem atualizada, obrigado por contribuir!"})


@app.route('/langs/<uuid:lang_id>', methods =['DELETE'])
def remove_lang(lang_id):
    lang = Lang.query.get_or_404(lang_id)
    db.session.delete(lang)
    db.session.commit()
    return jsonify({"message": "Linguagem removida com sucesso!"})   
    
#APP ROUTE PARA OS FRAMEWORKS (GET, POST, DELETE, PATCH)

@app.route('/frameworks', methods=['POST'])
def add_framework():
    data = request.get_json()
    newframework = Framework(name=data['name'], creation=data['creation'], creator=data['creator'], description=data['description'], language=data['language'], download=data['download'], tutorial=data['tutorial'], docs=data['docs'])
    db.session.add(newframework)
    db.session.commit()
    return jsonify({"message": "framework adicionada com sucesso"}), 201

@app.route('/frameworks', methods=['GET'])
def get_frameworks():
    frameworks = Framework.query.all()
    return jsonify([frameworks.dict() for frameworks in frameworks])


@app.route('/frameworks/<uuid:framework_id>', methods=['GET'])
def get_framework(framework_id):
    framework = Framework.query.get_or_404(framework_id)
    return jsonify(framework.dict())


@app.route('/frameworks/<uuid:framework_id>', methods=['PATCH'])
def update_framewok(framework_id):
    framework = Framework.query.get_or_404(framework_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(framework, key, value)
    db.session.commit()
    return jsonify({'message': 'framework atualizada, obrigado por contribuir!'})


@app.route('/frameworks/<uuid:framework_id>', methods=['DELETE'])
def remove_framework(framework_id):
    framework = Framework.query.get_or_404(framework_id)
    db.session.delete(framework)
    db.session.commit()
    return jsonify({"message": "framework removido com sucesso!"})


