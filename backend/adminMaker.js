import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

import pool from "./db.js";

const admins = [/* NOT hardcoding admins for safety, admins.json has the details and THIS CODE WILL NOT RUN PROPERLY FOR DEMO PURPOSES, to run please make a proper json of admins*/];
const SALT_ROUNDS = 10;

async function createAdmins() {
  try {
    for (const admin of admins) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(admin.password, SALT_ROUNDS);

      // Insert into database
      const query = `
        INSERT INTO admins (username, hashed_password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
      `;
      await pool.query(query, [admin.username, hashedPassword]);

      console.log(`✅ Admin created: ${admin.username}`);
    }

    console.log("All admins processed.");
  } catch (err) {
    console.error("Error creating admins:", err);
  } finally {
    await pool.end(); // close DB connection
  }
}

// Run the script
createAdmins();