const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { ls_EmpCode, ls_Password } = req.body;

    const loginUrl = "http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/EmpLogin";
    const detailUrl = `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetEmpDetail?EmpCode=${ls_EmpCode}`;
    const today = dayjs().format('YYYY-MM-DD');
    const pendingLeaveUrl = `http://localhost:84/ASTL_HRMS_WCF.WCF_ASTL_HRMS.svc/GetPendingLeave?EMPCode=${ls_EmpCode}&Date=${today}`;

    try {
        // Step 1: Authenticate user
        const loginRes = await axios.post(loginUrl, { ls_EmpCode, ls_Password }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (loginRes.data.ls_Status === "S") {
            // Step 2: Fetch employee details
            const empRes = await axios.get(detailUrl);

            // Step 3: Fetch pending leaves
            const pendingLeaveRes = await axios.get(pendingLeaveUrl);

            return res.json({
                success: true,
                data: {
                    employee: empRes.data,
                    pendingLeaves: pendingLeaveRes.data.lst_ClsPendingLeavDtls || [],
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: loginRes.data.ls_Message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

module.exports = router;
