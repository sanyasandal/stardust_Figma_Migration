// Asset URLs exported from Figma
const ASSETS = {
  imagePlaceholder: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/60332282-c52e-4eb9-841e-2c69400b504f",
};

export default function BreakpointDesktopAlignmentLeft() {
  return (
    <div className="relative flex flex-row items-center gap-[32px] w-fit h-fit shrink-0" data-name="Breakpoint=Desktop, Alignment=Left" data-node-id="12431:14270">
      <img
        src={ASSETS.imagePlaceholder}
        alt="Image Placeholder"
        className="absolute w-[574px] h-[324px] overflow-hidden shrink-0" style={{ overflow: "hidden" }}
        data-node-id="12431:14241"
      />
      <div className="absolute flex flex-col justify-between gap-[10px] w-[574px] h-[324px] shrink-0" data-name="Frame 2" data-node-id="12431:14245">
        <div className="relative flex flex-col gap-[16px] w-full h-fit shrink-0" data-name="Title + body" data-node-id="12431:14244">
          <div className="relative flex flex-row justify-center items-center gap-[10px] w-full h-fit shrink-0" data-name=".Title" data-node-id="12534:1355">
            <div className="relative w-full h-fit bg-[var(--Text-Title-1,#830051)] font-['Lexia',sans-serif] font-normal text-[26px] leading-[34px] text-left text-[color:var(--Text-Title-1,#830051)] shrink-0" data-node-id="I12534:1355;12529:1209">
              <p className="whitespace-pre-wrap">The most inspiring heading</p>
            </div>
          </div>
          <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[18px] leading-[28px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12431:14243">
            <p className="whitespace-pre-wrap">A subheading that addresses the what, the why we should care and hopefully some social proof.</p>
          </div>
        </div>
        <div className="relative flex flex-row justify-center items-center gap-[8px] px-[16px] w-fit h-[42px] rounded-[4px] bg-[var(--Button-Primary-Background,#d0006f)] border-[1px] border-solid border-[#d0006f] shrink-0" data-name="Button" data-node-id="12431:14252">

          <div className="relative w-fit h-fit bg-[var(--Button-Primary-Text,#ffffff)] font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] text-center text-[color:var(--Button-Primary-Text,#ffffff)] shrink-0" data-node-id="I12431:14252;12077:109144">
            <p className="whitespace-pre-wrap">Primary action</p>
          </div>

        </div>
      </div>

    </div>
  );
}
