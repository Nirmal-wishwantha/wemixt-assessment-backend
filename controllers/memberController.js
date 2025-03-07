const db = require("../database/db"); // Import database connection
const path = require("path");
const multer = require('multer');
const fs = require("fs");

const port = 3000;

// Document storage configuration for profile images
const ProfileStorage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
        cb(null, `images_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadProfile = multer({ storage: ProfileStorage });

// Controller method for uploading profile image
const uploadUrl = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: 'No file uploaded' });
    }

    res.json({
        success: 1,
        document_url: `http://localhost:${port}/uploads/images/${req.file.filename}`
    });
};

// Add Member
const addMember = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { fullName, email, phoneNumber, address, dateOfBirth, gender, bio, profilePicture } = req.body;

        // SQL query to insert the member into the database
        const sql = "INSERT INTO members (fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // Execute the SQL query
        const [result] = await db.query(sql, [fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio, userId]);

        res.status(201).json({ message: "Member added successfully", memberId: result.insertId });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Database error occurred" });
    }
};

// Get Members
const getMembers = async (req, res) => {
    const { user_id } = req.params; // Get user_id from URL parameters

    try {
        const [results] = await db.query("SELECT * FROM members WHERE user_id = ?", [user_id]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: "No members found for this user." });
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update Member (including profile picture)
const updateMember = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber, address, dateOfBirth, gender, bio } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    try {
        let sql;
        let values;

        if (profilePicture) {
            // Retrieve old profile picture
            const [oldProfile] = await db.query("SELECT profilePicture FROM members WHERE id=?", [id]);

            if (oldProfile.length > 0 && oldProfile[0].profilePicture) {
                const oldFilePath = path.join(__dirname, "../uploads/images", oldProfile[0].profilePicture);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error("Error deleting old profile picture:", err);
                });
            }

            sql = `UPDATE members SET fullName=?, email=?, phoneNumber=?, address=?, profilePicture=?, dateOfBirth=?, gender=?, bio=? WHERE id=?`;
            values = [fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio, id];
        } else {
            sql = `UPDATE members SET fullName=?, email=?, phoneNumber=?, address=?, dateOfBirth=?, gender=?, bio=? WHERE id=?`;
            values = [fullName, email, phoneNumber, address, dateOfBirth, gender, bio, id];
        }

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Member not found" });
        }

        res.json({ message: "Member updated successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const deleteMember = async (req, res) => {
    const { id } = req.params;
    try {
       
        const [member] = await db.query("SELECT profilePicture FROM members WHERE id=?", [id]);

        if (member.length > 0 && member[0].profilePicture) {
            const filePath = path.join(__dirname, "../uploads/images", member[0].profilePicture);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting profile picture:", err);
            });
        }

        await db.query("DELETE FROM members WHERE id=?", [id]);

        res.json({ message: "Member deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addMember, getMembers, deleteMember, updateMember, uploadProfile, uploadUrl };
