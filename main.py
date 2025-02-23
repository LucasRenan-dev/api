from flask import Flask
from flask_cors import CORS
import webbrowser
import threading
from time import sleep


#inicializa o flask
app = Flask(__name__)
CORS(app)

#chama as rotas e a API

from app import *

#abrir a pagina HTML pra fazer as buscas
def open_browser():
    sleep(1)

    webbrowser.open('templates\index.html')

#rodar o site
if __name__ == '__main__':
    #utiliza um thread diferente para abrir a pagina
    threading.Thread(target=open_browser).start()

    #inicializa a API   
    app.run()