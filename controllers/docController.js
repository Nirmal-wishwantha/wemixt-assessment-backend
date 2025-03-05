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

const addDocument = (req, res) => {
    const { userId, filename, documentName } = req.body; // Extract userId, filename, and documentName from the request body

    // Ensure both userId and filename are provided
    if (!userId || !filename) {
        return res.status(400).json({ success: 0, message: 'Missing required fields' });
    }

    // Set a default document name if not provided
    const name = documentName || filename.split('/').pop(); // Use the file name if documentName is not provided
    const uploadDate = new Date(); // Set current date and time as upload date

    // Insert the document details into the database
    db.query(
        'INSERT INTO documents (documentPath, user_id, documentName, uploadDate) VALUES (?, ?, ?, ?)',
        [filename, userId, name, uploadDate],
        (err, result) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ success: 0, message: 'Database error' });
            }

            // Return success response with the inserted document ID
            res.json({
                success: 1,
                message: 'Document added successfully',
                document_id: result.insertId,
            });
        }
    );
};




const getAllDocuments = (req, res) => {
    // Extract userId from request parameters
    const { userId } = req.params; // userId will now come from the URL params

    let query = 'SELECT id, documentPath, user_id, documentName, uploadDate FROM documents WHERE user_id = ?';
    
    // Query to fetch documents for a specific user
    db.query(query, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ success: 0, message: 'No documents found for this user' });
            }
            res.json({
                success: 1,
                documents: rows // Return documents for the specified user
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
    const { documentId } = req.params;
    const { filename, documentName } = req.body;

    console.log('Received documentId:', documentId);
    console.log('Received filename:', filename);
    console.log('Received documentName:', documentName);

    if (!filename) {
        return res.status(400).json({ success: 0, message: 'Missing required field: filename' });
    }

    // Set the documentName to the provided value or retain the current name if not provided
    const name = documentName || filename.split('/').pop(); // Use the filename if documentName is not provided
    const uploadDate = new Date();

    try {
        // Query to update the document path, documentName, and uploadDate in the database
        const result = await db.query(
            'UPDATE documents SET documentPath = ?, documentName = ?, uploadDate = ? WHERE id = ?',
            [filename, name, uploadDate, documentId]
        );

        console.log('Update result:', result); // Log the result for debugging

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: 0, message: 'Document not found' });
        }

        // Respond with success message if the update is successful
        res.json({
            success: 1,
            message: 'Document path updated successfully'
        });
    } catch (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ success: 0, message: 'Database error' });
    }
};



module.exports = { uploadDocument, uploadUrl, addDocument ,getAllDocuments,deleteDocument,updateDocumentPath};
