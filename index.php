<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="assets/style.css" />
    <title>KMS - Know My Status
    </title>
  </head>
  <!DOCTYPE html>
<html lang="en">
<head>
    <!-- meta tags, title, and stylesheets -->
</head>
<body>
    <a href="login_form.php"><button class="teacher-login-btn">Professor Login</button></a>
    <img src="KMS.png" alt="Search Image" class="search-image">
    <div class="search">
        <input type="text" class="input" placeholder="Search Professor..." oninput="searchTeachers(this.value)" />
        <button class="btn" onclick="toggleTeacherList()">
            <i class="icon-search"></i>
        </button>
        <ul id="teacherList" class="teacher-list hidden">
            <?php
            // Include your database connection file
            include 'config.php';

            // Fetch registered users from the database
            $query = "SELECT * FROM user_form";
            $result = mysqli_query($conn, $query);

            // Loop through each user and generate list items
            while ($row = mysqli_fetch_assoc($result)) {
                $userId = $row['id'];
                $userName = $row['name'];
                echo "<li class='teacher-list-item'><a href='get_status.php?user_id=$userId'>$userName</a></li>";
            }
            ?>
        </ul>
    </div>
    <script src="script.js"></script>
</body>
</html>

</html>
