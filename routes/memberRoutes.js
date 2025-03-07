const express = require("express");
const router = express.Router();

const { addMember, getMembers, deleteMember, updateMember,uploadProfile,uploadUrl } = require("../controllers/memberController");


// Routes
router.post("/add/:userId", addMember);
//profile pic
router.post("/profilePicture", uploadProfile.single("profilePicture"),uploadUrl);
router.get("/all", getMembers);
router.put("/:id",updateMember);
router.delete("/:id", deleteMember);

// documents
//path add member id document database
// router.post('/add',addDocument);
// get document member Id
// router.get('/get/:memberId',getAllDocumentMember)

module.exports = router;
