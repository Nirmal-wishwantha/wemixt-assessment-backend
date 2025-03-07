const db = require('../database/db');
const path = require('path');
const multer = require('multer');

const port = 3000;

// Document storage configuration
const documentStorage = multer.diskStorage({
    destination: './uploads/document',
    filename: (req, file, cb) => {
        cb(null, `document_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadDocument = multer({ storage: documentStorage });

// Controller method for uploading document
const uploadUrl = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: 'No file uploaded' });
    }

    res.json({
        success: 1,
        document_url: `http://localhost:${port}/uploads/document/${req.file.filename}`
    });
};


const addDocument = async (req, res) => {
    try {
        // Validate input
        const { userId, documentPath, documentName } = req.body;
        if (!userId || !documentPath || !documentName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const sql = "INSERT INTO documents (documentPath, documentName, userId) VALUES (?, ?, ?)";
        
        // Execute query
        const [result] = await db.query(sql, [documentPath, documentName, userId]);

        // Send success response
        res.status(201).json({ message: "Document added successfully", documentId: result.insertId });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Database error occurred" });
    }
};



//get document user id
const getAllDocumentsUser = (req, res) => {

    const { userId } = req.params;
    let query = 'SELECT id, documentPath, userId, documentName, uploadDate FROM documents WHERE userId = ?';

    db.query(query, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ success: 0, message: 'No documents found for this user' });
            }
            res.json({
                success: 1,
                documents: rows
            });
        })
        .catch(err => {
            console.error('Database Error:', err);
            return res.status(500).json({ success: 0, message: 'Database error' });
        });
};

const getAllDocumentsMember = (req, res) => {
    const { userId } = req.params;
    let query = 'SELECT id, documentPath, userId, documentName FROM documents WHERE userId = ?';

    db.query(query, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ success: 0, message: 'No documents found for this user' });
            }
            res.json({
                success: 1,
                documents: rows
            });
        })
        .catch(err => {
            console.error('Database Error:', err);
            return res.status(500).json({ success: 0, message: 'Database error' });
        });
};



const deleteDocument = async (req, res) => {
    const { documentId } = req.params; // Get document ID from request parameters

    try {
        // Query to delete the document from the database
        const result = await db.query('DELETE FROM documents WHERE id = ?', [documentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: 'Document not found' });
        }

        // Respond with success message if deletion is successful
        res.json({
            success: 1,
            message: 'Document deleted successfully'
        });
    } catch (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ success: 0, message: 'Database error' });
    }
};


const updateDocumentPath = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { documentPath, documentName } = req.body;

        if (!documentPath || !documentName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const sql = "UPDATE documents SET documentPath = ?, documentName = ? WHERE id = ?";
        
        const [result] = await db.query(sql, [documentPath, documentName, documentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Document not found" });
        }

        res.status(200).json({ message: "Document updated successfully" });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Database error occurred" });
    }
};




module.exports = { uploadDocument, uploadUrl, addDocument, getAllDocumentsUser, deleteDocument, updateDocumentPath, getAllDocumentsMember };
