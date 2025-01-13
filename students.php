<?php

include './src/database/config.php';

$conn = getDbConnection();

$students = [];

if (isset($_GET['id']) && is_numeric($_GET['id'])) {

    $id = $_GET['id'];

    $stmt = $conn->prepare("SELECT id, fullname, stdclass, roll, father, `address`, mobile, `profile`, `validupto` FROM students WHERE id = ?");

    $stmt->bind_param("i", $id);
    $stmt->execute();

    $stmt->bind_result($id, $fullname, $stdclass, $roll, $father, $address, $mobile, $profile, $validupto);

    if ($stmt->fetch()) {
        $students[] = [
            "id" => $id,
            "fullname" => $fullname,
            "stdclass" => $stdclass,
            "roll" => $roll,
            "father" => $father,
            "address" => $address,
            "mobile" => $mobile,
            "profile" => $profile,
            "validupto" => $validupto
        ];
    } else {
        $students = [];
    }

    $stmt->close();
    $conn->close();
} else {

    $query = "SELECT id, fullname, stdclass, roll, father,validupto, address, mobile, profile FROM students";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
    }

    $conn->close();
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

        <div id="students-data" data-students='<?php echo json_encode($students); ?>'></div>

        <script type="text/javascript">
            var studentsData = JSON.parse(
                document.getElementById("students-data").getAttribute("data-students")
            );

            // console.log(studentsData);

            if (studentsData && studentsData.length > 0) {
                generateIdCard(studentsData);
            }
        </script>
    <?php endif; ?>
</body>

</html>