<?php
require "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  exit("Method Not Allowed");
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$name || !$email || !$message) {
  http_response_code(400);
  exit("Please fill all fields");
}

$text = "📩 New Contact Message\n\n";
$text .= "👤 Name: $name\n";
$text .= "📧 Email: $email\n";
$text .= "💬 Message:\n$message";

$url = "https://api.telegram.org/bot" . TG_BOT_TOKEN . "/sendMessage";

$data = [
  "chat_id" => TG_CHAT_ID,
  "text" => $text,
  "parse_mode" => "HTML"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo "ok";
