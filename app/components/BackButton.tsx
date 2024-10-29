import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";


function BackButton() { 
    const router = useRouter();
    return (
        <button className="hover:text-gray-300" onClick={() => router.back()}>
            <IoIosArrowBack size={30} />
        </button>
    );
}

export default BackButton