from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase Admin SDK
cred = credentials.Certificate("./ej01-c89e6-firebase-adminsdk-s2a6j-0a9780de20.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)

# Rutas

# 1. Crear un documento en Firestore
@app.route('/api/data', methods=['POST'])
def create_document():
    try:
        data = request.json
        doc_ref = db.collection('myCollection2').add(data)
        return jsonify({"id": doc_ref[1].id, "message": "Documento creado con éxito"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 2. Leer documentos desde Firestore
@app.route('/api/data', methods=['GET'])
def get_documents():
    try:
        docs = db.collection('myCollection2').stream()
        results = [{"id": doc.id, **doc.to_dict()} for doc in docs]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 3. Actualizar un documento en Firestore
@app.route('/api/data/<id>', methods=['PUT'])
def update_document(id):
    try:
        data = request.json
        doc_ref = db.collection('myCollection2').document(id)
        doc_ref.update(data)
        return jsonify({"message": "Documento actualizado con éxito"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 4. Eliminar un documento en Firestore
@app.route('/api/data/<id>', methods=['DELETE'])
def delete_document(id):
    try:
        doc_ref = db.collection('myCollection2').document(id)
        doc_ref.delete()
        return jsonify({"message": "Documento eliminado con éxito"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Servidor en puerto 5000
if __name__ == '__main__':
    app.run(debug=True, port=5000)
