// Asset URLs exported from Figma
const ASSETS = {
  frame1: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/af1a6401-a366-4c1a-a086-0f5c414707d4",
  azText: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/20957029-694f-46bf-8fbc-499b5d0312c8",
  azMark: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c9cf010f-29aa-4666-8e45-d5517c86e635",
  imagePlaceholder: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6dbf487f-05b6-4a0d-bb0d-a7d1cdb0300c",
};

export default function BreakpointDesktop() {
  return (
    <div className="relative flex flex-row justify-center items-center gap-[32px] w-[1440px] h-[428px] bg-[var(--Background-Supporting-1,#ebefee)] shrink-0" data-name="Breakpoint=Desktop" data-node-id="12950:24813">
      <div className="absolute flex flex-row justify-between gap-[32px] w-[1180px] h-full shrink-0" data-name="Content" data-node-id="12950:24817">
        <div className="relative flex flex-col w-[574px] h-[274px] shrink-0" data-name="Frame 1" data-node-id="12950:24795">
          <img
            src={ASSETS.frame1}
            alt="Frame 1"
            className="relative flex flex-col gap-[10px] py-[32px] w-fit h-fit shrink-0"
            data-node-id="12950:24819"
          />
          <div className="relative flex flex-col gap-[16px] w-fit h-fit shrink-0" data-name="Text + Button" data-node-id="12950:24810">
            <div className="relative w-[574px] h-fit bg-[var(--Text-Title-1,#830051)] font-['Lexia',sans-serif] font-normal text-[56px] leading-[60px] text-left text-[color:var(--Text-Title-1,#830051)] shrink-0" data-node-id="12950:24787">
              <p className="whitespace-pre-wrap">An impact header</p>
            </div>
            <div className="relative w-[574px] h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[18px] leading-[28px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12950:24788">
              <p className="whitespace-pre-wrap">A subheading that addresses the what, the why we should care and hopefully some social proof.</p>
            </div>
            <div className="relative flex flex-row justify-center items-center gap-[8px] px-[16px] w-fit h-[42px] rounded-[4px] bg-[var(--Button-Primary-Background,#d0006f)] border-[1px] border-solid border-[#d0006f] shrink-0" data-name="Button" data-node-id="12950:24789">

              <div className="relative w-fit h-fit bg-[var(--Button-Primary-Text,#ffffff)] font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] text-center text-[color:var(--Button-Primary-Text,#ffffff)] shrink-0" data-node-id="I12950:24789;12077:109144">
                <p className="whitespace-pre-wrap">Button text</p>
              </div>

            </div>
          </div>
        </div>
        <img
          src={ASSETS.imagePlaceholder}
          alt="Image Placeholder"
          className="relative w-[574px] h-full overflow-hidden shrink-0" style={{ overflow: "hidden" }}
          data-node-id="12950:24804"
        />
      </div>

    </div>
  );
}
