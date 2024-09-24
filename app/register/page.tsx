import Link from "next/link";
import Stepper from "../components/Stepper";

export default function Register() {
    return (
        <div className="h-screen flex justify-center items-center ">
            <div className="text-center space-y-16">
                <div className="space-y-2">
                    <p className="font-bold text-3xl">สร้างบัญชีผู้ใช้</p>
                    <p className="font-bold text-xs">มีบัญชีผู้ใช้อยู่แล้ว? <Link href="/" className="underline">เข้าสู่ระบบ</Link></p>
                </div>
                <Stepper />
            </div>
        </div>
    )
}