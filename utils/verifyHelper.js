import emailjs from 'emailjs-com';

export const sendOTP = async (email) => {
  if (!email.endsWith("@iitk.ac.in")) {
    alert("Only institute email allowed!");
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      {
        to_email: email,
        otp: otp,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    console.log("✅ EmailJS result:", result);
    return otp;
  } catch (error) {
    console.error("❌ EmailJS error:", error);
    alert("Error sending OTP. Try again.");
  }
};
