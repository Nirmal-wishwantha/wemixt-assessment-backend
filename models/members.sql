CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(225),
  email VARCHAR(225),
  phoneNumber VARCHAR(12),
  address TEXT,
  dateOfBirth DATE,
  gender VARCHAR(10),
  bio TEXT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
