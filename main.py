from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
import webbrowser
import threading


#inicializa o flask
app = Flask(__name__)
CORS(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = '/login-page'

#chama as rotas e a API

from app import *

#abre a pagina de registro pra mexer no programa
def open_browser():
    webbrowser.open('http://127.0.0.1:5000/register')



#rodar o site
if __name__ == '__main__':
    #utiliza um thread diferente para abrir a pagina
    threading.Thread(target=open_browser).start()

    #inicializa a API   
    app.run()