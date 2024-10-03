import React from "react";

const InvoiceRecord = ({ service, qty, rate, lineTotal }) => (
  <div className="flex flex-col md:flex-row justify-between py-4 border-b border-gray-200 text-sm md:text-base">
    <div className="w-full md:w-2/5 text-left">{service}</div>
    <div className="w-full md:w-1/5 text-center md:text-right mt-2 md:mt-0">{qty}</div>
    <div className="w-full md:w-1/5 text-center md:text-right mt-2 md:mt-0">{rate}</div>
    <div className="w-full md:w-1/5 text-right mt-2 md:mt-0">{lineTotal}</div>
  </div>
);

export default function Invoice() {
  const records = [
    { service: "Item Name", qty: 1, rate: "$3,000.00", lineTotal: "$3,000.00" },
    { service: "Item Name", qty: 1, rate: "$3,000.00", lineTotal: "$3,000.00" },
    { service: "Item Name", qty: 1, rate: "$3,000.00", lineTotal: "$3,000.00" },
  ];

  const subtotal = 9000;
  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <div className="p-4 sm:p-8 bg-white shadow-md rounded-lg text-gray-800 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 md:mb-0">INVOICE</h1>
          <div className="text-right">
            <p className="text-gray-500">Business address</p>
            <p className="text-gray-500">Bangkok, TH - 42190</p>
            <p className="text-gray-500">TAX ID 1102004040502</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between text-gray-700">
          {/* Billed To */}
          <div className="mb-4 md:mb-0">
            <h2 className="font-semibold text-lg">Billed to</h2>
            <p className="text-gray-600">Company Name</p>
            <p className="text-gray-600">Company address</p>
            <p className="text-gray-600">City, Country - 00000</p>
          </div>

          {/* Invoice Details */}
          <div className="space-y-2 text-right">
            <div>
              <h3 className="font-semibold text-sm">Invoice #</h3>
              <p className="text-gray-600">AB2324-01</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Invoice date</h3>
              <p className="text-gray-600">01 Aug, 2023</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Reference</h3>
              <p className="text-gray-600">INV-057</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Due date</h3>
              <p className="text-gray-600">15 Aug, 2023</p>
            </div>
          </div>
        </div>
      </header>

      {/* Table Headers */}
      <div className="hidden md:flex justify-between bg-gray-100 py-3 text-sm font-semibold text-gray-600 border-b border-gray-200">
        <div className="w-2/5 text-left">Services</div>
        <div className="w-1/5 text-center">Qty</div>
        <div className="w-1/5 text-right">Rate</div>
        <div className="w-1/5 text-right">Line total</div>
      </div>

      {/* Invoice Records */}
      {records.map((record, index) => (
        <InvoiceRecord
          key={index}
          service={record.service}
          qty={record.qty}
          rate={record.rate}
          lineTotal={record.lineTotal}
        />
      ))}

      {/* Payment Summary */}
      <div className="mt-6 text-right text-gray-700">
        {/* SubTotal */}
        <div className="flex justify-between py-2">
          <div>Subtotal</div>
          <div className="font-medium">${subtotal.toFixed(2)}</div>
        </div>

        {/* Taxes */}
        <div className="flex justify-between py-2">
          <div>Tax (10%)</div>
          <div className="font-medium">${taxAmount.toFixed(2)}</div>
        </div>

        {/* Total */}
        <div className="flex justify-between py-4 border-t border-gray-200 font-bold text-lg">
          <div>Total due</div>
          <div className="text-gray-900">${total.toFixed(2)}</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-end mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition duration-200 w-full md:w-auto">
          Pay Now
        </button>
      </footer>
    </div>
  );
}
