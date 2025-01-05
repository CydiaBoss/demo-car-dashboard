-- Table contains data of the motor
CREATE TABLE IF NOT EXISTS MotorData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    GearRatio CHAR(16),
    BatteryLevel FLOAT(6),
    BatteryTemp FLOAT(6),
    MotorSpeed FLOAT(6),
    MotorPower FLOAT(6)
);