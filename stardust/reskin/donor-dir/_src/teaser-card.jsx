// Asset URLs exported from Figma
const ASSETS = {
  imagePlaceholder: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e3cc46ef-d04d-4bb7-88ec-31041524cac2",
};

export default function BreakpointDesktop() {
  return (
    <div className="relative flex flex-col items-center w-[527px] h-fit rounded-[8px] bg-[var(--Background-Supporting-1,#ebefee)] overflow-hidden shrink-0" style={{ overflow: "hidden" }} data-name="Breakpoint=Desktop" data-node-id="12436:14706">
      <img
        src={ASSETS.imagePlaceholder}
        alt="Image Placeholder"
        className="absolute w-full h-[220px] overflow-hidden shrink-0" style={{ overflow: "hidden" }}
        data-node-id="12436:14660"
      />
      <div className="absolute flex flex-col gap-[16px] p-[24px] w-full h-fit shrink-0" data-name="Frame 2" data-node-id="12436:14661">
        <div className="relative flex flex-col gap-[16px] w-fit h-fit shrink-0" data-name=".Teaser / Card content" data-node-id="12436:14698">
          <div className="relative flex flex-col gap-[16px] w-[479px] h-fit shrink-0" data-name="Title + body" data-node-id="I12436:14698;12436:14673">
            <div className="relative flex flex-row items-center gap-[10px] w-fit h-fit shrink-0" data-name=".Teaser / Card Tag" data-node-id="I12436:14698;13024:844">
              <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-bold text-[18px] leading-[28px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12436:14698;13024:844;13024:834">
                <p className="whitespace-pre-wrap">Event</p>
              </div>
            </div>
            <div className="relative flex flex-row justify-center items-center gap-[10px] w-[326px] h-fit shrink-0" data-name=".Title" data-node-id="I12436:14698;12534:1264">
              <div className="relative w-full h-fit bg-[var(--Text-Title-2,#d0006f)] font-['Lexia',sans-serif] font-normal text-[26px] leading-[34px] text-left text-[color:var(--Text-Title-2,#d0006f)] shrink-0" data-node-id="I12436:14698;12534:1264;12529:1209">
                <p className="whitespace-pre-wrap">The most inspiring heading</p>
              </div>
            </div>
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[18px] leading-[28px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12436:14698;12436:14675">
              <p className="whitespace-pre-wrap">A subheading that addresses the what, the why we should care and hopefully some social proof.</p>
            </div>
          </div>
          <div className="relative flex flex-row justify-center items-center gap-[8px] px-[16px] w-fit h-[42px] rounded-[4px] bg-[var(--Button-Primary-Background,#d0006f)] border-[1px] border-solid border-[#d0006f] shrink-0" data-name="Button" data-node-id="I12436:14698;12436:14676">

            <div className="relative w-fit h-fit bg-[var(--Button-Primary-Text,#ffffff)] font-['Inter',sans-serif] font-bold text-[16px] leading-[24px] text-center text-[color:var(--Button-Primary-Text,#ffffff)] shrink-0" data-node-id="I12436:14698;12436:14676;12077:109144">
              <p className="whitespace-pre-wrap">Primary action</p>
            </div>

          </div>
        </div>
      </div>


    </div>
  );
}
