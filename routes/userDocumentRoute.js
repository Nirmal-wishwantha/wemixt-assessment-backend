const express = require("express");
const router = express.Router();
const {uploadDocument,uploadUrl,addDocument,getAllDocumentsUser,deleteDocument,updateDocumentPath}= require('../controllers/userDocumentController')


//user
router.post('/add',addDocument);
router.get('/get/:userId',getAllDocumentsUser)
router.post('/document', uploadDocument.single('documents'), uploadUrl);
router.delete('/:documentId',deleteDocument)
router.put('/update/:documentId',updateDocumentPath)

module.exports= router;