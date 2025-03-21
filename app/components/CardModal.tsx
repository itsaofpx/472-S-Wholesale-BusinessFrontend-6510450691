import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Correct import for navigation in app directory
import { IoIosCheckmark } from "react-icons/io"; // Import the checkmark icon

interface CardModalProps {
  isCardOpen: boolean;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  o_id: string;  // Order ID passed from the parent component
  total: number; // Total amount passed from the parent component
  productData: any; // Product data passed from the parent component
}

const CardModal = ({
  isCardOpen,
  setIsCardOpen,
  o_id,
  total,
  productData
}: CardModalProps) => {
  const [creditCards, setCreditCards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const router = useRouter(); // Use the correct hook for navigation

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserID(user.id || null);
    }
  }, []);

  useEffect(() => {
    if (isCardOpen && userID) {
      const fetchCreditCards = async () => {
        try {
          const response = await fetch(`http://localhost:8000/creditcards/${userID}`);
          if (!response.ok) {
            throw new Error("Failed to fetch credit card data");
          }
          const data = await response.json();
          setCreditCards(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchCreditCards();
    }
  }, [isCardOpen, userID]);

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
    setMessage(null); // Clear any existing message
  };

  const gooohome = () => {
    router.push("/user/landing");
  };

  const handleSubmit = async () => {
    if (!selectedCardId) {
      setMessage("Please select a Credit Card first.");
      return; // Don't proceed if no card is selected
    }

    if (o_id) {
      const userString = sessionStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        const updatedOrder = {
          o_status: "PD",
          id: Number(o_id),
        };
        try {
          const updateStatusUrl = `http://localhost:8000/order/status/update`;
          const updateStatusResponse = await axios.put(
            updateStatusUrl,
            updatedOrder,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const buyProductsUrl = `http://localhost:8000/products/buy`;
          const buyProductsResponse = await axios.put(
            buyProductsUrl,
            productData
          );

          setMessage("Order status updated successfully.");
          const receiptUrl = "Credit Card Receipt";
          const transactionUrl = `http://localhost:8000/transaction`;
          const transactionResponse = await axios.post(transactionUrl, {
            t_net_price: total,
            t_image_url: receiptUrl.toString(),
            order_id: Number(o_id),
          });

          console.log("Transaction Response:", transactionResponse.data);

          sessionStorage.removeItem("discount");
          
          setShowSuccess(true);
          
          setTimeout(() => {
            gooohome();
          }, 2000);
          
        } catch (error) {
          console.error("Error updating order:", error);
          setMessage("Failed to update the order.");
        }
      } else {
        alert("can't find user");
      }
    }
  };

  return (
    isCardOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="relative bg-white p-6 rounded-lg shadow-lg h-[400px] w-11/12 max-w-md flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsCardOpen(false);
              setSelectedCardId(null);
              setMessage(null);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>

          {/* Display the credit card data if fetched */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="overflow-y-auto space-y-2 flex-grow mb-4 scrollbar-hide mt-4">
              {creditCards.length === 0 ? (
                <p>No credit cards available</p>
              ) : (
                creditCards.map((card) => (
                  <div
                    key={card.id}
                    className={`border-2 p-4 rounded-lg ${selectedCardId === card.id ? 'border-blue-500' : 'border-gray-300'}`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <p><strong>Card Number:</strong> {card.card_number}</p>
                    <p><strong>Card Holder:</strong> {card.card_holder}</p>
                    <p><strong>Expiration:</strong> {card.expiration}</p>
                    <p><strong>Security Code:</strong> {card.security_code}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Show success or error message */}
          {message && (
            <p className={message === "Order status updated successfully." ? "text-green-500" : "text-red-500"}>{message}</p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full mt-2"
            disabled={selectedCardId === null}
          >
            ยืนยัน
          </button>

          {/* Display error message below the button */}
          {message === "Please select a Credit Card first." && (
            <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
          )}

          {/* Show success message with animation */}
          {showSuccess && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white h-[300px] w-[400px] rounded-lg shadow-lg text-center flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold">{"Successfully"}</h2>
                <div className="flex flex-col items-center mt-4 mb-4">
                  <div className="flex items-center justify-center bg-green-500 rounded-full w-[120px] h-[120px] flex-shrink-0">
                    <IoIosCheckmark size={80} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default CardModal;
