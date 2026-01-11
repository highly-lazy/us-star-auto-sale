<?php
require "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit(json_encode(["status" => "error", "message" => "Method Not Allowed"]));
}

// General fields
$formType = trim($_POST['form_type'] ?? '');
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

// Financing
$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$maritalStatus = trim($_POST['maritalStatus'] ?? '');
$dlState = trim($_POST['dlState'] ?? '');
$dlNumber = trim($_POST['dlNumber'] ?? '');
$vehicleId = trim($_POST['vehicle_id'] ?? '');
$downPayment = trim($_POST['downPayment'] ?? '');
$term = trim($_POST['term'] ?? '');

// Trade-In
$tradeMake = trim($_POST['make'] ?? '');
$tradeModel = trim($_POST['model'] ?? '');
$tradeYear = trim($_POST['year'] ?? '');
$tradeMileage = trim($_POST['mileage'] ?? '');

// Build Telegram message
$text = "📩 New $formType Submission\n\n";

if ($formType === 'contact') {
    $text .= "👤 Name: $name\n📧 Email: $email\n📞 Phone: $phone\n💬 Message:\n$message\n";
} elseif ($formType === 'financing') {
    $text .= "👤 Name: $firstName $lastName\n📧 Email: $email\n📞 Phone: $phone\nMarital Status: $maritalStatus\nDL State: $dlState\nDL Number: $dlNumber\nVehicle ID: $vehicleId\nDown Payment: $downPayment\nPreferred Term: $term\n";
} elseif ($formType === 'tradein') {
    $text .= "👤 Name: $name\n📧 Email: $email\n📞 Phone: $phone\nInterested Vehicle ID: $vehicleId\nTrade-In Vehicle: $tradeMake $tradeModel $tradeYear, Mileage: $tradeMileage\nAdditional Message:\n$message\n";
}

// Send to Telegram
$url = "https://api.telegram.org/bot".TG_BOT_TOKEN."/sendMessage";
$data = ["chat_id" => TG_CHAT_ID, "text" => $text, "parse_mode" => "HTML"];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

// Return JSON for JS
echo json_encode(["status" => "ok"]);
