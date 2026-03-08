CREATE DATABASE mystay_db;
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Stored as a hash
    role ENUM('landlord', 'student', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Boarding_Listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    landlord_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_landlord FOREIGN KEY (landlord_id) 
        REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Booking_Requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    listing_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student FOREIGN KEY (student_id) 
        REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_listing FOREIGN KEY (listing_id) 
        REFERENCES Boarding_Listings(listing_id) ON DELETE CASCADE
);
