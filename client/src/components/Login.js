import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendotp } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/Signup.css";
import "bootstrap/dist/css/bootstrap.css";


const Login = () => {
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobile === "") {
      toast.error("Enter mobile number");
    } else if (mobile.length !== 10) {
      toast.error("Enter a valid 10-digit number");
    } else {
      const data = { mobile };
      try {
        const response = await sendotp(data);
        if (response && response.status === 200) {
          setMobile("");
          navigate("/otp", { state: mobile });
        } else {
          toast.error("An unexpected error occurred.");
          setMobile("");
        }
      } catch (error) {
        toast.error( "An error occurred. Please try again.");
        setMobile("");
      }
    }
  };

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
              <label className="form-label">Mobile</label>
              <input
                type="number"
                aria-label="mobile"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                style={{ border: "1px solid", borderRadius: "7px" }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
