// src/components/ui/QRCodeModal.jsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ isOpen, onClose, token, title, subtitle }) => {
  if (!isOpen) return null;

  const hasToken = token && token.trim() !== "";

  // 🚀 PERUBAHAN: QR value hanya token, BUKAN URL
  const qrValue = hasToken ? token : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div className="flex justify-center mb-4">
          {hasToken ? (
            <QRCodeSVG value={qrValue} size={200} />
          ) : (
            <p className="text-gray-500">No QR token available</p>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4 break-all">
          Token: {hasToken ? token : "N/A"}
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
