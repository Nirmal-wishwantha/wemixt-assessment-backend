const db = require("../database/db"); // Database connection
const fs = require("fs");
const path = require("path");

// 📌 Upload Document
const uploadDocument = (req, res) => {
    const { user_id } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

   
    const documentFilename = req.file.filename;  

   
    const sql = "INSERT INTO documents (documentPath, user_id) VALUES (?, ?)";
    db.query(sql, [documentFilename, user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Document uploaded successfully", documentId: result.insertId, filename: documentFilename });
    });
};


const getDocumentsByUserId = (req, res) => {
    const { userid } = req.params;

    if (!userid || isNaN(parseInt(userid))) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    const sql = "SELECT id, documentPath, user_id FROM documents WHERE user_id = ?";

    db.query(sql, [userid], (err, results) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No documents found for this user" });
        }

        const updatedResults = results.map(doc => {
            let documentUrl;
            if (doc.documentPath.startsWith("F:\\")) {
                // Ensure to replace file path for local file system
                documentUrl = doc.documentPath.replace("F:\\01.  Assessment\\backend", "http://localhost:3000");
            } else {
                // This is assuming documents are uploaded to the server in a 'uploads/document' folder
                documentUrl = `http://localhost:3000/uploads/document/${doc.documentPath}`;
            }

            return {
                document_id: doc.id,
                user_id: doc.user_id,
                file_name: doc.documentPath.split("\\").pop(),
                file_path: documentUrl
            };
        });

        res.json(updatedResults);
    });
};




// 📌 Update Document
const updateDocument = (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    
    db.query("SELECT documentPath FROM documents WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Document not found" });

        let sql = "UPDATE documents SET user_id = ? WHERE id = ?";
        let values = [user_id, id];

        if (req.file) {
            const oldFilePath = results[0].documentPath;
            const newDocumentPath = req.file.path;

            // Delete the old file
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            sql = "UPDATE documents SET documentPath = ?, user_id = ? WHERE id = ?";
            values = [newDocumentPath, user_id, id];
        }

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Document not found" });

            res.json({ message: "Document updated successfully" });
        });
    });
};





const deleteDocument = (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid document ID" });
    }

    db.query("DELETE FROM documents WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Document not found" });
        }

        res.json({ message: "Document deleted successfully from database" });
    });
};




module.exports = { uploadDocument, updateDocument, deleteDocument, getDocumentsByUserId };
