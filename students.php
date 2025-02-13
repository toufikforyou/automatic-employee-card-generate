<?php
header('Content-Type: text/html; charset=utf-8');
include './src/database/config.php';

$conn = getDbConnection();
$students = [];

function sendRemoteLog($message, $context = []) {
    // Implement remote logging service integration here
    error_log($message . " - " . json_encode($context));
}

function convertToUnicode($text) {
    $ch = curl_init();
    $apiUrl = 'https://banglalikhi.com/api/unicode';
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $apiUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode(['text' => $text]),
        CURLOPT_TIMEOUT => 5,
        CURLOPT_SSL_VERIFYPEER => true
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($error) {
        sendRemoteLog('CURL Error', ['error' => $error, 'text' => $text]);
        return $text;
    }

    if ($statusCode !== 200) {
        sendRemoteLog('API Error', ['status' => $statusCode, 'response' => $response]);
        return $text;
    }

    $data = json_decode($response, true);
    
    if (!isset($data['data'])) {
        sendRemoteLog('Invalid API Response', ['response' => $response]);
        return $text;
    }

    return $data['data'];
}

try {
    if (isset($_GET['id']) && is_numeric($_GET['id'])) {
        $stmt = $conn->prepare("SELECT * FROM students WHERE id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $students = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        $nextId = null;
        if (isset($_GET['id'])) {
            $currentId = (int)$_GET['id'];
            $stmt = $conn->prepare("SELECT id FROM students WHERE id > ? ORDER BY id ASC LIMIT 1");
            $stmt->bind_param("i", $currentId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($row = $result->fetch_assoc()) {
                $nextId = $row['id'];
            }
            $stmt->close();
        }

        $previousId = null;
        if (isset($_GET['id'])) {
            $currentId = (int)$_GET['id'];
            $stmt = $conn->prepare("SELECT id FROM students WHERE id < ? ORDER BY id DESC LIMIT 1");
            $stmt->bind_param("i", $currentId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($row = $result->fetch_assoc()) {
                $previousId = $row['id'];
            }
            $stmt->close();
        }
    } else {
        header('Location: ./');
        exit;
    }

    foreach ($students as &$student) {
        $student['roll'] = ($student['roll'] < 10 ? '0' . $student['roll'] : $student['roll']);
        $student['validupto'] = convertToUnicode($student['validupto']);
        $student['mobile'] = convertToUnicode($student['mobile']);
    }

    $encodedData = json_encode($students, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!$encodedData) throw new Exception('JSON encoding failed: ' . json_last_error_msg());

} catch (Exception $e) {
    sendRemoteLog('System Error', ['error' => $e->getMessage()]);
    die("System error. Please try again later.");
}
?>

<!DOCTYPE html>
<html lang="bn">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>স্বয়ংক্রিয় আইডি কার্ড জেনারেটর</title>
    <link rel="stylesheet" href="./css/style.css">
    <style>
    #id-card-canvas {
        max-width: 100%;
        height: auto;
        display: none;
    }
    </style>
</head>

<body>
    <?php if (!empty($students)): ?>
    <div class="card-container">
        <div class="button-group">
            <?php if ($previousId): ?>
            <a href="students.php?id=<?= $previousId ?>" class="action-btn prev-btn">
                ← পূর্ববর্তী
            </a>
            <?php endif; ?>

            <button class="action-btn download-btn" onclick="downloadCard()">
                ডাউনলোড আইডি কার্ড
            </button>

            <?php if ($nextId): ?>
            <a href="students.php?id=<?= $nextId ?>" class="action-btn next-btn">
                পরবর্তী →
            </a>
            <?php endif; ?>
        </div>
        <div class="button-group">
            <button class="action-btn prev-btn" onclick="window.location.href='./'">
                শিক্ষার্থী যোগ করুন
            </button>
        </div>

        <div class="canvas-wrapper">
            <canvas id="id-card-canvas"></canvas>
        </div>
    </div>

    <div id="students-data" data-students='<?= htmlspecialchars($encodedData, ENT_QUOTES) ?>'></div>

    <script src="./js/base64-image.js"></script>
    <script src="./js/canvas-card.js"></script>
    <script>
    document.fonts.ready.then(async () => {
        const canvas = document.getElementById('id-card-canvas');
        const cardGenerator = new IDCardGenerator(canvas);
        const studentsData = JSON.parse(document.getElementById('students-data').dataset.students);

        if (studentsData.length) {
            await cardGenerator.generateCard(studentsData[0]);
            canvas.style.display = 'block';
        }
    });

    function downloadCard() {
        const btn = document.querySelector('.download-btn');
        btn.classList.add('button-loading');
        btn.innerHTML = 'ডাউনলোড হচ্ছে...';

        setTimeout(() => {
            try {
                const canvas = document.getElementById('id-card-canvas');
                const link = document.createElement('a');
                link.download = 'student-id-card.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error('Download failed:', error);
            }
            btn.classList.remove('button-loading');
            btn.innerHTML = 'ডাউনলোড আইডি কার্ড';
        }, 500);
    }
    </script>
    <?php else: ?>
    <p>কোন শিক্ষার্থী পাওয়া যায়নি।</p>
    <?php endif; ?>
</body>

</html>