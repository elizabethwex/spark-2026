import { Printer } from "lucide-react";

export default function HSAEnrollmentSuccess() {
  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="flex flex-col items-center max-w-[442px] w-full">
        <div className="mb-8 w-[362px] h-[317px] flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-[#E8F5F4] rounded-full opacity-60" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-[#00A190] rounded-full opacity-20" />
            </div>

            <div className="relative z-10 flex items-center justify-center">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-teal-600"
              >
                <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M35 60L52 77L85 44" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="absolute top-12 right-20 text-teal-600 text-2xl">+</div>
            <div className="absolute top-8 right-12 text-teal-600 text-lg">+</div>
            <div className="absolute top-16 left-16 text-teal-600 text-xl">+</div>
            <div className="absolute bottom-20 left-12 text-teal-600 text-2xl">+</div>
            <div className="absolute bottom-16 right-16 text-teal-600 text-lg">+</div>
          </div>
        </div>

        <h1 className="font-bold text-[32px] leading-[42px] tracking-[0.64px] text-black text-center mb-4">
          Enrollment Successful!
        </h1>

        <p className="text-base leading-6 tracking-[-0.176px] text-muted-foreground text-center mb-8">
          You will receive an email with your enrollment information.
        </p>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1 text-sm leading-6 tracking-[-0.084px] text-foreground hover:underline rounded-md hover:bg-gray-50 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print enrollment information</span>
        </button>
      </div>
    </div>
  );
}
