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
  DropdownMenuTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from "@wexinc-healthbenefits/ben-ui-kit";
import {
  Bell,
  User,
  House,
  Wallet,
  Receipt,
  FileText,
  ChevronDown,
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
  "receipt": Receipt,
  "file-text": FileText,
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
    // Check if current path matches the nav item's href
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
    <header className="sticky top-0 z-50 w-full border-b border-[#e3e7f4] bg-[rgba(255,255,255,0.41)] shadow-[0_2px_16px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <div className="flex h-[80px] items-center px-[32px] gap-[24px]">
        {/* Hamburger (mobile <= lg) — hidden when nav items are suppressed */}
        {!hideNav && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} modal>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
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
                          active ? "text-[#3958c3] font-semibold" : "text-[#14182c] font-normal"
                        }`}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
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
              
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="relative flex h-[44px] flex-col items-center justify-center rounded-[6px] px-[17px] transition-colors hover:bg-black/5"
                >
                  <div className="flex items-center gap-[6px]">
                    {Icon && <Icon className={`h-4 w-4 ${active ? "text-[#3958c3]" : "text-[#14182c]"}`} />}
                    <span className={`text-[14px] leading-[24px] tracking-[-0.084px] ${active ? "font-semibold text-[#3958c3]" : "font-normal text-[#14182c]"}`}>
                      {item.label}
                    </span>
                  </div>
                  {active && (
                    <div className="absolute bottom-0 h-[2px] w-[83px] rounded-[4px] bg-[#3958c3]" />
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
                <Languages className="h-4 w-4 text-[#14182c]" />
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

          {/* Notifications with Badge */}
          <div className="relative flex items-center justify-center">
            <Link
              to="/message-center"
              className="flex h-[44px] w-[44px] items-center justify-center rounded-[6px] hover:bg-black/5 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-[#14182c]" />
            </Link>
            {unreadCount > 0 && (
              <div className="absolute -right-1 -top-1 flex h-[20px] w-[20px] items-center justify-center rounded-[6px] bg-[#d24159] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <span className="text-[12px] font-bold leading-[16px] text-white">
                  {unreadCount}
                </span>
              </div>
            )}
          </div>

          <div className="h-[24px] w-px bg-[#5f6a94]" />

          {/* Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-[44px] w-[44px] items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                aria-label="User profile"
              >
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#d0d6ea] bg-[#e3e7f4]">
                  <User className="h-4 w-4 text-[#14182c]" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[240px] rounded-[8px] border border-border bg-white px-0 py-[8px] shadow-[0px_4px_10px_0px_rgba(2,13,36,0.15),0px_0px_1px_0px_rgba(2,13,36,0.3)]"
            >
              {/* Header Section */}
              <div className="flex gap-[8px] items-center pl-[12px] pr-0 py-[8px]">
                <div className="flex items-center justify-center shrink-0 size-[16px]">
                  <User className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex flex-col items-start justify-center flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground tracking-[-0.084px] leading-[24px]">
                    WEX, Inc.
                  </p>
                  <p className="font-normal text-[13px] text-muted-foreground tracking-[-0.0325px] leading-[24px]">
                    Switch Account
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Menu Items */}
              <div className="flex flex-col">
                {[
                  { label: "My Profile", subPage: "my-profile" },
                  { label: "Dependents", subPage: "dependents" },
                  { label: "Beneficiaries", subPage: "beneficiaries" },
                  { label: "Authorized Signers", subPage: "authorized-signers" },
                  { label: "Banking", subPage: "banking" },
                  { label: "Debit Card", subPage: "debit-card" },
                  { label: "Login and Security", subPage: "login-security" },
                  { label: "Communication Preferences", subPage: "communication" },
                ].map((item) => {
                  const isActive = isOnMyProfile && currentSubPage === item.subPage;
                  return (
                    <DropdownMenuItem
                      key={item.subPage}
                      onClick={() => handleProfileNavigation(item.subPage)}
                      className={`flex items-center gap-[8px] pl-[12px] pr-0 py-[8px] text-sm tracking-[-0.084px] ${
                        isActive
                          ? "bg-[#f1fafe] text-primary"
                          : "text-foreground hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
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

