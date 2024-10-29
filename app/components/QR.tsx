import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";

export default function QRPayment() {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (receipt) {
      setMessage("Done");
    } else {
      setMessage("Please upload a receipt first.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* QR Code */}
      <div className="mb-8">
        <QRCode
          value="https://example.com"
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
        />
        <p className="text-gray-500 text-sm mt-2">Scan this QR code</p>
      </div>

      {/* Receipt Uploader */}
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
      >
        Submit
      </button>

      {/* Message */}
      {message && <p className="mt-4 text-lg font-semibold">{message}</p>}
    </div>
  );
}
