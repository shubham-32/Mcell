import { createConnection } from "mysql2";
import dotenv from "dotenv";

dotenv.config()

const connection = createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  timezone: "+05:30",
  ssl: {
    rejectUnauthorized: false
  }
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL Connected!");
});

export default connection;
