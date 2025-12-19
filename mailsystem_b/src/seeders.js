const pool = require("./db")


const desiredTables = ["roles", "users", "hostels", "services", "reviews", "replies", "floors", "rooms", "emails", "schedueled_emails", "hostel_users", "invitations", "email_users", "schedueled_email_users", "users_rooms"]

const schemas = {
    roles: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role VARCHAR(255)
        ) ENGINE=InnoDB
    `,

    users: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            account_type ENUM('owner', 'customer')
            
        ) ENGINE=InnoDB
    `,

    hostels:`
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE,
            location VARCHAR(255),
            description TEXT,
            photo TEXT,
            type ENUM('boys', 'girls', 'mixed'),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB
    `,

    services: `(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            hostel_id INT,
            FOREIGN KEY (hostel_id) REFERENCES hostels(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
        ) ENGINE=InnoDB
    `,

    reviews: `(
            id INT AUTO_INCREMENT PRIMARY KEY,
            description TEXT,
            hostel_id INT,
            FOREIGN KEY (hostel_id) REFERENCES hostels(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            UNIQUE(hostel_id, user_id)
        ) ENGINE=InnoDB
    `,

    replies: `(
            id INT AUTO_INCREMENT PRIMARY KEY,
            description TEXT,
            review_id INT,
            FOREIGN KEY (review_id) REFERENCES reviews(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            admin_id INT,
            FOREIGN KEY (admin_id) REFERENCES users(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            UNIQUE(review_id, admin_id)
        ) ENGINE=InnoDB
    `,

    floors: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            number INT,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            hostel_id INT,
            UNIQUE(hostel_id, number)
        ) ENGINE=InnoDB
    `,

    rooms: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            number INT,
            seats INT,
            status VARCHAR(255) DEFAULT 'Available',
            floor_id INT,
            FOREIGN KEY (floor_id) REFERENCES floors(id)
            ON UPDATE CASCADE,
            UNIQUE(floor_id, number)
        ) ENGINE=InnoDB
    `,

    emails: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject VARCHAR(255),
            body TEXT,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            admin_id INT,
            FOREIGN KEY (admin_id) REFERENCES users(id)
        ) ENGINE=InnoDB
    `,

    schedueled_emails: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject VARCHAR(255),
            body TEXT,
            status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
            type ENUM('monthly', 'weekly', 'yearly'),
            schedueled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            day VARCHAR(25) DEFAULT NULL,
            date INT DEFAULT NULL,
            month VARCHAR(255) DEFAULT NULL,
            send_once DATETIME,
            app_password TEXT,
            admin_email VARCHAR(255),
            admin_id INT,
            FOREIGN KEY (admin_id) REFERENCES users(id)
        ) ENGINE=InnoDB
    `,

    hostel_users: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            phone_no VARCHAR(11),
            hostel_id INT,
            user_id INT,
            role_id INT,
            status ENUM('pending', 'active', 'inactive') DEFAULT 'pending',
            FOREIGN KEY (hostel_id) REFERENCES hostels(id)
                ON UPDATE CASCADE 
                ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id)
                ON UPDATE CASCADE 
                ON DELETE CASCADE,
            FOREIGN KEY (role_id) REFERENCES roles(id)
                ON UPDATE CASCADE 
                ON DELETE CASCADE,
            UNIQUE(hostel_id, user_id)
        ) ENGINE=InnoDB
    `,

    invitations: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            token VARCHAR(255) NOT NULL UNIQUE,
            user_id INT,
            hostel_id INT,
            role_id INT,
            expiry TIMESTAMP,
            FOREIGN KEY (user_id) references users(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            FOREIGN KEY (hostel_id) references hostels(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
            FOREIGN KEY (role_id) references roles(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
        )
    `,

    email_users: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            email_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
                ON UPDATE CASCADE 
                ON DELETE CASCADE,
            FOREIGN KEY (email_id) REFERENCES emails(id)
                ON UPDATE CASCADE 
                ON DELETE CASCADE
        ) ENGINE=InnoDB
    `,

    schedueled_email_users: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            email_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
                ON UPDATE CASCADE 
                ON DELETE CASCADE,
            FOREIGN KEY (email_id) REFERENCES schedueled_emails(id)
                ON UPDATE CASCADE 
                ON DELETE CASCADE
        ) ENGINE=InnoDB
    `,

     users_rooms: `
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            room_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
        ) ENGINE=InnoDB
    `
};

const roles = [["admin"], ["manager"], ["staff"], ["resident"]]

const seeder  = async()=>{
    try {
        for(const table of desiredTables){
            await pool.query(`CREATE TABLE IF NOT EXISTS ${table} ${schemas[table]}`)
            if(table === "roles"){
                const [rows] = await pool.query("SELECT COUNT(*) AS count FROM roles");

                if (rows[0].count === 0) {
                    await pool.query("INSERT INTO roles (role) VALUES ?", [roles]);
                    console.log("Roles seeded");
                }
            }
        }
        console.log("Tables initialized successfully")
    } catch (error) {
        console.log("Error in seeder : " + error.message)
    }
}

module.exports = seeder