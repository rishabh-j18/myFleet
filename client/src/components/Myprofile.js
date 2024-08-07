import React, { useEffect, useState } from "react";

const Myprofile = () => {

  useEffect(()=>{

  })

  const [name, setName]=useState("");
  const [dob, setDob]=useState("");
  const [gender, setGender]=useState("");
  const [mobile, setMobile]=useState("");
  const [address, setAddress]=useState("");
  const [age, setAge]=useState("");

  return (
    <>
      <div className="container d-flex justify-content-center">
        <div className="card" style={{ width: "50rem" }}>
          <div className="row-4 card">
            <img
              src="./util/RJ_ppic.jpg"
              className="rounded-circle img-fluid mx-auto d-block p-2 m"
              style={{ width: "120px", height:"120px", objectFit:"cover" }}
              alt=""
            />
          </div>
          <div className="row-8">

          </div>
        </div>
      </div>
    </>
  );
};

export default Myprofile;
