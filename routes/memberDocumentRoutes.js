const express = require("express");
const router = express.Router();
const {uploadDocument,uploadUrl,addDocument,getAllDocumentsUser,deleteDocument,updateDocumentPath}= require('../controllers/memberDocumentController')


//member
//url
router.post('/upload', uploadDocument.single('documents'), uploadUrl);

router.post('/add',addDocument);
router.get('/:memberId',getAllDocumentsUser)
router.delete('/:documentId',deleteDocument)
router.put('/:documentId',updateDocumentPath)

module.exports= router;