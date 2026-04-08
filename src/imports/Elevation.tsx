function Component0None() {
  return <div className="absolute bg-white left-[37px] rounded-[18.101px] size-[180px] top-[47px]" data-name="0(None)" />;
}

function Component1Subtle() {
  return <div className="absolute bg-white left-[273px] rounded-[18.101px] shadow-[0px_1.508px_4.525px_0px_rgba(43,49,78,0.04)] size-[180px] top-[47px]" data-name="1 (Subtle)" />;
}

function Component2Low() {
  return <div className="absolute bg-white left-[509px] rounded-[18.101px] shadow-[0px_1.508px_4.525px_0px_rgba(43,49,78,0.03),0px_3.017px_9.051px_0px_rgba(43,49,78,0.05)] size-[180px] top-[47px]" data-name="2 (Low)" />;
}

function Component3Medium() {
  return <div className="absolute bg-white left-[745px] rounded-[18.101px] shadow-[0px_3.017px_9.051px_0px_rgba(43,49,78,0.04),0px_6.034px_18.101px_0px_rgba(43,49,78,0.06)] size-[180px] top-[47px]" data-name="3 (Medium)" />;
}

function Component4High() {
  return <div className="absolute bg-white left-[981px] rounded-[18.101px] shadow-[0px_6.034px_18.101px_0px_rgba(43,49,78,0.05),0px_12.067px_30.169px_0px_rgba(43,49,78,0.07)] size-[180px] top-[47px]" data-name="4 (High)" />;
}

function Component6Floating() {
  return <div className="absolute bg-white left-[1453px] rounded-[18.101px] shadow-[0px_36.202px_84.472px_0px_rgba(43,49,78,0.1),0px_18.101px_42.236px_0px_rgba(43,49,78,0.08)] size-[180px] top-[47px]" data-name="6 (Floating)" />;
}

function Component5Elevated() {
  return <div className="absolute bg-white left-[1217px] rounded-[18.101px] shadow-[0px_9.051px_24.135px_0px_rgba(43,49,78,0.06),0px_18.101px_42.236px_0px_rgba(43,49,78,0.08)] size-[180px] top-[47px]" data-name="5 (Elevated)" />;
}

function Component7Highest() {
  return <div className="absolute bg-white left-[1689px] rounded-[18.101px] shadow-[0px_36.202px_84.472px_0px_rgba(43,49,78,0.1),0px_18.101px_42.236px_0px_rgba(43,49,78,0.08)] size-[180px] top-[47px]" data-name="7 (Highest)" />;
}

export default function Elevation() {
  return (
    <div className="relative size-full" data-name="Elevation">
      <Component0None />
      <Component1Subtle />
      <Component2Low />
      <Component3Medium />
      <Component4High />
      <Component6Floating />
      <Component5Elevated />
      <Component7Highest />
    </div>
  );
}