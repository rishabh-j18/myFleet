import React, { useState } from "react";
import Cookie from 'js-cookie';
import { useLocation, useNavigate } from "react-router-dom";
import { verifyotp } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/Signup.css";
import "bootstrap/dist/css/bootstrap.css";

const Otp = () => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp === "") {
      toast.error("Enter OTP to proceed");
    } else if (otp.length !== 6) {
      toast.error("Enter valid OTP");
    } else {
      const data = {
        mobile: location.state,
        otp
      };

      const response = await verifyotp(data);
      if (response.status === 200) {
        toast.success(response.data.message);
        const token = Cookie.get('jwtoken');
        if (token) {
          localStorage.setItem('jwtoken', token);
        }
        setTimeout(() => {
          navigate('/');
        }, 6000);
      } else {
        toast.error(response.data.error);
      }
    }
  }

  return (
    <>
      <div className="container mt-5">
        <div
          className="card mx-auto p-4"
          style={{ maxWidth: "600px", boxShadow: "5px 5px 10px grey" }}
        >
          <div
            className="card-header"
            style={{ backgroundColor: "white", textAlign: "center" }}
          >
            <h3>Log In</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">OTP</label>
              <input
                type="number"
                aria-label="otp"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ border: "1px solid", borderRadius: "7px" }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Verify OTP
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Otp;
