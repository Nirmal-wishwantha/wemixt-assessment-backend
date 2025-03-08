
const express = require("express");
const router = express.Router();

const { addMember, getMembers, deleteMember, updateMember,uploadProfile,uploadUrl } = require("../controllers/memberController");

router.post("/add/:userId", addMember);

router.post("/profilePicture", uploadProfile.single("profilePicture"),uploadUrl);


router.get("/:user_id", getMembers);
router.put("/:id",updateMember);
router.delete("/:id", deleteMember);


module.exports = router;
