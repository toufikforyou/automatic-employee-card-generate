const mysql = require("mysql2/promise");
const dbConfig = require("../database/db");

const pool = mysql.createPool(dbConfig);

const allStudentCardController = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [allStudents] = await connection.execute("SELECT * FROM students");

    if (allStudents.length <= 0) {
      throw new Error("Student not found!");
    }

    await connection.commit();
    res.status(200).render("index", {
      students: allStudents,
      message: "Student records fetched successfully",
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = allStudentCardController;
