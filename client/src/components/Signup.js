import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/Signup.css";
import "bootstrap/dist/css/bootstrap.css";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDoB] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (firstName === "") {
      toast.error("Enter First Name");
    } else if (lastName === "") {
      toast.error("Enter Last Name");
    } else if (dob === "") {
      toast.error("Enter Date of Birth");
    } else if (gender === "") {
      toast.error("Select Gender");
    } else if (mobile === "") {
      toast.error("Enter Mobile Number");
    } else {
      // Handle form submission logic

      var name = firstName + " " + lastName;
      let data = { name, dob, gender, mobile };

      const response = await register(data);
      if (response.status === 200) {
        setFirstName("");
        setLastName("");
        setDoB("");
        setGender("");
        setMobile("");

        toast.success("Registered successfully, Redirecting to Log In");
        setTimeout(() => {
          navigate("/login");
        }, 6000);
      } else {
        setFirstName("");
        setLastName("");
        setDoB("");
        setGender("");
        setMobile("");
        toast.error(response.response.data.error);
      }

    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card mx-auto p-4"
        style={{ maxWidth: "600px", boxShadow: "5px 5px 10px grey" }}
      >
        <div
          className="card-header"
          style={{ backgroundColor: "white", textAlign: "center" }}
        >
          <h3>Sign Up</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">First and Last name</label>
            <div
              className="input-group"
              style={{ border: "1px solid", borderRadius: "7px" }}
            >
              <input
                type="text"
                aria-label="First name"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                aria-label="Last name"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              aria-label="dob"
              className="form-control"
              value={dob}
              onChange={(e) => setDoB(e.target.value)}
              style={{ border: "1px solid", borderRadius: "7px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Gender</label>
            <div
              className="d-flex align-items-center"
              style={{
                border: "1px solid",
                borderRadius: "7px",
                height: "37px",
              }}
            >
              <div className="form-check mx-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="male"
                  value="male"
                  onChange={(e) => setGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check mx-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="female"
                  value="female"
                  onChange={(e) => setGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="female">
                  Female
                </label>
              </div>
            </div>
          </div>
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
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
