"use client";
import { useState } from "react";
import Link from "next/link";
import ErrorText from "../../components/ErrorText";
import { useRouter } from "next/navigation";
import axios from "axios";
import BackButton from "@/app/components/BackButton";

export default function Register() {
  const steps: string[] = [
    "กรอกที่อยู่อีเมลของคุณ",
    "กรอกข้อมูลพื้นฐานของคุณ",
    "กรอกที่อยู่ของคุณ",
  ];

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailStr(e.target.value);
  };

  const handleChangePassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPasswordStr(e.target.value);
  };

  const handleChangeConfirm = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setConfirmStr(e.target.value);
  };
  const handleChangeID = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIDStr(e.target.value);
  };

  const handleChangeFname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFnameStr(e.target.value);
  };

  const handleChangeLname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLnameStr(e.target.value);
  };

  const handleChangePhoneNum = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPhoneNumStr(e.target.value);
  };

  const handleChangeAddress = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAddressStr(e.target.value);
  };

  const handleChangeSubDistrict = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSubDistrictStr(e.target.value);
  };
  const handleChangeDistrict = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDistrictStr(e.target.value);
  };
  const handleChangeProvince = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setProvinceStr(e.target.value);
  };
  const handleChangeZipCode = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setZipCodeStr(e.target.value);
  };

  const [emailStr, setEmailStr] = useState<string>("");
  const [passwordStr, setPasswordStr] = useState<string>("");
  const [confirmStr, setConfirmStr] = useState<string>("");
  const [IDStr, setIDStr] = useState<string>("");
  const [fnameStr, setFnameStr] = useState<string>("");
  const [lnameStr, setLnameStr] = useState<string>("");
  const [PhoneNumStr, setPhoneNumStr] = useState<string>("");
  const [addressStr, setAddressStr] = useState<string>("");
  const [subDistrictStr, setSubDistrictStr] = useState<string>("");
  const [districtStr, setDistrictStr] = useState<string>("");
  const [provinceStr, setProvinceStr] = useState<string>("");
  const [zipCodeStr, setZipCodeStr] = useState<string>("");

  // Error Message
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");
  const [idStrError, setIdStrError] = useState<string>("");
  const [fnameStrError, setFnameStrError] = useState<string>("");
  const [lnameStrError, setLnameStrError] = useState<string>("");
  const [PhoneNumStrError, setPhoneNumStrError] = useState<string>("");
  const [addressStrError, setAddressStrError] = useState<string>("");
  const [subDistrictStrError, setSubDistrictStrError] = useState<string>("");
  const [districtStrError, setDistrictStrError] = useState<string>("");
  const [provinceStrError, setProvinceStrError] = useState<string>("");
  const [zipCodeStrError, setZipCodeStrError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0); // Start with the first step

  const router = useRouter();

  async function Register(
    email: string,
    password: string,
    credentialId: string,
    fName: string,
    lName: string,
    phoneNum: string,
    addressStr: string
  ): Promise<string | null> {
    const url = "http://localhost:8000/register";
    try {
      const response = await axios.post(url, {
        credential_id: credentialId,
        f_name: fName,
        l_name: lName,
        phone_number: phoneNum,
        email: email,
        password: password,
        address: addressStr,
      });
      return response.data.id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle Axios-specific error
        alert(error.response.data?.message || "Registration failed");
      } else {
        // Handle non-Axios errors
        alert("An unexpected error occurred");
      }
      return null;
    }
  }

  const handleRegister = async () => {
    const address = `${addressStr} ${subDistrictStr} ${districtStr} ${provinceStr} ${zipCodeStr}`;
    const userId = await Register(
      emailStr,
      passwordStr,
      IDStr,
      fnameStr,
      lnameStr,
      PhoneNumStr,
      address
    );
  
    if (userId) {
      alert("สร้างบัญชีสำเร็จ");
      const isChatCreated = await CreateChat(userId);
      if (isChatCreated) {
        alert("Chat created successfully");
      } else {
        alert("Failed to create chat.");
      }
  
      router.push("/");
    } else {
      alert("Registration failed, not redirecting.");
    }
  };
  async function CreateChat(userId: string): Promise<boolean> {
    const url = "http://localhost:8000/chat";
    console.log(userId);
    console.log(typeof(userId));
    try {
      const response = await axios.post(url, { UserID: Number(userId)});
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data?.message || "Failed to create chat");
      } else {
        alert("An unexpected error occurred");
      }
      return false;
    }
  }
  

  const handleNext = (): void => {
    // Clear previous error messages
    setEmailError("");
    setPasswordError("");
    setConfirmError("");
    setIdStrError("");
    setFnameStrError("");
    setLnameStrError("");
    setPhoneNumStrError("");
    setAddressStrError("");
    setSubDistrictStrError("");
    setDistrictStrError("");
    setProvinceStrError("");
    setZipCodeStrError("");

    let hasError = false;

    if (currentStep === 0) {
      // Step 1: Check if email, password, and confirm password are empty
      if (!emailStr) {
        setEmailError("กรุณากรอกอีเมลของคุณ");
        hasError = true;
      }
      if (!passwordStr) {
        setPasswordError("กรุณากรอกรหัสผ่านของคุณ");
        hasError = true;
      }
      if (!confirmStr) {
        setConfirmError("กรุณากรอกยืนยันรหัสผ่าน");
        hasError = true;
      }
      if (passwordStr && confirmStr && passwordStr !== confirmStr) {
        setConfirmError("รหัสผ่านไม่ตรงกัน");
        hasError = true;
      }
    } else if (currentStep === 1) {
      // Step 2: Check if ID, first name, last name, and phone number are empty
      if (!IDStr) {
        setIdStrError("กรุณากรอกเลขบัตรประชาชน");
        hasError = true;
      }
      if (!fnameStr) {
        setFnameStrError("กรุณากรอกชื่อจริง");
        hasError = true;
      }
      if (!lnameStr) {
        setLnameStrError("กรุณากรอกนามสกุล");
        hasError = true;
      }
      if (!PhoneNumStr) {
        setPhoneNumStrError("กรุณากรอกเบอร์โทรศัพท์");
        hasError = true;
      }
    } else if (currentStep === 2) {
      // Step 3: Check if address, sub-district, district, province, and zip code are empty
      if (!addressStr) {
        setAddressStrError("กรุณากรอกที่อยู่");
        hasError = true;
      }
      if (!subDistrictStr) {
        setSubDistrictStrError("กรุณากรอกแขวง/ตำบล");
        hasError = true;
      }
      if (!districtStr) {
        setDistrictStrError("กรุณากรอกเขต/อำเภอ");
        hasError = true;
      }
      if (!provinceStr) {
        setProvinceStrError("กรุณากรอกจังหวัด");
        hasError = true;
      }
      if (!zipCodeStr) {
        setZipCodeStrError("กรุณากรอกรหัสไปรษณีย์");
        hasError = true;
      }
    }

    if (!hasError) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = (): void => {
    // Decrement the current step if it is greater than 0
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="text-center space-y-16 border p-20">
        <div className="text-left"><BackButton /> </div>
        <div className="space-y-2">
          <p className="font-bold text-3xl">สร้างบัญชีผู้ใช้</p>
          <p className="font-bold text-xs">
            มีบัญชีผู้ใช้อยู่แล้ว?{" "}
            <Link href="/" className="underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
        <div>
          {currentStep === 0 && (
            <div className=" space-y-4 p-5 w-[50rem]">
              <div className="flex items-start justify-between">
                <div className="relative flex flex-col justify-center items-center w-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    1
                  </div>
                  <p className="text-black ">{steps[0]}</p>
                </div>

                {/* Stepper line */}
                <div className="relative flex items-center w-full">
                  <div className="h-1 w-full bg-black opacity-40" />
                </div>

                <div className="relative flex flex-col justify-center items-center w-full opacity-40">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    2
                  </div>
                  <p className="text-black">{steps[1]}</p>
                </div>
                <div className="relative flex items-center w-full">
                  <div className="h-1 w-full bg-black opacity-40" />
                </div>

                <div className="relative flex flex-col justify-center items-center w-full opacity-40">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    3
                  </div>
                  <p className="text-black">{steps[2]}</p>
                </div>
              </div>

              <div className="">
                <p className="text-left text-gray-500">อีเมลของคุณ</p>
                <input
                  value={emailStr}
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="กรอกที่อยู่อีเมล"
                  required
                  onChange={handleChangeEmail}
                />
                <ErrorText message={emailError} />
              </div>
              <div className="space-y-2">
                <div className="flex flex-row gap-10">
                  <div className="w-full">
                    <p className="text-gray-500 text-left">รหัสผ่าน</p>
                    <input
                      value={passwordStr}
                      type="password"
                      id="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรอกรหัสผ่าน"
                      required
                      onChange={handleChangePassword}
                    />
                    <ErrorText message={passwordError} />
                  </div>
                  <div className="w-full">
                    <p className="text-gray-500 text-left">ยืนยันรหัสผ่าน</p>
                    <input
                      value={confirmStr}
                      type="password"
                      id="confirm-password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรอกรหัสผ่าน"
                      required
                      onChange={handleChangeConfirm}
                    />
                    <ErrorText message={confirmError} />
                  </div>
                </div>
                <p className="font-light text-gray-500 text-left">
                  ใช้ 8 ตัวอักษรหรือมากกว่าที่มีการผสมผสานของตัวอักษร ตัวเลข
                  และสัญลักษณ์
                </p>
              </div>
              <div>
                <button
                  id="nextButton"
                  onClick={handleNext}
                  className="bg-silverSand text-white w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 p-5 w-[50rem] ">
              <div className="flex items-start justify-between">
                <div className="relative flex flex-col justify-center items-center w-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    1
                  </div>
                  <p className="text-black">{steps[0]}</p>
                </div>
                <div className="relative flex items-center w-full">
                  <div className="h-1 w-full bg-black" />
                </div>
                <div className="relative flex flex-col justify-center items-center w-full ">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    2
                  </div>
                  <p className="text-black">{steps[1]}</p>
                </div>
                <div className="relative flex items-center w-full opacity-40">
                  <div className="h-1 w-full bg-black" />
                </div>
                <div className="relative flex flex-col justify-center items-center w-full opacity-40 ">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    3
                  </div>
                  <p className="text-black">{steps[2]}</p>
                </div>
              </div>
              <div>
                <p className="text-left text-gray-500">เลขบัตรประชาชน</p>
                <input
                  value={IDStr}
                  type="text"
                  id="idNumber"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกเลขบัตรประชาชน"
                  required
                  onChange={handleChangeID}
                />
                <ErrorText message={idStrError} />
              </div>
              <div className="space-y-2">
                <div className="flex flex-row gap-10">
                  <div className="w-full">
                    <p className="text-gray-500 text-left">ชื่อจริง</p>
                    <input
                      value={fnameStr}
                      type="text"
                      id="firstName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรอกชื่อจริง"
                      required
                      onChange={handleChangeFname}
                    />
                    <ErrorText message={fnameStrError} />
                  </div>
                  <div className="w-full">
                    <p className="text-gray-500 text-left">นามสกุล</p>
                    <input
                      value={lnameStr}
                      type="text"
                      id="lastName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรอกนามสกุล"
                      required
                      onChange={handleChangeLname}
                    />
                    <ErrorText message={lnameStrError} />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-left text-gray-500">เบอร์โทรศัพท์</p>
                <input
                  value={PhoneNumStr}
                  type="text"
                  id="phoneNumber"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกเบอร์โทรศัพท์"
                  required
                  onChange={handleChangePhoneNum}
                />
                <ErrorText message={PhoneNumStrError} />
              </div>
              <div className="flex flex-row space-x-2">
                <div className="flex-1">
                  <button
                    id="prevButton"
                    onClick={handlePrev}
                    className="bg-silverSand text-white w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
                  >
                    ย้อนกลับ
                  </button>
                </div>
                <div className="flex-1">
                  <div>
                    <button
                      id="nextButton"
                      onClick={handleNext}
                      className="bg-silverSand text-white w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
                    >
                      ถัดไป
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 p-5 w-[50rem] ">
              <div className="flex items-start justify-between">
                <div className="relative flex flex-col justify-center items-center w-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    1
                  </div>
                  <p className="text-black">{steps[0]}</p>
                </div>
                <div className="relative flex items-center w-full">
                  <div className="h-1 w-full bg-black" />
                </div>
                <div className="relative flex flex-col justify-center items-center w-full ">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    2
                  </div>
                  <p className="text-black">{steps[1]}</p>
                </div>
                <div className="relative flex items-center w-full">
                  <div className="h-1 w-full bg-black" />
                </div>
                <div className="relative flex flex-col justify-center items-center w-full  ">
                  <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full">
                    3
                  </div>
                  <p className="text-black">{steps[2]}</p>
                </div>
              </div>
              <div>
                <p className="text-left text-gray-500">ที่อยู่</p>
                <input
                  value={addressStr}
                  type="text"
                  id="address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกที่อยู่"
                  required
                  onChange={handleChangeAddress}
                />
                <ErrorText message={addressStrError} />
              </div>
              <div className="space-y-2">
                <div className="flex flex-row gap-10">
                  <div className="w-full">
                    <p className="text-gray-500 text-left">แขวง/ตำบล</p>
                    <input
                      value={subDistrictStr}
                      type="text"
                      id="sub-district"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรอกแขวง/ตำบล"
                      required
                      onChange={handleChangeSubDistrict}
                    />
                    <ErrorText message={subDistrictStrError} />
                  </div>
                  <div className="w-full">
                    <p className="text-gray-500 text-left">เขต/อำเภอ</p>
                    <input
                      value={districtStr}
                      type="text"
                      id="districe"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรอกเขต/อำเภอ"
                      required
                      onChange={handleChangeDistrict}
                    />
                    <ErrorText message={districtStrError} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-row gap-10">
                  <div className="w-full">
                    <p className="text-gray-500 text-left">จังหวัด</p>
                    <input
                      value={provinceStr}
                      type="text"
                      id="province"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรอกจังหวัด"
                      required
                      onChange={handleChangeProvince}
                    />
                    <ErrorText message={provinceStrError} />
                  </div>
                  <div className="w-full">
                    <p className="text-gray-500 text-left">รหัสไปรษณีย์</p>
                    <input
                      value={zipCodeStr}
                      type="text"
                      id="lastName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรอกรหัสไปรษณีย์"
                      required
                      onChange={handleChangeZipCode}
                    />
                    <ErrorText message={zipCodeStrError} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-2">
                <div className="flex-1">
                  <button
                    id="prevButton"
                    onClick={handlePrev}
                    className="bg-silverSand text-white w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
                  >
                    ย้อนกลับ
                  </button>
                </div>
                <div className="flex-1">
                  <button
                    id="registerButton"
                    onClick={handleRegister}
                    className="bg-silverSand text-white w-full p-3 rounded-full hover:bg-stone-700 hover:text-white"
                  >
                    สร้างบัญชี
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
