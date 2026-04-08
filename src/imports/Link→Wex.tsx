import svgPaths from "./svg-j98j8mo3ag";

function WexLogoRedVectorSvg() {
  return (
    <div className="h-[32px] relative shrink-0 w-[108.499px]" data-name="WEX_Logo_Red_Vector.svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 108.499 32">
        <g clipPath="url(#clip0_6006_51)" id="WEX_Logo_Red_Vector.svg">
          <g id="Group">
            <path d={svgPaths.p2b81e300} fill="var(--fill-0, #C8102E)" id="Vector" />
            <path d={svgPaths.p1a827f72} fill="var(--fill-0, #C8102E)" id="Vector_2" />
            <g id="Group_2">
              <g id="Group_3">
                <path d={svgPaths.p53db480} fill="var(--fill-0, #C8102E)" id="Vector_3" />
                <path d={svgPaths.pd68a500} fill="var(--fill-0, #C8102E)" id="Vector_4" />
              </g>
              <path d={svgPaths.p3c867c0} fill="var(--fill-0, #A01D28)" id="Vector_5" />
            </g>
          </g>
          <path d={svgPaths.p3ac54a00} fill="var(--fill-0, #CE0E2D)" id="Vector_6" />
        </g>
        <defs>
          <clipPath id="clip0_6006_51">
            <rect fill="white" height="32" width="108.499" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function WexLogoRedVectorSvgFill() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-center justify-center overflow-clip relative shrink-0 w-[108.48px]" data-name="WEX_Logo_Red_Vector.svg fill">
      <WexLogoRedVectorSvg />
    </div>
  );
}

export default function LinkWex() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Link → WEX">
      <WexLogoRedVectorSvgFill />
    </div>
  );
}