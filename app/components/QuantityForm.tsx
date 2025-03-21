import React, { useState } from 'react';

const QuantityForm: React.FC = () => {
    const [quantity, setQuantity] = useState<number>(1);

    const handleDecrement = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            setQuantity(value);
        }
    };

    return (
        <form className="max-w-xs mx-auto">
            <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-800">
                Choose quantity:
            </label>
            <div className="flex items-center max-w-[8rem]">
                <button
                    type="button"
                    id="decrement-button"
                    onClick={handleDecrement}
                    className="bg-white hover:bg-gray-200 border border-gray-300 rounded-l-md p-2 h-11 focus:ring-2 focus:ring-gray-400 focus:outline-none transition duration-200"
                >
                    <svg className="w-3 h-3 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                    </svg>
                </button>

                <input
                    type="text"
                    id="quantity-input"
                    value={quantity}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 h-11 text-center text-gray-800 text-sm focus:ring-gray-500 focus:border-gray-500 block w-full py-2.5 placeholder-gray-400"
                    placeholder="0"
                    required
                />

                <button
                    type="button"
                    id="increment-button"
                    onClick={handleIncrement}
                    className="bg-white hover:bg-gray-200 border border-gray-300 rounded-r-md p-2 h-11 focus:ring-2 focus:ring-gray-400 focus:outline-none transition duration-200"
                >
                    <svg className="w-3 h-3 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default QuantityForm;
