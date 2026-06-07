// telegram.js — sends form submissions to Telegram (ported from js/form.js)
//
// NOTE: This token lives in the browser bundle, exactly like the original
// static site. A frontend-only app cannot truly hide it. If you later add a
// backend or serverless function, move this there. For now behaviour matches
// the old site. You can override via a VITE_ env var without code changes.
const BOT_TOKEN =
  import.meta.env.VITE_TG_BOT_TOKEN || "8169526689:AAE44HRYOM_tr0u-kTZu5lQ2jujB7HtwdqA";
const CHAT_ID = import.meta.env.VITE_TG_CHAT_ID || "6712355661";

export async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });
    const data = await res.json();
    if (!data.ok) console.error("Telegram API error:", data);
    return Boolean(data.ok);
  } catch (err) {
    console.error("Telegram network error:", err);
    return false;
  }
}

// Collect all named fields from a form element (incl. radios/checkboxes),
// matching the original handleFormSubmit behaviour, then send.
export async function submitFormToTelegram(form, formId, extras = {}) {
  const values = {};
  const radios = {};

  Array.from(form.elements).forEach((el) => {
    if (!el || !el.name || el.disabled) return;
    const name = el.name;
    const type = (el.type || "").toLowerCase();

    if (type === "radio") {
      if (!(name in radios)) radios[name] = null;
      if (el.checked) radios[name] = el.value;
      return;
    }
    if (type === "checkbox") {
      values[name] = el.checked ? el.value || "Yes" : "No";
      return;
    }
    values[name] = (el.value ?? "").toString().trim();
  });

  Object.keys(radios).forEach((name) => {
    values[name] = radios[name] ?? "";
  });

  Object.assign(values, extras);

  let message = `New Form Submission (${formId}):\n`;
  Object.keys(values)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => {
      const v = values[key];
      message += `${key}: ${v === "" ? "-" : v}\n`;
    });

  return sendToTelegram(message);
}
