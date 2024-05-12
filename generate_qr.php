<?php
// Include the QR code generation library
require 'phpqrcode/qrlib.php';

// Function to generate the QR code
function generateStaticQRCode() {
    // URL to the script or page where the status is retrieved (local)
    $url = 'http://localhost/TESTKMS1/get_status.php'; // Adjust the path as needed

    // Set QR code options
    $errorCorrectionLevel = 'L'; // Error correction level: L, M, Q, H
    $matrixPointSize = 6; // Size of QR code

    // Generate QR code
    QRcode::png($url, 'qr_codes/static_qrcode.png', $errorCorrectionLevel, $matrixPointSize);
}

// Generate the static QR code
generateStaticQRCode();

// Set appropriate headers for image
header('Content-Type: image/png');

// Output the generated QR code image
readfile('qr_codes/static_qrcode.png');
?>
