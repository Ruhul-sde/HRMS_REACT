// backend/routes/auth.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  // Correct JSON format for WCF
  const wcfPayload = {
    ls_EmpCode: userId,
    ls_Password: password
  };

  try {
    const response = await axios.post(
      'http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/EmpLogin',
      wcfPayload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Check WCF response
    const result = response.data?.d || response.data?.EmpLoginResult || response.data;

    console.log("WCF Response Result:", result);

    if (result && result.toLowerCase() === 'success') {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('WCF Login Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Unable to connect to WCF service.' });
  }
});

module.exports = router;
