import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">{children}</div>
    </div>
  );
};

export default Modal;
