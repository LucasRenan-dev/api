from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_migrate import Migrate
from db import db 
from flask_cors import CORS    #importa as libs para fazer a aplicação funcionar
from flask_login import login_user, login_required, logout_user, LoginManager, current_user


#importa os modelos para o DB
from models.langs import Lang
from models.frameworks import Framework
from models.users import User



app = Flask(__name__)
CORS(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = '/login-page'


app.config['SQLALCHEMY_DATABASE_URI'] = ''
app.config['SECRET_KEY'] = 'chave_secreta_aqui'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


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



# ===>Rota para cadastro do usuario <===
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    #Se algum campo do form do front-end estiver incongruente, retorna um erro
    required_fields = ['email', 'senha', 'nome']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Dados incompletos. Campos obrigatórios: nome, email, senha"}), 400

    if '@' not in data['email']: 
        return jsonify({"error": "Email inválido"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email já cadastrado"}), 409

    try:
        new_user = User(
            name=data['nome'],
            email=data['email'].lower(),
            password=data['senha']  # O hash da senha é feito diretamente no modelo do usuario
        )

        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "message": "Usuário cadastrado com sucesso",
            "user": {
                "id": str(new_user.id),
                "name": new_user.name,
                "email": new_user.email
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Erro ao cadastrar usuário", "details": str(e)}), 500

#rota para renderizar o template de registro corretamente, via flask
@app.route('/register', methods=['GET'])
def open_registerpage():
    return render_template('register.html')

#com o usuario já cadastrado, essa rota faz o login e autoriza o acesso as rotas principais
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'email' not in data or 'senha' not in data:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400
    
    user = User.query.filter_by(email=data['email'].lower()).first()
    
    if not user or not user.verify_password(data['senha']):
        return jsonify({"error": "Email ou senha incorretos"}), 401
    
    login_user(user)
    return jsonify({
        "message": "Login bem-sucedido",
        "redirect": "/dashboard"  #redirect para rota principal
    }), 200

#carrega o templeta de login corretamente
@app.route('/login', methods=['GET'])
def open_loginpage():
    return render_template('login.html')


#rota para fazer logout do user
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout realizado com sucesso"}), 200


#rota principal, que acessa o app
@app.route('/dashboard')
@login_required  
def dashboard():
    #uma das vericacoes pra ver se o user esta logado (tem outra no front-end)
    if not current_user.is_authenticated:
        return redirect(url_for('login.html'))
    
    return render_template('dashboard.html', user=current_user)

