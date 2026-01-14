// api/sendForm.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Method Not Allowed" });
  }

  try {
    const payload = req.body;
    const { form_type } = payload;

    let text = `📩 New ${form_type} Submission\n\n`;

    if (form_type === "contact") {
      text += `👤 Name: ${payload.name}
📧 Email: ${payload.email}
📞 Phone: ${payload.phone}
💬 Message:
${payload.message || "N/A"}`;
    }

    if (form_type === "financing") {
      text += `👤 Name: ${payload.firstName} ${payload.lastName}
📧 Email: ${payload.email}
📞 Phone: ${payload.phone}
Marital Status: ${payload.maritalStatus}
DL State: ${payload.dlState}
DL Number: ${payload.dlNumber}
Vehicle ID: ${payload.vehicle_id}
Down Payment: ${payload.downPayment}
Preferred Term: ${payload.term}`;
    }

    if (form_type === "tradein") {
      text += `👤 Name: ${payload.name}
📧 Email: ${payload.email}
📞 Phone: ${payload.phone}
Interested Vehicle ID: ${payload.vehicle_id}
Trade-In Vehicle: ${payload.make} ${payload.model} ${payload.year}
Mileage: ${payload.mileage || "N/A"}

Additional Message:
${payload.message || "N/A"}`;
    }

    const BOT_TOKEN = "8169526689:AAE44HRYOM_tr0u-kTZu5lQ2jujB7HtwdqA";
    const CHAT_ID = "6712355661";

    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
        }),
      }
    );

    if (!tgRes.ok) throw new Error("Telegram API error");

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
}
