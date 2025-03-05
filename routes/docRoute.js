const express = require("express");
const router = express.Router();
const {uploadDocument,uploadUrl,addDocument,getAllDocuments,deleteDocument,updateDocumentPath}= require('../controllers/docController')




// doc uplord local folder
router.post('/documents', uploadDocument.single('documents'), uploadUrl);
//pathadd database
router.post('/add',addDocument);


// get document
router.get('/get/:userId',getAllDocuments)

//delete document
router.delete('/:documentId',deleteDocument)

router.put('/update/:documentId',updateDocumentPath)
module.exports= router;


