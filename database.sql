CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('freelancer', 'employer'))
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    deadline DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proposals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    cover_letter TEXT NOT NULL,
    proposed_budget DECIMAL(10,2) NOT NULL,
    timeline_days INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    proposal_id INT NOT NULL,
    employer_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    funded_at DATETIME NULL,
    delivered_at DATETIME NULL,
    released_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS escrow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'funded',
    receipt_number VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    recipient_id INT NULL,
    payment_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reference VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS disputes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    opened_by INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (opened_by) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,

    contract_id INT NOT NULL,
    employer_id INT NOT NULL,
    freelancer_id INT NOT NULL,

    rating TINYINT NOT NULL,
    comment TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_contract
        FOREIGN KEY (contract_id) REFERENCES contracts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_employer
        FOREIGN KEY (employer_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_freelancer
        FOREIGN KEY (freelancer_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_rating
        CHECK (rating BETWEEN 1 AND 5),

    UNIQUE (contract_id)
);