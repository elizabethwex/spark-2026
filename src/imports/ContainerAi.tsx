import svgPaths from "./svg-i1hhvy1f50";
import { imgAfter } from "./svg-yli6w";

function Before() {
  return (
    <div className="absolute blur-[0.5px] inset-0 rounded-[20px]" data-name="::before">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[20px]" data-name="::before:shadow">
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0.5px_0.1px_#f2f5fc]" />
      </div>
    </div>
  );
}

function DivSiriOrb() {
  return (
    <div className="overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="div.siri-orb">
      <Before />
      <div className="absolute border border-black border-solid inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0%_0%] mask-size-[100%_100%] rounded-[20px]" data-name="::after" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 40 40\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(2.8284 0 0 2.8284 20 20)\\'><foreignObject x=\\'-134.35\\' y=\\'-134.35\\' width=\\'268.7\\' height=\\'268.7\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgba(0, 67, 198, 0.8) -26.442%, rgba(13, 67, 191, 0.8) -22.58%, rgba(26, 67, 185, 0.8) -18.718%, rgba(53, 67, 171, 0.8) -10.993%, rgba(105, 66, 144, 0.8) 4.4565%, rgba(158, 66, 116, 0.8) 19.906%, rgba(210, 65, 89, 0.8) 35.355%, rgba(158, 66, 116, 0.8) 44.906%, rgba(105, 66, 144, 0.8) 54.457%, rgba(53, 67, 171, 0.8) 64.007%, rgba(26, 67, 185, 0.8) 68.782%, rgba(13, 67, 191, 0.8) 71.17%, rgba(0, 67, 198, 0.8) 73.558%, rgba(13, 67, 191, 0.8) 77.42%, rgba(26, 67, 185, 0.8) 81.282%, rgba(53, 67, 171, 0.8) 89.007%, rgba(105, 66, 144, 0.8) 104.46%, rgba(158, 66, 116, 0.8) 119.91%, rgba(210, 65, 89, 0.8) 135.36%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')", maskImage: `url('${imgAfter}')` }} />
    </div>
  );
}

function H4TextSm() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[244px]" data-name="h4.text-sm">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#253341] text-[24px] tracking-[-0.456px] w-full">
        <p className="leading-[32px]">Good morning, Penny</p>
      </div>
    </div>
  );
}

function PTextXs() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[167px]" data-name="p.text-xs">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#515e6c] text-[14px] tracking-[-0.084px] w-full">
        <p className="leading-[24px]">Your journey begins here!</p>
      </div>
    </div>
  );
}

function DivFlex() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="div.flex-1">
      <H4TextSm />
      <PTextXs />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <DivFlex />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center pl-[16px] py-[8px] relative w-full">
          <DivSiriOrb />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(37,51,65,0.5)] w-full">
        <p className="leading-[normal]">Ask the assistant...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-[2px] pt-px relative rounded-[inherit] w-full">
        <Container3 />
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M8 12.6667V14.6667" id="Vector" stroke="var(--stroke-0, #3958C3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4f72080} id="Vector_2" stroke="var(--stroke-0, #3958C3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1c53e800} id="Vector_3" stroke="var(--stroke-0, #3958C3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ButtonVoiceInput() {
  return (
    <div className="bg-[rgba(57,88,195,0.05)] content-stretch flex items-center justify-center min-h-[44px] min-w-[44px] p-px relative rounded-[33554400px] shrink-0 size-[44px]" data-name="Button - Voice input">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <Svg />
    </div>
  );
}

function ButtonVoiceInputMargin() {
  return (
    <div className="h-[44px] min-h-[44px] min-w-[52px] relative shrink-0 w-[52px]" data-name="Button - Voice input:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-h-[inherit] min-w-[inherit] pl-[8px] relative size-full">
        <ButtonVoiceInput />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6006_2365)" id="Frame">
          <path d={svgPaths.p22f0380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.5693 1.43133L7.276 8.724" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6006_2365">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SendMessage() {
  return (
    <div className="content-stretch flex items-center justify-center min-h-[44px] min-w-[44px] relative rounded-[9999px] shrink-0 size-[44px]" data-name="Send message" style={{ backgroundImage: "linear-gradient(129.56deg, rgb(172, 17, 58) 6.6829%, rgb(37, 20, 111) 78.923%)" }}>
      <Frame />
    </div>
  );
}

function SendMessageMargin() {
  return (
    <div className="h-[44px] min-h-[44px] min-w-[48px] relative shrink-0 w-[48px]" data-name="Send message:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-h-[inherit] min-w-[inherit] pl-[4px] relative size-full">
        <SendMessage />
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-white relative rounded-[33554400px] shrink-0 w-full" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[#e3e7f4] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[17px] pr-[5px] py-[5px] relative w-full">
          <Input />
          <ButtonVoiceInputMargin />
          <SendMessageMargin />
        </div>
      </div>
    </div>
  );
}

function NavQuickActions() {
  return (
    <div className="relative shrink-0 w-full" data-name="Nav - Quick actions">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-start flex flex-wrap gap-[0px_8px] items-start px-[4px] relative w-full">
        <div className="content-stretch flex gap-[7px] items-center px-[13.25px] py-[9.75px] relative rounded-[28px] shrink-0" data-name="button-large">
          <div aria-hidden="true" className="absolute border border-[#3958c3] border-solid inset-0 pointer-events-none rounded-[28px]" />
          <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3958c3] text-[15.75px] whitespace-nowrap">Reimburse Myself</p>
        </div>
        <div className="content-stretch flex gap-[7px] items-center px-[13.25px] py-[9.75px] relative rounded-[28px] shrink-0" data-name="button-large">
          <div aria-hidden="true" className="absolute border border-[#3958c3] border-solid inset-0 pointer-events-none rounded-[28px]" />
          <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3958c3] text-[15.75px] whitespace-nowrap">Send Payment</p>
        </div>
        <div className="content-stretch flex gap-[7px] items-center px-[13.25px] py-[9.75px] relative rounded-[28px] shrink-0" data-name="button-large">
          <div aria-hidden="true" className="absolute border border-[#3958c3] border-solid inset-0 pointer-events-none rounded-[28px]" />
          <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3958c3] text-[15.75px] whitespace-nowrap">Contribute to HSA</p>
        </div>
        <div className="content-stretch flex gap-[7px] items-center px-[13.25px] py-[9.75px] relative rounded-[28px] shrink-0" data-name="button-large">
          <div aria-hidden="true" className="absolute border border-[#3958c3] border-solid inset-0 pointer-events-none rounded-[28px]" />
          <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3958c3] text-[15.75px] whitespace-nowrap">Manage My Expenses</p>
        </div>
        <div className="content-stretch flex gap-[7px] items-center px-[13.25px] py-[9.75px] relative rounded-[28px] shrink-0" data-name="button-large">
          <div aria-hidden="true" className="absolute border border-[#3958c3] border-solid inset-0 pointer-events-none rounded-[28px]" />
          <p className="font-['Inter:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3958c3] text-[15.75px] whitespace-nowrap">Enroll in HSA</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderOverlayBlur() {
  return (
    <div className="relative rounded-[24px] shrink-0 w-full" data-name="Background+Border+OverlayBlur" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1216 232.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(178.85 0 0 23.016 -48.64 69.75)\\'><stop stop-color=\\'rgba(23,45,161,0.09)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,45,161,0)\\' offset=\\'0.5\\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1216 232.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(178.85 0 0 24.66 1264.6 174.37)\\'><stop stop-color=\\'rgba(200,16,46,0.07)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(200,16,46,0)\\' offset=\\'0.45\\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1216 232.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(94.583 0 0 46.033 668.8 325.5)\\'><stop stop-color=\\'rgba(23,45,161,0.04)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,45,161,0)\\' offset=\\'0.4\\'/></radialGradient></defs></svg>'), linear-gradient(90deg, rgba(255, 255, 255, 0.93) 0%, rgba(255, 255, 255, 0.93) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#e3e7f4] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[17px] relative w-full">
        <Container1 />
        <OverlayBorder />
        <NavQuickActions />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start shrink-0 sticky top-0 w-full" data-name="Container">
      <BackgroundBorderOverlayBlur />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] shrink-0 sticky top-0 w-full z-[1]" data-name="Margin">
      <Container />
    </div>
  );
}

export default function ContainerAi() {
  return (
    <div className="content-stretch flex flex-col isolate items-start relative size-full" data-name="Container - AI">
      <Margin />
    </div>
  );
}