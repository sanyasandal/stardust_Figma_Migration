// Asset URLs exported from Figma
const ASSETS = {
  brandLogos: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/13e077e6-42f8-4f07-88c5-bace6fa86edc",
  socialIcons: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c954cc4a-b001-44d8-9447-fda600fbc241",
};

export default function BreakpointDesktop() {
  return (
    <div className="relative flex flex-col items-center gap-[10px] py-[40px] w-[1440px] h-fit bg-[var(--Background-Supporting-2,#ffffff)] border-[1px] border-solid border-[#ebefee] shrink-0" data-name="Breakpoint=Desktop" data-node-id="12406:12186">
      <div className="relative flex flex-col gap-[48px] w-[1180px] h-fit shrink-0" data-name="Container" data-node-id="12406:12184">
        <div className="relative flex flex-row justify-between items-center gap-[45px] w-full h-fit shrink-0" data-name="Main Content" data-node-id="12406:12165">
          <div className="relative flex flex-col gap-[16px] w-[300px] h-fit shrink-0" data-name="1st Column" data-node-id="12406:12144">
            <img
              src={ASSETS.brandLogos}
              alt="Brand Logos"
              className="relative w-[126px] h-[30px] overflow-hidden shrink-0" style={{ overflow: "hidden" }}
              data-node-id="12406:12140"
            />
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12143">
              <p className="whitespace-pre-wrap">The AstraZeneca portal was created with the intention of proposing a space for digital dialogue between doctors, specialists and the company.</p>
            </div>
          </div>
          <div className="relative flex flex-col gap-[16px] w-[300px] h-fit shrink-0" data-name="2nd Column" data-node-id="12406:12154">
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12149">
              <p className="whitespace-pre-wrap">Privacy Notice</p>
            </div>
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12150">
              <p className="whitespace-pre-wrap">Cookie Notice</p>
            </div>
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12151">
              <p className="whitespace-pre-wrap">Prescribing Information</p>
            </div>
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12152">
              <p className="whitespace-pre-wrap">Important Safety Information</p>
            </div>
          </div>
          <div className="relative flex flex-col gap-[16px] w-[300px] h-fit shrink-0" data-name="3rd Column" data-node-id="12406:12155">
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12160">
              <p className="whitespace-pre-wrap">Legal Statement</p>
            </div>
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12161">
              <p className="whitespace-pre-wrap">Site Map</p>
            </div>
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12162">
              <p className="whitespace-pre-wrap">AstraZeneca</p>
            </div>
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12163">
              <p className="whitespace-pre-wrap">Contact Us</p>
            </div>
          </div>
        </div>
        <div className="relative flex flex-row justify-between items-end gap-[210px] w-full h-fit shrink-0" data-name="Social + text" data-node-id="12406:12182">
          <img
            src={ASSETS.socialIcons}
            alt="Social Icons"
            className="relative flex flex-row items-center gap-[16px] w-fit h-fit shrink-0"
            data-node-id="12406:12170"
          />
          <div className="relative flex flex-row justify-center items-center gap-[10px] w-fit h-fit shrink-0" data-name="Frame 1" data-node-id="12406:12183">
            <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-medium text-[12px] leading-[20px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="12406:12181">
              <p className="whitespace-pre-wrap">XX-XXXX-01/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
