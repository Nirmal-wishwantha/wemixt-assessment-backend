const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { addMember, getMembers, deleteMember, updateMember } = require("../controllers/memberController");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const imageStorage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadImage = multer({ storage: imageStorage });

// Routes
router.post("/add", uploadImage.single("profilePicture"), addMember);
router.get("/all", getMembers);
router.put("/:id", uploadImage.single("profilePicture"), updateMember);
router.delete("/:id", deleteMember);

module.exports = router;
