import React from "react";

function PreviewModal({ data, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <h2>Confirm Details</h2>
      <p>Name: {data.name}</p>
      <p>Contact: {data.contact}</p>
      <p>NIC: {data.nic}</p>
      <p>DOB: {data.dob}</p>
      <p>Gender: {data.gender}</p>

      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Edit</button>
    </div>
  );
}

export default PreviewModal;