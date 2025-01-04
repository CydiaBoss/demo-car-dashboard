-- Table contains settings of the motor
CREATE TABLE IF NOT EXISTS MotorSettings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    MotorSpeed SMALLINT(1),
    ChargeMode BOOLEAN
);