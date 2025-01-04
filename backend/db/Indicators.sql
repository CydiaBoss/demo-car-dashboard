-- Table contains indicator status of the motor
CREATE TABLE IF NOT EXISTS Indicators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ParkingBreak BOOLEAN,
    CheckEngine BOOLEAN,
    MotorStatus BOOLEAN,
    LowBattery BOOLEAN
);