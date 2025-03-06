const db = require("../database/db"); // Import database connection
const path = require("path");
const multer = require('multer');

const port = 3000;

// Document storage configuration  profile imag
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


const addMember = (req, res) => {
    const { fullName, email, phoneNumber, address, dateOfBirth, gender, bio, profilePicture } = req.body;

    console.log("Request received: ", req.body);  // Log incoming request

    // Check if all fields are present
    if (!fullName || !email || !phoneNumber || !address || !dateOfBirth || !gender || !bio || !profilePicture) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // SQL query to insert the member into the database
    const sql = "INSERT INTO members (fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    console.log("Running SQL query...");  // Log before query is executed

    // Database query execution
    db.query(sql, [fullName, email, phoneNumber, address, profilePicture, dateOfBirth, gender, bio], (err, result) => {
        console.log("Inside query callback...");  // Log inside the callback function

        if (err) {
            console.error("Database error: ", err);  // Log the error to the server console
            return res.status(500).json({ error: "Database error occurred" });  // Send a response for errors
        }

        // Log success and response details
        console.log("Data inserted successfully, memberId: ", result.insertId);

        // If the query is successful, send the response with the member ID
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
  console.log(fullName);

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
      await db.query("DELETE FROM members WHERE id=?", [id]);

      res.json({ message: "Member deleted successfully" });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }

};

module.exports = { addMember, getMembers, deleteMember, updateMember,uploadProfile ,uploadUrl};
