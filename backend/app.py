from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    # Aquí irá la lógica para procesar el mensaje y generar una respuesta
    response = f"Has enviado: {message}"
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)