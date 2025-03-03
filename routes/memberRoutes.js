const express = require("express");
const router = express.Router();
const { addMember, getMemberById, getMembers, deleteMember, updateMember,upload } = require("../controllers/memberController");

router.post('/add', upload.single('profilePicture'), addMember);

router.get('/all', getMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;
