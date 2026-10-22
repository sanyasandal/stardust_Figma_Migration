// Asset URLs exported from Figma
const ASSETS = {
  imagePlaceholder: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/8fb9f9d6-4d89-47ca-b6f0-34856cb7ffc7",
  leftSideLabelIcon: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/11623e17-4a3f-40e9-a7df-7b7d8309716a",
  leftSideIconText: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a9a938da-fb4c-442f-b82f-3f5fe4e0e576",
  rightSideTextIcon: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9ef7ce5f-8471-48bd-91e5-6b80758330d6",
};

export default function BreakpointDesktop() {
  return (
    <div className="relative flex flex-row gap-[20px] p-[40px] w-[1440px] h-fit rounded-[8px] bg-[var(--Background-Supporting-2,#ffffff)] border-[4px] border-solid border-[#b2b4b4] shrink-0" data-name="Breakpoint=Desktop" data-node-id="13370:1909">
      <img
        src={ASSETS.imagePlaceholder}
        alt="Image Placeholder"
        className="relative w-[120px] h-[120px] overflow-hidden shrink-0" style={{ overflow: "hidden" }}
        data-node-id="13370:1453"
      />
      <div className="relative flex flex-col gap-[16px] w-full h-fit shrink-0" data-name="Frame 1" data-node-id="13370:1867">
        <div className="relative flex flex-row justify-center items-center gap-[10px] w-[326px] h-fit shrink-0" data-name=".Title" data-node-id="13370:1456">
          <div className="relative w-full h-fit bg-[var(--Text-Title-1,#830051)] font-['Lexia',sans-serif] font-normal text-[26px] leading-[34px] text-left text-[color:var(--Text-Title-1,#830051)] shrink-0" data-node-id="I13370:1456;12529:1209">
            <p className="whitespace-pre-wrap">The most inspiring heading</p>
          </div>
        </div>
        <div className="relative flex flex-row gap-[10px] w-full h-fit shrink-0" data-name=".Text" data-node-id="13370:1865">
          <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I13370:1865;12534:1254">
            <p className="whitespace-pre-wrap">Quis aute iure reprehenderit in voluptate velit esse. Quo usque tandem abutere, Catilina, patientia nostra? A communi observantia non est recedendum. Plura mihi bona sunt, inclinet, amari petere vellent. </p>
          </div>
        </div>
        <div className="relative flex flex-col gap-[4px] w-full h-fit shrink-0" data-name="Input Field" data-node-id="13370:1868">
          <div className="relative flex flex-col gap-[2px] w-full h-fit shrink-0" data-name="Top Content" data-node-id="I13370:1868;12157:3265">
            <div className="relative flex flex-row justify-between items-center gap-[170px] w-[384px] h-fit shrink-0" data-name="Label + Right Side Link" data-node-id="I13370:1868;12160:3282">
              <img
                src={ASSETS.leftSideLabelIcon}
                alt="Left Side: Label + Icon"
                className="relative flex flex-row items-center gap-[2px] w-fit h-fit shrink-0"
                data-node-id="I13370:1868;12128:3190"
              />

            </div>

          </div>
          <div className="relative flex flex-row items-center gap-[8px] px-[16px] w-full h-[54px] rounded-[4px] bg-[var(--Background-Supporting-2,#ffffff)] border-[1px] border-solid border-[#d8dada] shrink-0" data-name="Input Field" data-node-id="I13370:1868;12128:3188">
            <img
              src={ASSETS.leftSideIconText}
              alt="Left Side: Icon + Text"
              className="relative flex flex-row items-center gap-[8px] w-full h-fit shrink-0"
              data-node-id="I13370:1868;12128:3256"
            />
            <img
              src={ASSETS.rightSideTextIcon}
              alt="Right Side: Text + Icon"
              className="relative flex flex-row items-center gap-[2px] w-fit h-fit shrink-0"
              data-node-id="I13370:1868;12160:3278"
            />
          </div>
          <div className="relative w-fit h-fit bg-[var(--Text-Label-2,#656969)] font-['Inter',sans-serif] font-normal text-[12px] leading-[16px] text-left text-[color:var(--Text-Label-2,#656969)] shrink-0" data-node-id="I13370:1868;12128:3258">
            <p className="whitespace-pre-wrap">Supportive text</p>
          </div>
        </div>
        <div className="relative flex flex-row items-center gap-[10px] w-fit h-fit shrink-0" data-name=".Buttons Collage" data-node-id="13370:1892">
          <div className="relative flex flex-row justify-center items-center gap-[8px] px-[16px] w-fit h-[42px] rounded-[4px] bg-[var(--Button-Primary-Background,#d0006f)] border-[1px] border-solid border-[#d0006f] shrink-0" data-name="Button" data-node-id="I13370:1892;13028:1785">

            <div className="relative w-fit h-fit bg-[var(--Button-Primary-Text,#ffffff)] font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] text-center text-[color:var(--Button-Primary-Text,#ffffff)] shrink-0" data-node-id="I13370:1892;13028:1785;12077:109144">
              <p className="whitespace-pre-wrap">Primary Action</p>
            </div>

          </div>
          <div className="relative flex flex-row justify-center items-center gap-[8px] px-[16px] w-fit h-[42px] rounded-[4px] bg-[var(--Button-Secondary-Background,#ffffff)] border-[1px] border-solid border-[#d0006f] shrink-0" data-name="Button" data-node-id="I13370:1892;13028:1786">

            <div className="relative w-fit h-fit bg-[var(--Button-Secondary-Text,#d0006f)] font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] text-center text-[color:var(--Button-Secondary-Text,#d0006f)] shrink-0" data-node-id="I13370:1892;13028:1786;12084:109167">
              <p className="whitespace-pre-wrap">Secondary Action</p>
            </div>

          </div>
          <div className="relative flex flex-row justify-center items-center gap-[8px] w-fit h-fit rounded-[4px] shrink-0" data-name="Button" data-node-id="I13370:1892;13028:1787">

            <div className="relative w-fit h-fit bg-[var(--Button-Tertiary-Text,#3c4242)] font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] text-center text-[color:var(--Button-Tertiary-Text,#3c4242)] underline shrink-0" data-node-id="I13370:1892;13028:1787;12084:109180">
              <p className="whitespace-pre-wrap">Tertiary Action</p>
            </div>

          </div>
        </div>
        <div className="relative flex flex-row gap-[10px] w-full h-fit shrink-0" data-name=".Text" data-node-id="13370:1905">
          <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I13370:1905;12534:1254">
            <p className="whitespace-pre-wrap">Quis aute iure reprehenderit in voluptate velit esse. Quo usque tandem abutere, Catilina, patientia nostra? A communi observantia non est recedendum. Plura mihi bona sunt, inclinet, amari petere vellent. </p>
          </div>
        </div>
      </div>
    </div>
  );
}
