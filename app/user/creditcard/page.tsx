"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import cc from "../../images/cc.png";
import { IoIosCheckmark } from "react-icons/io";
import { useRouter } from "next/navigation"; // เปลี่ยนมาใช้จาก next/navigation

export default function CreditCardForm() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiration: "",
    cvv: "",
  });

  const [userID, setUserID] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    expiration: "",
    cvv: "",
  });
  
  const [showModal, setShowModal] = useState(false);  // Modal state
  const [modalMessage, setModalMessage] = useState("");  // Message to display in modal

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserID(user.id || null);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "cardNumber") {
      let formattedValue = value.replace(/\D/g, "").slice(0, 16); 
      formattedValue = formattedValue.replace(/(.{4})(?=.)/g, "$1 "); 
      setFormData({ ...formData, [id]: formattedValue });
    } else if (id === "expiration") {
      let formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
      setFormData({ ...formData, [id]: formattedValue });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const validateForm = () => {
    const newErrors = { cardNumber: "", cardHolder: "", expiration: "", cvv: "" };
    let isValid = true;

    const cardNumberRegex = /^\d{16}$/ ;
    const cardNumber = formData.cardNumber.replace(/\s+/g, ''); 
    if (!cardNumberRegex.test(cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits.";
      isValid = false;
    }
    
    if (formData.cardHolder.trim().length === 0) {
      newErrors.cardHolder = "Cardholder name is required.";
      isValid = false;
    }

    const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2,4}$/;
    if (!expirationRegex.test(formData.expiration)) {
      newErrors.expiration = "Expiration date must be in MM/YY format.";
      isValid = false;
    }

    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestBody = {
      user_id: userID,
      card_number: formData.cardNumber.replace(/\s+/g, ''), 
      card_holder: formData.cardHolder,
      expiration: formData.expiration,
      security_code: formData.cvv,
    };

    try {
      const response = await fetch(`http://localhost:8000/creditcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setFormData({
          cardNumber: "",
          cardHolder: "",
          expiration: "",
          cvv: "",
        });  // Reset form fields
        setModalMessage("Form submitted successfully!");  // Success message
        setShowModal(true);  // Show modal

        // Hide modal after 1.5 seconds
        setTimeout(() => {
          setShowModal(false);
          router.push("/user/mycreditcard"); 
        }, 1500);
      } else {
        setModalMessage("Failed to submit form. Please try again.");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalMessage("An error occurred while submitting the form. Please try again.");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
      
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-1/3 h-1/3">
          <Image
            src={cc}
            alt="Credit Card"
            width={500}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <form
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Add Credit Card Information
          </h1>

          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="1234 5678 9101 1121"
              required
            />
            {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="John Doe"
              required
            />
            {errors.cardHolder && <p className="text-red-500 text-sm">{errors.cardHolder}</p>}
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">
                Expiration Date
              </label>
              <input
                type="text"
                id="expiration"
                value={formData.expiration}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="MM/YY"
                required
              />
              {errors.expiration && <p className="text-red-500 text-sm">{errors.expiration}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="123"
                required
              />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-500 hover:shadow-[0px_4px_14px_3px_rgba(0,0,0,0.4)]"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Modal for success or error message */}
      {showModal && (
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
  );
}
