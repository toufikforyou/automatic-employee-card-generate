<?php

include './src/database/config.php';

$conn = getDbConnection();
$conn->set_charset("utf8mb4");

$students = [];

if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = $_GET['id'];

    $stmt = $conn->prepare("SELECT * FROM students WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $students[] = $row;
    } else {
        $students = [];
    }

    $stmt->close();
} else {
    $query = "SELECT * FROM students";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
    }
}

$encodedData = json_encode($students, JSON_UNESCAPED_UNICODE);
if ($encodedData === false) {
    echo "JSON Encoding error: " . json_last_error_msg();
    exit;
}


?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Automatic ID Card Generator App</title>
    <link rel="stylesheet" href="./css/style.css" />
</head>

<body>
    <?php if (count($students) === 0): ?>
        <p>No students found.</p>
    <?php else: ?>
        <iframe src="" frameborder="0" id="id-card-preview" title="Automatic ID Card Generator Preview"></iframe>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <script src="./js/base64-image.js"></script>
        <script src="./js/functions.js"></script>
        <script src="./js/app.js"></script>

        <div id="students-data" data-students='<?php echo $encodedData; ?>'></div>


        <script type="text/javascript">
            var studentsData = null;
            var studentsDataAttr = document.getElementById("students-data").getAttribute("data-students");

            if (studentsDataAttr) {
                try {
                    studentsData = JSON.parse(studentsDataAttr);
                } catch (e) {
                    console.error("Failed to parse JSON:", e);
                }
            }

            if (!studentsData) {
                console.log("No valid students data found.");
            } else {
                if (studentsData.length > 0) {
                    generateIdCard(studentsData);
                } else {
                    console.log("No students available.");
                }
            }
        </script>
    <?php endif; ?>
</body>

</html>