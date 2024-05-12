<?php
// Include config.php and establish database connection
include 'config.php';

// Start session if not already started
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_name'])) {
    exit('You are not logged in.');
}

// Check if the status data is received via POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the status data is set
    if (isset($_POST['status'])) {
        // Sanitize the status data
        $status = mysqli_real_escape_string($conn, $_POST['status']);

        // Update the status in the database
        $updateQuery = "UPDATE user_form SET updatestatus = '$status' WHERE name = '{$_SESSION['user_name']}'";
        if (mysqli_query($conn, $updateQuery)) {
            // Status updated successfully
            echo 'Status updated successfully!';
        } else {
            // Error updating status
            echo 'Error updating status: ' . mysqli_error($conn);
        }
    } else {
        // Status data not set
        echo 'Status data not received.';
    }
} else {
    // Invalid request method
    echo 'Invalid request method.';
}
?>
