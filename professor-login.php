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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professor Dashboard | KMS </title>
    <style>
        body {
            font-family: CerebriSans-Regular;
            text-align: center;
            margin-top: 10px;

        }

        #status {
            margin: 10px auto;
            padding: 5px;
            border: 0px solid #ccc;
            width: 800px;
        }

        #status-bar {
            margin-top: 25px;
        }

        .btn {
            color: #fff;
            padding: 15px 25px;
            border-radius: 100px;
            background-color: #323234;
            background-image: radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.23) 0%, transparent 86.18%), radial-gradient(66% 87% at 26% 20%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%);
            /* box-shadow: 2px 19px 31px rgba(0, 0, 0, 0.2); */
            font-weight: bold;
            font-size: 16px;

            border: 0;

            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;

            cursor: pointer;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        .search-image {
            width: 200px; /* Adjust the width as needed */
            height: auto; /* Maintain aspect ratio */
            margin-top: 10;
            position: relative;
        }
        .status-bar {
            margin-top: 10px;
            padding: 5px;
            border-radius: 10px;
            font-size: 24px;
        }
        .qr-button {
            position: absolute;
            top: 30px;
            right: 40px;
            background-color: #353535;
            border-radius: 100px;
            box-shadow: rgba(59, 59, 59, 0.2) 0 -25px 18px -14px inset,rgba(56, 56, 56, 0.15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(17, 17, 17, 0.15) 0 4px 8px,rgba(39, 41, 40, 0.15) 0 8px 16px,rgba(68, 70, 69, 0.15) 0 16px 32px;
            color: rgb(255, 255, 255);
            cursor: pointer;
            display: inline-block;
            font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
            padding: 7px 20px;
            text-align: center;
            text-decoration: none;
            transition: all 250ms;
            border: 0;
            font-size: 16px;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        }

        .qr-button:hover {
            box-shadow: rgba(12, 12, 12, 0.35) 0 -25px 18px -14px inset,rgba(34, 35, 34, 0.25) 0 1px 2px,rgba(21, 21, 21, 0.25) 0 2px 4px,rgba(47, 48, 48, 0.25) 0 4px 8px,rgba(50, 51, 50, 0.25) 0 8px 16px,rgba(38, 39, 38, 0.25) 0 16px 32px;
            transform: scale(1.05) rotate(-1deg); 
        }

        /* Style for label */
        label {
            display: inline-block;
            margin-bottom: 5px;
        }

        /* Style for select element */
        select {
            width: 200px; /* Adjust width as needed */
            padding: 5px;
            border: 1px solid #000000;
            border-radius: 100px;
            box-sizing: border-box;
            margin-bottom: 5px;
        }

        /* Style for input element */
        input[type="text"] {
            width: 200px; /* Adjust width as needed */
            padding: 5px;
            border: 1px solid #000000;
            border-radius: 100px;
            box-sizing: border-box;
            margin-bottom: 10px;
        }

        /* Optional style for the container */
        .container {
            margin: 50px;
        }

        #update-status{
            margin-top: 20px;
        }

        #custom-slot {
        display: none;
        }
    </style>
</head>
<body>
    <img src="KMS.png" alt="Search Image" class="search-image">
    <h1>Welcome <span><?php echo $_SESSION['user_name'] ?></span> </h1>
    <div id="status">
        <h2>Current Status</h2>
        <div id="availability">
            <button class="btn" onclick="setStatus('Available')">Available</button>
            <button class="btn" onclick="setStatus('Not Available')">Not Available</button>
        </div>
        <div id="options" style="display: none;">
            <br>
            <h2>Update Status</h2>
            <div id="available-options">
                <label for="next-slot"><h3>Next Free Slot:</h3></label>
                <select id="next-slot" onchange="toggleCustomTime()">
                    <option value="10:05 - 11:40">10:05 - 11:40</option>
                    <option value="11:40 - 01:10">11:40 - 01:10</option>
                    <option value="01:15 - 02:50">01:15 - 02:50</option>
                    <option value="02:55 - 04:20">02:55 - 04:20</option>
                    <option value="">Custom</option>
                </select>
                
                <label for="custom-slot" id="custom-label" style="display: none;"><h3>Custom Time:</h3></label>
                <input type="text" id="custom-slot" placeholder="Enter Time" style="display: none;">
                <br>
                <br>
                <button class="btn" onclick="setDetails('Cabin')">Available in Cabin</button>
                <button class="btn" onclick="setDetails('Temporary Busy')">Temporary Busy</button>
                <button class="btn" onclick="setDetails('Lunch Time')">Lunch Time</button>
                <button class="btn" onclick="customStatus()">Custom Status</button> <!-- Added custom button -->
            </div>
        </div>
        <div id="status-bar" class="status-bar"></div>
        <div id="update-status"><button id="update-status-btn" class="btn">Update Status</button></div>
    </div>

    <div><button id="logout" class="qr-button" onclick="logout()">Logout</button></div>

    <div id="qr-code-modal">
        <img id="qr-code-image" src="" alt="QR Code">
    </div>

    <input type="hidden" id="user-status" value="">

    <script>
        function setStatus(status) {
        document.getElementById('status-bar').innerText = status;
        document.getElementById('user-status').value = status; // Update hidden input value
        if (status === 'Available') {
            document.getElementById('options').style.display = 'block';
        } else {
            document.getElementById('options').style.display = 'none';
        }
        }
        
        function setDetails(details) {
        const nextSlot = document.getElementById('next-slot').value;
        const customSlot = document.getElementById('custom-slot').value;
        let status = `Available - ${details}, Next Free Slot: ${nextSlot}`;
        if (customSlot.trim() !== '') {
            status += `, ${customSlot}`;
        }
        document.getElementById('status-bar').innerText = status;
        document.getElementById('user-status').value = status; // Update hidden input value
        }

        function customStatus() {
        const customDetails = prompt("Enter custom status details:");
        if (customDetails !== null) { // Check if user canceled the prompt
            const customTime = document.getElementById('custom-slot').value;
            let status = `Available - ${customDetails}, Next Free Slot: ${customTime}`;
            document.getElementById('status-bar').innerText = status;
            document.getElementById('user-status').value = status; // Update hidden input value
        }
        }

        function toggleCustomTime() {
        var nextSlot = document.getElementById('next-slot').value;
        var customLabel = document.getElementById('custom-label');
        var customSlot = document.getElementById('custom-slot');
        
        if (nextSlot === "") {
            customLabel.style.display = 'inline-block';
            customSlot.style.display = 'inline-block';
        } else {
            customLabel.style.display = 'none';
            customSlot.style.display = 'none';
        }
        }



        document.getElementById('update-status-btn').addEventListener('click', function() {
        // Get the status from the hidden input field
        var status = document.getElementById('user-status').value;

        // Send an AJAX request to updatestatus.php
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'updatestatus.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Handle successful update
                    alert('Status updated successfully!');
                    // Update QR code after successful status update
                    updateQRCode(status);
                } else {
                    // Handle errors
                    alert('Error updating status: ' + xhr.responseText);
                }
            }
        };
        xhr.send('status=' + encodeURIComponent(status));
        });


        // Function to display the QR code
        function updateQRCode(status) {
        // Construct the URL with the updated status parameters
        var qrCodeUrl = 'generate_qr.php?status=' + encodeURIComponent(status);

        // Update the QR code image source
        document.getElementById('qr-code-image').src = qrCodeUrl;

        // Display the modal or div containing the QR code
        document.getElementById('qr-code-modal').style.display = 'block';
        }

        function logout() {
        // Redirect the user to the logout page
        window.location.href = 'logout.php';
        }
    </script>
</body>
</html>
