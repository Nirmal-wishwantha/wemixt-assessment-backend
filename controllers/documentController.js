const db = require("../database/db"); // Database connection
const fs = require("fs");
const path = require("path");

// 📌 Upload Document
const uploadDocument = (req, res) => {
    const { user_id } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract only the filename from the uploaded file
    const documentFilename = req.file.filename;  

    // Save only the filename in the database
    const sql = "INSERT INTO documents (documentPath, user_id) VALUES (?, ?)";
    db.query(sql, [documentFilename, user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Document uploaded successfully", documentId: result.insertId, filename: documentFilename });
    });
};



//user id
const getDocumentsByUserId = (req, res) => {
    const { userid } = req.params;

    console.log("Received user ID:", userid); // Debugging line

    const sql = "SELECT * FROM documents WHERE user_id = ?";
    
    db.query(sql, [userid], (err, results) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        console.log("Query results:", results); // Debugging line
        
        if (results.length === 0) {
            return res.status(404).json({ message: "No documents found for this user" });
        }

        // Modify the path to be accessible via HTTP
        results.forEach(doc => {
            const documentUrl = doc.documentPath.replace("F:\\01.  Assessment\\backend", "http://localhost:3000");
            doc.documentPath = documentUrl; // Update the document path to be accessible via URL
        });

        res.json(results);
    });
};





// 📌 Update Document
const updateDocument = (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    // Fetch old document path
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



// 📌 Delete Document
const deleteDocument = (req, res) => {
    const { id } = req.params;

    // Fetch document path before deleting
    db.query("SELECT documentPath FROM documents WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Document not found" });

        const filePath = results[0].documentPath;

        // Delete document from the database
        db.query("DELETE FROM documents WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Document not found" });

            // Delete the actual file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            res.json({ message: "Document deleted successfully" });
        });
    });
};

module.exports = { uploadDocument, updateDocument, deleteDocument, getDocumentsByUserId };
