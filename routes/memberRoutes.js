const express = require("express");
const router = express.Router();

const { addMember, getMembers, deleteMember, updateMember,uploadProfile,uploadUrl } = require("../controllers/memberController");


// Routes
router.post("/add", addMember);

//profile pic
router.post("/profilePicture", uploadProfile.single("profilePicture"),uploadUrl);


router.get("/all", getMembers);
router.put("/:id",updateMember);

router.delete("/:id", deleteMember);

module.exports = router;
