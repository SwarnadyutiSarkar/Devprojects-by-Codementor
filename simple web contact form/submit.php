<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $issue = htmlspecialchars($_POST['issue']);
    $comment = htmlspecialchars($_POST['comment']);
} else {
    header("Location: index.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group p {
            margin: 0;
        }
        button {
            padding: 10px 15px;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Form Submission</h2>
        <div class="form-group">
            <label>Name:</label>
            <p><?php echo $name; ?></p>
        </div>
        <div class="form-group">
            <label>Email:</label>
            <p><?php echo $email; ?></p>
        </div>
        <div class="form-group">
            <label>Issue:</label>
            <p><?php echo $issue; ?></p>
        </div>
        <div class="form-group">
            <label>Comment:</label>
            <p><?php echo nl2br($comment); ?></p>
        </div>
        <button onclick="history.back()">Edit</button>
    </div>
</body>
</html>
