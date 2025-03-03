const db = require("../database/db");
const multer = require('multer');
const path = require('path');


// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/'); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append extension
  }
});

// Initialize multer
const upload = multer({ storage: storage });

// Add a member
const addMember = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address, dateOfBirth, gender, bio } = req.body;
    const profilePicture = req.file ? req.file.path : null; // Get the path of the uploaded file

    // Validate input
    if (!fullName || !email) {
      return res.status(400).json({ message: "Please provide required fields" });
    }

    const query = "INSERT INTO members (fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(query, [fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Email or phone number already exists" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Member added successfully", memberId: result.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





// Get all members
const getMembers = (req, res) => {
  const query = "SELECT * FROM members";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Get member by ID
const getMemberById = (req, res) => {
  const query = "SELECT * FROM members WHERE id = ?";

  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(result[0]);
  });
};

// Update member
const updateMember = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio } = req.body;

    // Validate input
    if (!fullName || !email) {
      return res.status(400).json({ message: "Please provide required fields" });
    }

    const query = "UPDATE members SET fullName = ?, email = ?, phoneNumber = ?, address = ?, profilePicture = ?, dateOfBirth = ?, gender = ?, bio = ? WHERE id = ?";

    db.query(query, [fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio, req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.status(200).json({ message: "Member updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete member
const deleteMember = (req, res) => {
  const query = "DELETE FROM members WHERE id = ?";

  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  });
};

module.exports = {
  deleteMember,
  updateMember,
  getMemberById,
  getMembers,
  addMember,
  upload
};
