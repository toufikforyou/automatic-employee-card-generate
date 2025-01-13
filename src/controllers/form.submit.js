const mysql = require("mysql2/promise");
const dbConfig = require("../database/db");
const fs = require("fs").promises;

const pool = mysql.createPool(dbConfig);

const formHandlerController = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { fullname, stdclass, roll, father, address, mobile, validupto } =
      req.body;
    const profileImage = req.fileInfo.filename;

    await connection.beginTransaction();

    const [existingStudents] = await connection.execute(
      "SELECT id FROM students WHERE mobile = ?",
      [mobile]
    );

    if (existingStudents.length > 0) {
      throw new Error("Student already registered!");
    }

    // Insert new student
    const [result] = await connection.execute(
      `INSERT INTO students (
        fullname, 
        stdclass, 
        roll, 
        father, 
        address, 
        mobile, 
        validupto, 
        profileImage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullname,
        stdclass,
        roll,
        father,
        address,
        mobile,
        validupto,
        profileImage,
      ]
    );

    const [newStudent] = await connection.execute(
      "SELECT * FROM students WHERE id = ?",
      [result.insertId]
    );

    await connection.commit();

    res.status(201).json({
      status: "success",
      message: "Student record created successfully",
      data: newStudent[0],
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    if (req.fileInfo && req.fileInfo.path) {
      try {
        await fs.unlink(req.fileInfo.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    console.error("Operation failed:", error);

    res.status(400).json({
      status: "error",
      message: error.message || "Database operation failed",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = formHandlerController;
