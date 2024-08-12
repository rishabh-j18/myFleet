const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/userschema");
const Provider=require("../model/providerSchema");
const otps = require("../model/otps");
const router = express.Router();
require("../db/db");

router.get("/", (req, res) => {
  res.send("Welcome from Homepage");
});

router.post("/register", (req, res) => {
  const { name, dob, gender, mobile, roles } = req.body;

  if (!name || !dob || !gender || !mobile || !roles) {
    return res.status(422).json({ error: "Fill all Fields" });
  }
  if (roles === 'car-renting') {
    User.findOne({ mobile: mobile })
      .then((_) => {
        if (_) {
          return res.status(422).json({ error: "Mobile Number already exist" });
        }

        const user = new User({ name, dob, gender, mobile });

        user
          .save()
          .then(() => {
            res.status(200).json({ message: "User registered successfully" });
          })
          .catch((err) => {
            res.status(500).json({ error: "Failed to register user." });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  else if(roles==='car-provider'){
    Provider.findOne({mobile:mobile}).then((_)=>{
      if(_){
        return res.status(422).json({error: "Mobile number already exist"});
      }

      const provider=new Provider({name,dob,gender,mobile});

      provider.save().then(()=>{
        res.status(200).json({message: "Registration Successful"});
      }).catch((err)=>{
        res.status(500).json({error:"Failed to register, Try Again"});
      });
    }).catch((err)=>{
      console.log(err);
    })
  }
});

router.post("/sendotp", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(422).json({ error: "Please enter mobile number" });
  }
  try {
    const userExist = await User.findOne({ mobile: mobile });
    if (!userExist) {
      return res
        .status(422)
        .json({ error: "Number does not exist in database" });
    } else {
      /*logic of otp storing and sending otp goes here*/

      //check whether the login number already ever tried to login
      //if the user already tried to login then we will update 'otp' field in the 'otps' collection else create new
      const olduser = await otps.findOne({ mobile: mobile });

      //genrate random 6 digit number between 100000 to 999999
      const OTP = Math.floor(100000 + Math.random() * 900000);
      console.log(OTP);
      const hashedOTP = await bcrypt.hash(OTP.toString(), 10);

      //timestamp of otp creation in order to later check whether otp expired or not
      const OTPE = Date.now();

      if (olduser) {
        const updateinfo = await otps.findByIdAndUpdate(
          { _id: olduser._id },
          { otp: hashedOTP, otpexpire: OTPE },
          { new: true }
        );

        if (!updateinfo) {
          console.log("Failed to save otp in existing data");
          res.status(400).json({ error: "Failed to save otp" });
        }

        res.status(200).json({ message: "Otp saved in db while update" });

        //sending otp code goes here
      } else {
        const createinfo = new otps({
          mobile: mobile,
          otp: hashedOTP,
          otpexpire: OTPE,
        });
        await createinfo.save();

        res.status(200).json({ message: "otp saved in db while creation" });

        //sending otp code goes here
      }
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" + e });
  }
});

router.post("/verifyotp", async (req, res) => {
  const { mobile, otp } = req.body;
  let token;
  if (!otp) {
    return res.status(422).json({ message: "Please enter otp" });
  }

  try {
    const userExist = await otps.findOne({ mobile: mobile });
    const user = await User.findOne({ mobile: mobile });
    if (!userExist) {
      return res
        .status(422)
        .json({ message: "User first has to try to send otp" });
    } else {
      const otpe = Date.now();
      const isMatch = await bcrypt.compare(otp, userExist.otp);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid OTP" });
      } else if (otpe - userExist.otpexpire > 180000) {
        return res.status(422).json({ error: "OTP expired" });
      } else {
        token = await user.generateAuthToken();
        console.log(token);
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        });
        res.status(200).json({ message: "User signed in successfully", token });
      }
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal server error " + e });
  }
});

router.get("/getdata", async (req, res) => {});

module.exports = router;
