import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notify = (message: string) => {
  toast(`${message}`, {
    position: "bottom-right",
    pauseOnHover: false,
  });
  
};

function ToastContainerWrapper() {
  return <ToastContainer />;
}

export default ToastContainerWrapper;
