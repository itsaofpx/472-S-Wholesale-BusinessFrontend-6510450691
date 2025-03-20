// components/CreditCardComponent.tsx

import React from 'react';
import ship from "../../images/ship.png";

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiration: string;
  securityCode: string;
}

const CreditCardComponent: React.FC<CreditCardProps> = ({
  cardNumber,
  cardHolder,
  expiration,
  securityCode,
}) => {
  // ฟังก์ชันจัดการหมายเลขบัตรและเซ็นเซอร์ 4 ตัวสุดท้าย
  const formatCardNumber = (number: string) => {
    // แทนที่เลขที่เหลือทั้งหมดด้วย * และเว้นวรรคทุกๆ 4 ตัว
    const censored = number.slice(0, -4).replace(/\d{4}(?=\d)/g, '$& ');
  
    // แสดงผล 4 ตัวสุดท้ายเป็น ****
    const lastFour = ' ****';
  
    // รวมทั้งสองส่วนเข้าด้วยกัน
    return `${censored}${lastFour}`;
  };
  
  
  

  return (
    <div className="w-[430px] h-[260px] p-6 bg-gradient-to-r from-black to-gray-600 rounded-3xl shadow-lg">
      <div className="text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">Credit Card</div>
          <div className="text-2xl">VISA</div> {/* สามารถใส่โลโก้บัตรได้ที่นี่ */}
        </div>

        <div className="mb-6">
          <div className="text-3xl font-mono">{formatCardNumber(cardNumber)}</div>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <div>
            <div className='font-bold text-gray-500'>Card Holder</div>
            <div>{cardHolder}</div>
          </div>
          <div>
            <div className='font-bold text-gray-500'>Expiration</div>
            <div>{expiration}</div>
          </div>
        </div>

        <div className="flex justify-between text-sm mt-[20px]">
          <div>
            <div className='font-bold text-gray-500'>Security Code</div>
            <div>{securityCode}</div>
          </div>
          <div>
          <div className="w-[65px] h-[45px] bg-gradient-to-r from-red-500 to-yellow-600 rounded-lg shadow-lg relative">
              {/* <div className="absolute top-1/2 left-1/4 w-[20px] h-[20px] bg-yellow-600 rounded-full opacity-60 transform -translate-y-1/2"></div> */}
              {/* <div className="absolute top-1/2 right-1/4 w-[20px] h-[20px] bg-yellow-600 rounded-full opacity-60 transform -translate-y-1/2"></div> */}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardComponent;
