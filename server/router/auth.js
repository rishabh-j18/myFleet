const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/userschema");
const OTP = require("../model/otps");
const router = express.Router();
require("../db/db");

// Home route
router.get("/", (req, res) => {
  res.send("Welcome from Homepage");
});

// Register route
router.post("/register", async (req, res) => {
  const { name, dob, gender, mobile } = req.body;

  if (!name || !dob || !gender || !mobile) {
    return res.status(422).json({ error: "Fill all fields" });
  }

  try {
    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(422).json({ error: "Mobile number already exists" });
    }

    const user = new User({ name, dob, gender, mobile });
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Send OTP route
router.post("/sendotp", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(422).json({ error: "Please enter mobile number" });
  }

  try {
    const userExist = await User.findOne({ mobile });

    if (!userExist) {
      return res.status(422).json({ error: "Number does not exist in database" });
    }

    const OTPValue = Math.floor(100000 + Math.random() * 900000);
    const hashedOTP = await bcrypt.hash(OTPValue.toString(), 10);
    const otpExpiry = Date.now();

    const existingOTP = await OTP.findOne({ mobile });

    if (existingOTP) {
      await OTP.findByIdAndUpdate(existingOTP._id, { otp: hashedOTP, otpexpire: otpExpiry });
      res.status(200).json({ message: "OTP updated and saved in database" });
    } else {
      const newOTP = new OTP({ mobile, otp: hashedOTP, otpexpire: otpExpiry });
      await newOTP.save();
      res.status(200).json({ message: "OTP created and saved in database" });
    }

    // Logic to send OTP via SMS goes here
    console.log(`OTP: ${OTPValue}`);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

// Verify OTP route
router.post("/verifyotp", async (req, res) => {
  const { mobile, otp } = req.body;

  if (!otp) {
    return res.status(422).json({ message: "Please enter OTP" });
  }

  try {
    const userExist = await OTP.findOne({ mobile });
    const user = await User.findOne({ mobile });

    if (!userExist) {
      return res.status(422).json({ message: "User first has to try to send OTP" });
    }

    const isMatch = await bcrypt.compare(otp, userExist.otp);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if ((Date.now() - userExist.otpexpire) > 180000) {
      return res.status(422).json({ error: "OTP expired" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 3600000), // 1 hour
      httpOnly: true
    });

    res.status(200).json({ message: "User signed in successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
});

module.exports = router;
