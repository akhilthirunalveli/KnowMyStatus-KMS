<?php
@include 'config.php';
session_start();

if(isset($_POST['submit'])) {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $pass = md5($_POST['password']);

    $select = "SELECT * FROM user_form WHERE email = '$email' && password = '$pass'";
    $result = mysqli_query($conn, $select);

    if(mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_array($result);

        if($row['user_type'] == 'admin') {
            $_SESSION['admin_name'] = $row['name'];
            header('location:professor-login.html');
        } elseif($row['user_type'] == 'user') {
            $_SESSION['user_name'] = $row['name'];
            header('location:professor-login.php');
        }
    } else {
        $error[] = 'Incorrect email or password!';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Professor Status | KMS </title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
        *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
        }
        body{
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #fff;
        }
        .wrapper,
        .wrapper .img-area,
        .social-icons a,
        .buttons button{
        background: #ffffff;
        box-shadow: -3px -3px 7px #fff,
                    3px 3px 5px #ceced1;
        }
        .wrapper{
        position: relative;
        width: 600px;
        padding: 30px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        }
        .wrapper .icon{
        font-size: 17px;
        color: #000000;
        position: absolute;
        cursor: pointer;
        opacity: 0.7;
        top: 15px;
        height: 35px;
        width: 35px;
        text-align: center;
        line-height: 35px;
        border-radius: 50%;
        font-size: 16px;
        }
        .wrapper .icon i{
        position: relative;
        z-index: 9;
        }
        .wrapper .icon.arrow{
        left: 15px;
        }
        .wrapper .icon.dots{
        right: 15px;
        }
        .wrapper .img-area{
        height: 150px;
        width: 150px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        }
        .img-area .inner-area{
        height: calc(100% - 25px);
        width: calc(100% - 25px);
        border-radius: 50%;
        }
        .inner-area img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        object-fit: cover;
        }
        .wrapper .name{
        font-size: 23px;
        font-weight: 500;
        color: #31344b;
        margin: 10px 0 5px 0;
        }
        .wrapper .about{
        color: #44476a;
        font-weight: 400;
        font-size: 16px;
        }

        .buttons button:hover:before{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: 50%;
        background: #ecf0f3;
        box-shadow: inset -3px -3px 7px #ffffff,
                    inset 3px 3px 5px #ceced1;
        }
        .buttons button:hover:before{
        z-index: -1;
        border-radius: 5px;
        }

        .wrapper .buttons{
        display: flex;
        width: 100%;
        justify-content: space-between;
        }
        .buttons button{
        position: relative;
        width: 100%;
        border: none;
        outline: none;
        padding: 12px 0;
        color: #31344b;
        font-size: 17px;
        font-weight: 400;
        border-radius: 5px;
        cursor: pointer;
        z-index: 4;
        }
        .buttons button:first-child{
        margin-right: 10px;
        }
        .buttons button:last-child{
        margin-left: 10px;
        }
        

    </style>
</head>
<body>
  <div class="wrapper">
    <div class="img-area">
      <div class="inner-area">
        <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png" alt="">
      </div>
    </div>
    <a href="index.php" class="icon arrow"><i class="fas fa-arrow-left"></i></a>
    <div class="name"><span><?php echo $_SESSION['user_name'] ?></span></div>
    <div class="about">VIT Bhopal University</div>
    <br>
    <div class="buttons">
      <?php
        // Fetch data from the database
        $updatestatus = ''; // Initialize variable
        $select = "SELECT updatestatus FROM user_form WHERE name = '{$_SESSION['user_name']}'";
        $result = mysqli_query($conn, $select);
        if(mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_array($result);
            $updatestatus = $row['updatestatus'];
        }
      ?>
      <button><span><?php echo $updatestatus ?></span></button>
    </div>
  </div>
</body>
</html>
