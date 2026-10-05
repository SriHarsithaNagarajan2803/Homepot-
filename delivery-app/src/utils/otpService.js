// Centralized OTP Service for HomePot Delivery Partner App
// Handles 3 OTP Generations:
// 1. Rider Login OTP
// 2. Chef Kitchen Pickup Handover OTP
// 3. Customer Doorstep Delivery Handover OTP

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3ebjUS21_hc02QWDpUv2FXsff4MiYOz8PChnhbLBET8oCpsNpXq-KXag4FU-TKnCWmg/exec";

export async function dispatchOtpToPhoneAndEmail({ email, phone, otp, title, purpose, orderId }) {
  const savedEmail = localStorage.getItem('homepot_rider_email') || 'dnsriharsitha@gmail.com';
  const savedPhone = localStorage.getItem('homepot_rider_phone') || '9345605005';

  const cleanEmail = (email || savedEmail).trim().toLowerCase();
  const cleanPhone = (phone || savedPhone).replace(/\D/g, '');

  console.log(`[HomePot OTP Dispatch] Sending OTP ${otp} (${purpose}) to: Email=${cleanEmail}, Phone=+91 ${cleanPhone}`);

  try {
    // Send text/plain JSON payload so Google Apps Script parses e.postData.contents properly without CORS rejection
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'sendOtp',
        email: cleanEmail,
        phone: cleanPhone,
        otp: String(otp),
        orderId: orderId || 'N/A',
        title: title || 'HomePot Verification Code',
        purpose: purpose || 'Verification',
        role: 'delivery_partner',
        timestamp: new Date().toISOString()
      })
    });
  } catch (err) {
    console.warn('[HomePot OTP Dispatch] Webhook note:', err);
  }

  return { email: cleanEmail, phone: cleanPhone, otp };
}

export function generateRandomOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}
