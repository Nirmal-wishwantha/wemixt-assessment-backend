const express = require("express");
const router = express.Router();
const {uploadDocument,uploadUrl,addDocument,getAllDocumentsUser,deleteDocument,updateDocumentPath}= require('../controllers/userDocumentController')

//user document
// url
router.post('/upload', uploadDocument.single('documents'), uploadUrl);
// path strore
router.post('/add',addDocument);
router.get('/:userId',getAllDocumentsUser)
router.delete('/:documentId',deleteDocument)
router.put('/:documentId',updateDocumentPath)

module.exports= router;