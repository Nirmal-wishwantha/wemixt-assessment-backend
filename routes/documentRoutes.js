const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { updateDocument, uploadDocument, deleteDocument, getDocumentsByUserId } = require("../controllers/documentController");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/document");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// **File filter to allow only specific file types**
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only .jpg, .png, and .pdf files are allowed!"), false);
    }
};

// **Set up multer with storage and file filter**
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Routes
router.post("/add", upload.single("document"), uploadDocument);


router.get("/user/:userid", getDocumentsByUserId);


router.delete("/:id", deleteDocument);

// router.get("/user/:userid", getDocumentsByUserId);

router.put("/:id", upload.single("document"), updateDocument);

// router.delete("/:id", deleteDocument);

module.exports = router;
