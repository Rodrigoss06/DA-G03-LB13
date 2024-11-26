
import express from "express";
import admin from "firebase-admin";

// Inicializar Firebase Admin SDK
import serviceAccount from "./ej01-c89e6-firebase-adminsdk-s2a6j-0a9780de20.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ej01-c89e6-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

const app = express();
app.use(express.json());

// Rutas

// 1. Crear un documento en Firestore
app.post("/api/data", async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("myCollection2").add(data);
    res
      .status(201)
      .json({ id: docRef.id, message: "Documento creado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Leer documentos desde Firestore
app.get("/api/data", async (req, res) => {
  try {
    const snapshot = await db.collection("myCollection2").get();
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Actualizar un documento en Firestore
app.put("/api/data/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const docRef = db.collection("myCollection2").doc(id);
    await docRef.update(data);
    res.status(200).json({ message: "Documento actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Eliminar un documento en Firestore
app.delete("/api/data/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("myCollection2").doc(id).delete();
    res.status(200).json({ message: "Documento eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servidor en puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
