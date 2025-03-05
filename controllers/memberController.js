const db = require("../database/db"); // Import database connection
const path = require("path");
const fs = require("fs");

// Add Member
const addMember = (req, res) => {
    const { fullName, email, phoneNumber, address, dateOfBirth, gender, bio } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    const sql = "INSERT INTO members (fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Member added successfully", memberId: result.insertId });
    });
};



// Get Members
const getMembers = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM members");
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

// Delete Member
const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
      
      const [results] = await db.query("SELECT profilePicture FROM members WHERE id=?", [id]);

      if (results.length > 0 && results[0].profilePicture) {
          const filePath = path.join(__dirname, "../uploads/images", results[0].profilePicture);

          
          fs.unlink(filePath, (err) => {
              if (err) console.error("Error deleting file:", err);
          });
      }

      
      await db.query("DELETE FROM members WHERE id=?", [id]);

      res.json({ message: "Member deleted successfully" });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

module.exports = { addMember, getMembers, deleteMember, updateMember };
