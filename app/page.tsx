import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="flex flex-col space-y-4 w-fit">
        <div className="w-24 h-24 bg-silverSand rounded-full mx-auto"></div>
        <div className="border border-black rounded-lg p-8">
          <div className="space-y-10">
            <p className="text-center text-3xl font-sans font-bold">เข้าสู่ระบบ</p>
            <div className="space-y-5">
              <div>
                <p className="text-gray-500">ที่อยู่อีเมล หรือ เบอร์โทรศัพท์</p>
                <input
                  type="text"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกที่อยู่อีเมล หรือ เบอร์โทรศัพท์"
                  required
                />
              </div>
              <div>
                <p className="text-gray-500">รหัสผ่าน</p>
                <input
                  type="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
              </div>
              <div className="space-y-3">
                <Link href="">
                  <button
                    id="loginButton"
                    className="bg-silverSand text-white w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
                  >
                    {" "}
                    เข้าสู่ระบบ
                  </button>
                </Link>
                <p className="">
                  โดยดำเนินการต่อ คุณยอมรับ <a href="https://www.youtube.com/?app=desktop&gl=TH&hl=th" target="_blank" className="underline font-bold">เงื่อนไขการใช้งาน</a> และ <a className="underline font-bold">นโยบายความเป็นส่วนตัว</a>
                </p>
              </div>
            </div>
            <p id="forgetPassword" className="text-right underline cursor-pointer">
              ลืมรหัสผ่าน
            </p>
          </div>
        </div>
        <Link href="/register">
          <button
            id="createAccountButton"
            className="bg-white border border-black w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
          >
            {" "}
            สร้างบัญชีผู้ใช้
          </button>
        </Link>
      </div>
    </div>
  );
}