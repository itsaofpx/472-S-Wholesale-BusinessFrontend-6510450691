"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // เปลี่ยนมาใช้จาก next/navigation
import Navbar from "../../components/Navbar";
import Image from "next/image";
import CreditCardComponent from "../../components/CreditCardComponent";
import { FaRegCreditCard } from "react-icons/fa";
import Loading from "../../components/Loading";

const CreditCardPage = () => {
  const [userID, setUserID] = useState<number | null>(null);
  const [creditCards, setCreditCards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();


  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserID(user.id || null);
    }
  }, []);

  useEffect(() => {
    if (userID) {
      // Fetch credit card data when userID is available
      const fetchCreditCards = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/creditcards/${userID}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch credit card data");
          }
          const data = await response.json();
          setCreditCards(data);
          setLoading(false);

        } catch (err) {
          setError((err as Error).message);
          setLoading(false);

        } finally {
          setLoading(false);
        }
      };

      fetchCreditCards();
    }
  }, [userID]);

  useEffect(() => {
    if (creditCards.length === 0) {
      <p>Please add a credit card</p>;
    }
  }, [creditCards, router]);

  const handleGoToCreditCardPage = () => {
    router.push("/user/creditcard"); // ไปที่หน้าที่ต้องการ
  };


  if (loading) {
    return <Loading />;
  }


  return (
    <div>
      <Navbar />
      <div className="max-h-screen bg-white text-black p-4">
        <h1 className="text-2xl font-bold mb-6 mt-4 text-center">
          My Credit Cards
        </h1>
        <div className="space-y-4">
        {creditCards.length === 0 ? (
            <div className="text-center mt-[10px] items-center justify-center flex flex-col">
              <CreditCardComponent
                    cardNumber={"1234567890******"}
                    cardHolder={"Your Name"}
                    expiration={"12/12"}
                    securityCode={"123"}
                  />
            <p className="mt-8">You have no credit cards</p>
            <p className="mb-8">Please add a credit card</p>
            <button
              onClick={handleGoToCreditCardPage}
              className="bg-black text-white h-[60px] w-[300px] rounded-2xl text-lg flex items-center justify-center space-x-2 border-2 hover:bg-gradient-to-r from-black to-gray-600 hover:text-white hover:shadow-lg"
            >
              <span className="">Add New</span>
              <FaRegCreditCard size={20} />
            </button>
          </div>
          ) : (
            creditCards.map((card) => (
              <div
                key={card.id}
                className="border border-gray-300 p-4 w-full h-[300px] flex items-center justify-center rounded-2xl"
              >
                <div className="mr-[50px] flex-shrink-0">
                  <CreditCardComponent
                    cardNumber={card.card_number}
                    cardHolder={card.card_holder}
                    expiration={card.expiration}
                    securityCode={card.security_code}
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold mb-2">
                    Card Holder:{" "}
                    {card.card_holder.length > 12
                      ? `${card.card_holder.slice(0, 12)}...`
                      : card.card_holder}
                  </h2>

                  <p>
                    <strong>Card Number:</strong> {card.card_number}
                  </p>
                  <p>
                    <strong>Expiration Date:</strong> {card.expiration}
                  </p>
                  <p>
                    <strong>Security Code:</strong> {card.security_code}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ปุ่ม Fix ที่มุมขวาล่าง */}
      <button
        onClick={handleGoToCreditCardPage}
        className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-full text-l flex items-center space-x-2 hover:bg-gradient-to-r from-black to-gray-800 hover:text-white hover:shadow-lg"
      >
        <span className="">
          Add New
        </span>
        <FaRegCreditCard size={20} />
      </button>
    </div>
  );
};

export default CreditCardPage;
