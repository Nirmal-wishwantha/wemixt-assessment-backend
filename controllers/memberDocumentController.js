const db = require('../database/db');
const path = require('path');
const multer = require('multer');

const port = 3000;

//Member Document storage configuration
const documentStorage = multer.diskStorage({
    destination: './uploads/document',
    filename: (req, file, cb) => {
        cb(null, `document_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadDocument = multer({ storage: documentStorage });

// Controller Member uploading document
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
        const { memberId, documentPath, documentName } = req.body;
        if (!memberId || !documentPath || !documentName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const sql = "INSERT INTO documents (documentPath, documentName, memberId) VALUES (?, ?, ?)";
        
        const [result] = await db.query(sql, [documentPath, documentName, memberId]);

        res.status(201).json({ message: "Document added successfully", documentId: result.insertId });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Database error occurred" });
    }
};



//get document member id
const getAllDocumentsUser = (req, res) => {
    const { memberId } = req.params;
    let query = 'SELECT id, documentPath, memberId, documentName, uploadDate FROM documents WHERE memberId = ?';

    db.query(query, [memberId])
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

//get document user
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


//delete doc
const deleteDocument = async (req, res) => {
    const { documentId } = req.params; 
    try {
        const result = await db.query('DELETE FROM documents WHERE id = ?', [documentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: 'Document not found' });
        }

        res.json({
            success: 1,
            message: 'Document deleted successfully'
        });
    } catch (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ success: 0, message: 'Database error' });
    }
};

// update doc
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
