// Test OTP API
async function testOtpApi() {
  const API_URL = 'http://localhost:3001';
  const testEmail = 'masteralvano@gmail.com'; // Ganti dengan email Anda
  
  console.log('Testing OTP API...');
  
  try {
    // Test 1: Check email endpoint
    console.log('\n1. Testing email check...');
    const checkResponse = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(testEmail)}`);
    const checkData = await checkResponse.json();
    console.log('Email check result:', checkData);
    
    // Test 2: Send OTP
    console.log('\n2. Testing send OTP...');
    const sendOtpResponse = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        action: 'LOGIN'
      }),
    });
    
    const sendOtpData = await sendOtpResponse.json();
    console.log('Send OTP result:', sendOtpData);
    
    if (!sendOtpResponse.ok) {
      console.error('❌ Failed to send OTP:', sendOtpData.message);
    } else {
      console.log('✅ OTP sent successfully!');
      console.log('Response:', sendOtpData);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Make sure backend is running on port 3001');
    console.log('- Check backend logs for detailed error messages');
    console.log('- Verify email configuration in .env file');
  }
}

// Jalankan test
testOtpApi();