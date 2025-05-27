const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Prepare WCF request payload
    const wcfPayload = {
      ls_EmpCode: userId,
      ls_Password: password
    };

    // Make POST request to WCF service
    const response = await axios.post(
      'http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/EmpLogin',
      wcfPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Assuming the WCF service returns something like: { d: "success" } or { d: "invalid" }
    const result = response.data?.d;

    if (result && result.toLowerCase() === 'success') {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
