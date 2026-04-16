import { useState, useEffect, useRef } from "react";
import { Mic, Send, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PLACEHOLDER_PREFIX = "Ask me… ";

const placeholderContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.025 } },
};

const letterVariants = {
  initial: {
    opacity: 0,
    filter: "blur(12px)",
    y: 10,
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      opacity: { duration: 0.25 },
      filter: { duration: 0.4 },
      y: { type: "spring" as const, stiffness: 80, damping: 20 },
    },
  },
};

export function AiChatInput({ 
  onSubmit,
  autocompletePhrase,
  accountType = "FSA"
}: { 
  onSubmit?: (value: string) => void;
  autocompletePhrase?: string;
  accountType?: "FSA" | "HSA" | "LPFSA";
}) {
  const displayAccountType = accountType === "LPFSA" ? "FSA" : accountType;
  
  const QUERIES = [
    `Is toothpaste ${displayAccountType} eligible?`,
    `Can I use my ${displayAccountType} for dental?`,
    "why my claim needs attention",
    "what document I need to upload",
    "how to get reimbursed",
    `what I can use my ${displayAccountType} for`,
    "how much I have left to spend",
    "what expenses are eligible",
    "how long reimbursements take",
    `what happens if I don't use my ${displayAccountType}`,
  ];

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [queryIndex, setQueryIndex] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showPlaceholder = !isFocused && !inputValue && !isDropdownOpen;

  const isPrefix = !!autocompletePhrase && inputValue.length > 0 && autocompletePhrase.toLowerCase().startsWith(inputValue.toLowerCase());
  const prediction = isPrefix ? autocompletePhrase.slice(inputValue.length) : "";

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showPlaceholder || !hasAnimatedIn) return;

    // 3 seconds of inactivity before cycling
    const timeout = setTimeout(() => {
      setQueryIndex((prev) => (prev + 1) % QUERIES.length);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showPlaceholder, queryIndex, hasAnimatedIn]);

  const handleSuggestionClick = (query: string) => {
    setInputValue(query);
    setIsDropdownOpen(false);
    setIsFocused(true);
    inputRef.current?.focus();
    if (onSubmit) {
      onSubmit(query);
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim() && onSubmit) {
      onSubmit(inputValue);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={() => {
        if (isFocused && !inputValue) setIsDropdownOpen(true);
      }}
      onMouseLeave={() => {
        if (!isFocused) setIsDropdownOpen(false);
      }}
    >
      <div
        className={`relative z-10 flex items-center justify-between rounded-[32px] border border-[#e3e7f4] bg-white py-[11px] pl-[25px] pr-[17px] transition-shadow ${
          isDropdownOpen ? "shadow-md" : ""
        }`}
      >
        <div className="relative flex-1 min-h-[20px] flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value.length > 0) {
                setIsDropdownOpen(false);
              } else if (isFocused) {
                setIsDropdownOpen(true);
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              if (!inputValue) setIsDropdownOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Tab" && prediction) {
                e.preventDefault();
                setInputValue(autocompletePhrase!);
              } else if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="relative z-10 w-full border-0 bg-transparent text-[14px] text-[#14182c] outline-none placeholder-transparent"
          />
          
          {prediction && (
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center overflow-hidden">
              <span className="text-[14px] text-transparent whitespace-pre">{inputValue}</span>
              <span className="text-[14px] text-[#7a87b2] whitespace-pre">{prediction}</span>
              <span className="ml-2 flex items-center gap-[4px] rounded-[4px] border border-[#e3e7f4] bg-[#f8f9fe] px-[6px] py-[2px] text-[10px] font-bold text-[#7a87b2]">
                Tab ⇥
              </span>
            </div>
          )}

          {showPlaceholder && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
              style={{ perspective: "600px" }}
            >
              <motion.span
                className="absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[14px] text-[#7a87b2] flex items-center"
                variants={placeholderContainerVariants}
                initial="initial"
                animate="animate"
                onAnimationComplete={() => setHasAnimatedIn(true)}
              >
                {/* Static Prefix */}
                <span className="flex">
                  {PLACEHOLDER_PREFIX.split("").map((char, i) => (
                    <motion.span
                      key={`p-${i}`}
                      variants={letterVariants}
                      style={{ display: "inline-block" }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>

                {/* Cycling Italic Text */}
                <div className="relative flex items-center h-[20px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={queryIndex}
                      className="absolute left-0 italic whitespace-nowrap"
                      style={{ transformOrigin: "center bottom" }}
                      // If it's the very first render, we don't do the slot-machine entrance
                      // because the parent container is doing the letter-by-letter blur-in
                      initial={
                        queryIndex === 0 && !hasAnimatedIn
                          ? false
                          : {
                              rotateX: 45,
                              y: 15,
                              opacity: 0,
                              filter: "blur(12px)",
                            }
                      }
                      animate={{
                        rotateX: 0,
                        y: [15, 0],
                        opacity: 1,
                        filter: "blur(0px)",
                        transition: {
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1], // softer ease-out
                        },
                      }}
                      exit={{
                        rotateX: [0, -15, -15],
                        y: [0, -4, -40],
                        opacity: [1, 0.8, 0.3],
                        filter: ["blur(0px)", "blur(0px)", "blur(12px)"],
                        transition: {
                          duration: 0.56,
                          ease: ["easeIn", "linear"],
                          times: [0, 0.375, 1],
                        },
                      }}
                    >
                      {/* If it's the first query and hasn't animated in yet, render the letters for the initial blur-in */}
                      {queryIndex === 0 && !hasAnimatedIn
                        ? QUERIES[0].split("").map((char, i) => (
                            <motion.span
                              key={`q-${i}`}
                              variants={letterVariants}
                              style={{ display: "inline-block" }}
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))
                        : QUERIES[queryIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="flex h-[35px] w-[35px] shrink-0 cursor-pointer items-center justify-center rounded-[28px] border border-[#eef2ff] bg-[#eef2ff] transition-colors hover:bg-[#e0e7ff]">
            <Mic className="h-[14px] w-[14px] text-[#3958c3]" />
          </div>
          <div
            className="flex h-[35px] w-[35px] shrink-0 cursor-pointer items-center justify-center rounded-[28px] border border-[#25146f] transition-all hover:bg-[rgba(37,20,111,0.2)]"
            style={{
              backgroundImage:
                "linear-gradient(133.514deg, rgba(37, 20, 111, 0.1) 2.4625%, rgba(200, 16, 46, 0.1) 100%)",
            }}
            onClick={handleSubmit}
          >
            <Send className="h-[14px] w-[14px] text-[#25146f]" />
          </div>
        </div>
      </div>

      {/* Dropdown Suggestions */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-[24px] border border-[#e3e7f4] bg-white py-2 shadow-[0_4px_20px_rgba(43,49,78,0.08)]"
          >
            {/* Recent Chat Item */}
            <button
              type="button"
              className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-[#f8f9fe]"
              onClick={() => handleSuggestionClick(QUERIES[0])}
            >
              <Clock className="h-4 w-4 shrink-0 text-[#7a87b2]" />
              <span className="truncate text-[14px] text-[#14182c]">
                {QUERIES[0]}
              </span>
            </button>

            {/* Divider */}
            <div className="mx-4 my-1 h-[1px] bg-[#e3e7f4]" />

            {/* Suggestions (Max 4) */}
            {QUERIES.slice(1, 5).map((query, i) => (
              <button
                key={i}
                type="button"
                className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-[#f8f9fe]"
                onClick={() => handleSuggestionClick(query)}
              >
                <Sparkles className="h-4 w-4 shrink-0 text-[#3958c3]" />
                <span className="truncate text-[14px] text-[#5f6a94]">
                  {query}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
