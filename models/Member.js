// CREATE TABLE users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   fullName VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL UNIQUE CHECK (email LIKE '%@gmail.com'),
//   password VARCHAR(255) NOT NULL,
//   phoneNumber VARCHAR(12) UNIQUE CHECK (phoneNumber REGEXP '^\+947[0-9]{8}$'),
//   address TEXT,
//   profilePicture VARCHAR(255),
//   dateOfBirth DATE,
//   gender ENUM('Male', 'Female', 'Other'),
//   bio VARCHAR(200),
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
