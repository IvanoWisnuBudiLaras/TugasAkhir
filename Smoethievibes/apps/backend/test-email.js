const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Testing email configuration...');
  
  try {
    // Test SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Email config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM,
    });

    // Test connection
    await transporter.verify();
    console.log('✅ Email server connection successful!');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"SmoethieVibes" <noreply@smoethievibes.com>',
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'Test OTP from SmoethieVibes',
      text: 'Your OTP code is: 123456. It expires in 5 minutes.',
      html: '<p>Your OTP code is: <b>123456</b></p><p>It expires in 5 minutes.</p>',
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if EMAIL_USER and EMAIL_PASS are set correctly in .env');
    console.log('2. For Gmail, use App Password (not regular password)');
    console.log('3. Enable 2-factor authentication on Gmail first');
    console.log('4. Generate app password at: https://myaccount.google.com/apppasswords');
  }
}

testEmail();