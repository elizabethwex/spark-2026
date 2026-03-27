import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { ConsumerFooter } from "@/components/layout/Footer";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { Download, FileText } from "lucide-react";

const years = ["2025", "2024", "2023", "2022", "2021"];

const monthNames = [
  "December",
  "November",
  "October",
  "September",
  "August",
  "July",
  "June",
  "May",
  "April",
  "March",
  "February",
  "January",
];

export default function AccountDocuments() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isYearSelectFocused, setIsYearSelectFocused] = useState(false);

  // Generate HSA Account Summaries for the selected year
  const hsaAccountSummaries = useMemo(() => {
    return monthNames.map((month) => `${month} ${selectedYear} - HSA account summary`);
  }, [selectedYear]);

  // Generate HSA Tax Documents for the selected year
  const hsaTaxDocuments = useMemo(() => {
    return [`${selectedYear} HSA Contributions (Form 5498-SA)`];
  }, [selectedYear]);

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-[1376px]">
          {/* Page Header */}
          <div className="mb-6 space-y-4 md:mb-8">
            <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] text-black">
              Account Documents
            </h1>

            {/* Year Selector with Float Label */}
            <div className="relative w-[216px]">
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
                onOpenChange={(open) => setIsYearSelectFocused(open)}
              >
                <SelectTrigger className="h-10 pt-3 pb-1">
                  <SelectValue placeholder=" " />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label
                className={`absolute pointer-events-none origin-top-left transition-all duration-200 ease-out left-3 text-sm text-muted-foreground ${
                  selectedYear || isYearSelectFocused
                    ? "top-1 scale-75 -translate-y-0 text-xs"
                    : "top-2.5"
                }`}
              >
                Select Year
              </label>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* HSA Account Summaries Card */}
            <div className="w-full lg:w-[676px]">
              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold leading-8 tracking-[-0.34px] text-foreground">
                    HSA Account Summaries
                  </h2>
                  <Separator />

                  {/* Document List */}
                  <div className="flex flex-col gap-3">
                    {hsaAccountSummaries.map((document, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <a
                          href="#"
                          className="flex-1 text-sm font-normal leading-6 tracking-[-0.084px] text-primary hover:underline"
                        >
                          {document}
                        </a>
                        <Download className="h-3.5 w-3.5 text-primary flex-shrink-0 cursor-pointer hover:opacity-80" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* HSA Tax Documents Card */}
            <div className="w-full lg:w-[676px]">
              <div className="bg-white border border-border rounded-2xl p-6">
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold leading-8 tracking-[-0.34px] text-foreground">
                    HSA Tax Documents
                  </h2>
                  <Separator />

                  {/* Document List */}
                  <div className="flex flex-col gap-3">
                    {hsaTaxDocuments.map((document, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <a
                          href="#"
                          className="flex-1 text-sm font-normal leading-6 tracking-[-0.084px] text-primary hover:underline"
                        >
                          {document}
                        </a>
                        <Download className="h-3.5 w-3.5 text-primary flex-shrink-0 cursor-pointer hover:opacity-80" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConsumerFooter />
    </div>
  );
}

