import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from "@wexinc-healthbenefits/ben-ui-kit";
import {
  User,
  House,
  Wallet,
  FileText,
  Mail,
  ChevronDown,
  ChevronRight,
  Languages,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { navigationItems } from "@/data/mockData";
import { getUnreadCount, UNREAD_COUNT_CHANGED_EVENT } from "@/data/messageCenterUtils";
import { useAuth } from "@/context/AuthContext";
import { PrototypeFloatingControls } from "@/components/PrototypeFloatingControls";

// Icon mapping for navigation items
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "home": House,
  "wallet": Wallet,
  "document": FileText,
  "file-text": FileText,
  "mail": Mail,
};

const languageOptions = [
  "English (Default)",
  "Español",
  "Français",
  "Traditional Chinese",
  "Simplified Chinese",
  "Japanese",
  "Nederlands",
  "Français canadien",
  "Deutsch",
  "Italiano",
  "Português do Brasil",
];

/**
 * Consumer Experience Navigation Header
 * 
 * Custom navigation that matches the Figma design with:
 * - WEX logo on left
 * - Navigation menu items in center
 * - User utilities on right (search, notifications, profile)
 */
interface ConsumerNavigationProps {
  hideNav?: boolean;
  /** Hide conference prototype floating panel (e.g. embedded theming preview). */
  hidePrototypeFloating?: boolean;
}

export function ConsumerNavigation({
  hideNav = false,
  hidePrototypeFloating = false,
}: ConsumerNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(getUnreadCount());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("English (Default)");
  
  // Check if a nav item is currently active based on the URL
  const isActive = (href: string) => {
    // Handle hash links (not real routes)
    if (href.startsWith("#")) return false;
    // Handle root path - check for both "/" and empty string
    if (href === "/") {
      return location.pathname === "/" || location.pathname === "";
    }
    // Query-aware links (e.g. /my-profile?subPage=…)
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      if (location.pathname !== path) return false;
      const expected = new URLSearchParams(query);
      const actual = new URLSearchParams(location.search);
      for (const [key, value] of expected.entries()) {
        if (actual.get(key) !== value) return false;
      }
      return true;
    }
    return location.pathname === href;
  };

  // Check if we're on the my-profile page
  const isOnMyProfile = location.pathname === "/my-profile";
  
  // Get current subPage from URL params
  const searchParams = new URLSearchParams(location.search);
  const currentSubPage = searchParams.get("subPage") || "my-profile";

  // Handle navigation to MyProfile sub-pages
  const handleProfileNavigation = (subPage: string) => {
    navigate(`/my-profile?subPage=${subPage}`);
  };

  // Handle logout - clear auth state and navigate to login page
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Listen for unread count changes
  useEffect(() => {
    // Set initial count
    setUnreadCount(getUnreadCount());

    // Listen for unread count change events
    const handleUnreadCountChange = (event: CustomEvent) => {
      setUnreadCount(event.detail as number);
    };

    window.addEventListener(UNREAD_COUNT_CHANGED_EVENT, handleUnreadCountChange as EventListener);

    // Also listen for storage changes (in case of multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "messageCenter_unreadCount") {
        setUnreadCount(getUnreadCount());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(UNREAD_COUNT_CHANGED_EVENT, handleUnreadCountChange as EventListener);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Close the mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-[#e3e7f4] bg-[rgba(255,255,255,0.41)] shadow-[0_2px_16px_rgba(0,0,0,0.08)] backdrop-blur-md will-change-transform">
      <div className="flex h-[80px] items-center px-[32px] gap-[24px]">
        {/* Hamburger (mobile <= lg) — hidden when nav items are suppressed */}
        {!hideNav && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} modal>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[var(--system-text-primary)] [&_svg]:text-[var(--system-text-primary)]"
                aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[315px] p-0 flex flex-col"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center px-4 py-4">
                <span className="text-lg font-semibold text-foreground">Menu</span>
              </div>

              <nav className="flex flex-col gap-1 px-2 py-3 flex-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const Icon = iconMap[item.icon];
                  const active = isActive(item.href);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  
                  if (hasSubItems) {
                    return (
                      <Accordion key={item.label} type="single" collapsible className="w-full">
                        <AccordionItem value={item.label.toLowerCase()} className="border-none">
                          <AccordionTrigger className="py-3 text-base font-semibold text-foreground px-2 rounded-md hover:bg-muted w-full">
                            <div className="flex items-center gap-2 w-full">
                              {Icon && <Icon className="h-[15.75px] w-[15.75px]" />}
                              <span className="truncate">{item.label}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-0">
                            <div className="flex flex-col gap-2 px-4 py-2">
                              {item.subItems?.map((subItem) => {
                                const subActive = isActive(subItem.href);
                                return (
                                  <SheetClose asChild key={subItem.label}>
                                    <Button
                                      intent="primary"
                                      variant={subActive ? "solid" : "ghost"}
                                      size="lg"
                                      className="justify-start w-full px-2"
                                      asChild
                                    >
                                      <Link to={subItem.href} className="flex items-center gap-2">
                                        <span className="truncate">{subItem.label}</span>
                                      </Link>
                                    </Button>
                                  </SheetClose>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  }
                  
                  const isMessagesItem = item.href === "/message-center";
                  return (
                    <SheetClose asChild key={item.label}>
                      <Button
                        intent="primary"
                        variant={active ? "solid" : "ghost"}
                        size="lg"
                        className="justify-start w-full px-2"
                        asChild
                      >
                        <Link to={item.href} className="flex items-center gap-2">
                          {Icon && <Icon className="h-[15.75px] w-[15.75px]" />}
                          <span className="truncate">{item.label}</span>
                          {isMessagesItem && unreadCount > 0 && (
                            <div className="flex h-[18px] min-w-[18px] items-center justify-center rounded-[6px] bg-[#d24159] px-[3px]">
                              <span className="text-[11px] font-bold leading-none text-white">
                                {unreadCount}
                              </span>
                            </div>
                          )}
                        </Link>
                      </Button>
                    </SheetClose>
                  );
                })}

                <div className="mt-2 border-t border-border pt-3 space-y-2">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="language" className="border-none">
                      <AccordionTrigger className="py-3 text-base font-semibold text-foreground px-2 rounded-md hover:bg-muted">
                        <div className="flex items-center gap-2">
                          <Languages className="h-[15.75px] w-[15.75px]" />
                          <span>{language}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="flex flex-col gap-2 px-2 py-2">
                          {languageOptions.map((lang) => (
                            <SheetClose asChild key={lang}>
                              <Button
                                variant={language === lang ? "solid" : "ghost"}
                                size="lg"
                                className="justify-start w-full"
                                onClick={() => setLanguage(lang)}
                              >
                                {lang}
                              </Button>
                            </SheetClose>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        )}

        {/* Left: Logo */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}WEX_Logo_Red_Vector.svg`}
            alt="WEX"
            className="h-[32px] w-[108.5px] object-contain"
          />
        </Link>

        {/* Right cluster: nav + utilities */}
        <div className="flex flex-1 items-center justify-end gap-[16px] min-w-0">
          {/* Navigation Menu (desktop) — hidden when nav items are suppressed */}
          <nav className={hideNav ? "hidden" : "hidden lg:flex items-center gap-[16px]"}>
            {navigationItems.map((item) => {
              const Icon = iconMap[item.icon];
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const active = hasSubItems 
                ? item.subItems?.some(subItem => isActive(subItem.href)) || false
                : isActive(item.href);
              
              if (hasSubItems) {
                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex h-[44px] items-center justify-center gap-[6px] rounded-[6px] px-[17px] py-[9px] transition-colors hover:bg-black/5 ${
                          active ? "text-primary font-semibold" : "text-foreground font-normal"
                        }`}
                      >
                        {Icon && <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-[#5F6A94]"}`} />}
                        <span className="text-[14px] leading-[24px] tracking-[-0.084px]">{item.label}</span>
                        <ChevronDown className="ml-0.5 h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.subItems?.map((subItem) => {
                        const subActive = isActive(subItem.href);
                        return (
                          <DropdownMenuItem
                            key={subItem.label}
                            asChild
                            className={subActive ? "bg-muted" : ""}
                          >
                            <Link to={subItem.href} className="flex items-center">
                              {subItem.label}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              const isMessages = item.href === "/message-center";
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="relative flex h-[44px] flex-col items-center justify-center rounded-[6px] px-[17px] transition-colors hover:bg-black/5"
                >
                  <div className="flex items-center gap-[6px]">
                    {/* Icon wrapper — badge sits on top of icon for Messages */}
                    {Icon && (
                      <div className="relative">
                        <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-[#5F6A94]"}`} />
                        {isMessages && unreadCount > 0 && (
                          <div className="absolute -top-[8px] -right-[8px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#d24159] px-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                            <span className="text-[10px] font-bold leading-none text-white">
                              {unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <span className={`text-[14px] leading-[24px] tracking-[-0.084px] ${active ? "font-semibold text-primary" : "font-normal text-foreground"}`}>
                      {item.label}
                    </span>
                  </div>
                  {active && (
                    <div className="absolute bottom-0 h-[2px] w-[83px] rounded-[4px] bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: User Navigation */}
          <div className="flex items-center gap-[8px]">
          {/* Language Selector (desktop only; mobile in drawer) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden lg:flex h-[44px] w-[44px] items-center justify-center rounded-[6px] hover:bg-black/5 transition-colors"
                aria-label="Language"
              >
                <Languages className="h-4 w-4 text-[#5F6A94]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {languageOptions.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={language === lang ? "bg-muted" : ""}
                >
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden lg:block h-[24px] w-px bg-[#5f6a94]" />

          {/* Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-[44px] w-[44px] items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                aria-label="User profile"
              >
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#d0d6ea] bg-[#e3e7f4]">
                  <User className="h-4 w-4 text-[#5F6A94]" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[240px] rounded-[8px] border border-border bg-white px-0 py-[8px] shadow-[0px_4px_10px_0px_rgba(2,13,36,0.15),0px_0px_1px_0px_rgba(2,13,36,0.3)]"
            >
              {/* Header Section — navigate to account selection */}
              <DropdownMenuItem asChild className="h-auto cursor-default p-0">
                <Link
                  to="/select-profile"
                  className="flex w-full items-center gap-[8px] rounded-sm py-[8px] pl-[12px] pr-[12px] outline-none hover:bg-gray-50 focus-visible:bg-gray-50"
                  aria-label="Switch account — select profile"
                >
                  <div className="flex size-[16px] shrink-0 items-center justify-center">
                    <User className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
                    <p className="text-sm font-semibold leading-[24px] tracking-[-0.084px] text-foreground">
                      WEX, Inc.
                    </p>
                    <p className="text-[13px] font-normal leading-[24px] tracking-[-0.0325px] text-muted-foreground">
                      Switch Account
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Menu Items */}
              <div className="flex flex-col">
                {[
                  { label: "My Profile", subPage: "my-profile" },
                  { label: "Dependents", subPage: "dependents" },
                  { label: "Beneficiaries", subPage: "beneficiaries" },
                  { label: "Bank Accounts", subPage: "banking" },
                  { label: "Reimbursement Methods", subPage: "reimbursement-method" },
                  { label: "Debit Card", subPage: "debit-card" },
                  { label: "Login and Security", subPage: "login-security" },
                  { label: "Communication Preferences", subPage: "communication" },
                ].map((item) => {
                  const isItemActive = isOnMyProfile && currentSubPage === item.subPage;
                  return (
                    <DropdownMenuItem
                      key={item.subPage}
                      onClick={() => handleProfileNavigation(item.subPage)}
                      className={`flex items-center gap-[8px] pl-[12px] pr-0 py-[8px] text-sm tracking-[-0.084px] ${
                        isItemActive
                          ? "bg-[#f1fafe] text-primary"
                          : "text-foreground hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}

                {/* Resources submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-[8px] pl-[12px] pr-[12px] py-[8px] text-sm tracking-[-0.084px] text-foreground hover:bg-gray-50 cursor-pointer">
                    Resources
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-[180px]">
                    {[
                      { label: "Resources", href: "/resources" },
                      { label: "Forms & Documents", href: "/resources?section=forms" },
                      { label: "Videos & Guides", href: "/resources?section=videos" },
                      { label: "FAQs", href: "/resources?section=faqs" },
                    ].map((res) => (
                      <DropdownMenuItem key={res.href} asChild>
                        <Link to={res.href} className="flex items-center text-sm">
                          {res.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </div>

              <DropdownMenuSeparator />

              {/* Last login */}
              <div className="px-[12px] py-[6px]">
                <p className="text-[12px] text-muted-foreground tracking-[-0.03px]">
                  Last login: 12/11/2025
                </p>
              </div>

              <DropdownMenuSeparator />

              {/* Log Out */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-[8px] pl-[12px] pr-0 py-[8px] text-sm text-foreground tracking-[-0.084px] hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>

    </header>
    {!hideNav && !hidePrototypeFloating && <PrototypeFloatingControls />}
    </>
  );
}

