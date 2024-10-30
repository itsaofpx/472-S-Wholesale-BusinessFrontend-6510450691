"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorText from "./components/ErrorText";
import axios from "axios";

interface UserInfo {
  user_id: number;
  user_role: number;
  user_tier: number;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const router = useRouter();

  async function Login(email: string, password: string) {
    const url = "http://localhost:8000/login";
    try {
      const response = await axios.post(
        url,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.user);

      sessionStorage.setItem("user", JSON.stringify(response.data.user));

        console.log(response);
      return response; // Return response if login is successful
    } catch (error) {
      console.error("Login failed:", error);
      alert(error);
      return null; // Return null if there's an error
    }
  }

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email) setEmailError("กรุณากรอกอีเมลล์");
    if (!password) setPasswordError("กรุณากรอกรหัสผ่านของคุณ");

    if (email && password) {
      const loginSuccess = await Login(email, password);
      if (loginSuccess?.status == 200) {
        console.log(loginSuccess.data.user.role);
        if (loginSuccess.data.user.role == 1) {
          router.push("/user/landing");
        } else if (loginSuccess.data.user.role == 2) {
          router.push("/admin/products");
        }
      } else {
        setPasswordError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col space-y-4 w-fit">
        <div className="w-24 h-24 bg-silverSand rounded-full mx-auto"></div>
        <div className="border border-black rounded-lg p-8">
          <div className="space-y-10">
            <p className="text-center text-3xl font-sans font-bold">
              เข้าสู่ระบบ
            </p>
            <div className="space-y-5">
              <div>
                <p className="text-gray-500">ที่อยู่อีเมล หรือ เบอร์โทรศัพท์</p>
                <input
                  type="text"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกที่อยู่อีเมล หรือ เบอร์โทรศัพท์"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <ErrorText message={emailError} />
              <div>
                <p className="text-gray-500">รหัสผ่าน</p>
                <input
                  type="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกรหัสผ่าน"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <ErrorText message={passwordError} />
              <div className="space-y-3">
                <button
                  onClick={handleLogin}
                  id="loginButton"
                  className="bg-silverSand text-white w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
                >
                  เข้าสู่ระบบ
                </button>
                <p>
                  โดยดำเนินการต่อ คุณยอมรับ{" "}
                  <a
                    target="_blank"
                    className="underline font-bold"
                  >
                    เงื่อนไขการใช้งาน
                  </a>{" "}
                  และ{" "}
                  <a className="underline font-bold">นโยบายความเป็นส่วนตัว</a>
                </p>
              </div>
            </div>
            <p
              id="forgetPassword"
              className="text-right underline cursor-pointer"
            >
              ลืมรหัสผ่าน
            </p>
          </div>
        </div>
        <Link href="/user/register">
          <button
            id="createAccountButton"
            className="bg-white border border-black w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
          >
            สร้างบัญชีผู้ใช้
          </button>
        </Link>
      </div>
    </div>
  );
}
