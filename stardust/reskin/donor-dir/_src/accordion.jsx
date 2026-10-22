// Asset URLs exported from Figma
const ASSETS = {
  generalIcons: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ac91b256-ed60-4999-ba80-4b4b8ab84fd3",
};

export default function TypeDesktopStateExpanded() {
  return (
    <div className="relative flex flex-col items-center gap-[20px] w-[1440px] h-fit shrink-0" data-name="Type=Desktop, State=Expanded" data-node-id="12362:10348">
      <div className="relative flex flex-row items-center gap-[24px] w-full h-fit max-w-[1180px] shrink-0" data-name="Frame 1" data-node-id="12362:10349">
        <div className="relative w-full h-fit bg-[var(--Text-Title-1,#830051)] font-['Lexia',sans-serif] font-normal text-[36px] leading-[40px] text-left text-[color:var(--Text-Title-1,#830051)] shrink-0" data-node-id="12362:10350">
          <p className="whitespace-pre-wrap">Accordion title</p>
        </div>
        <img
          src={ASSETS.generalIcons}
          alt="General Icons"
          className="relative w-[20px] h-[20px] shrink-0" style={{ transform: "rotate(-3.141592653589793deg)" }}
          data-node-id="12362:10351"
        />
      </div>
      <div className="relative w-full h-[1px] bg-[var(--Forms-Border-1,#ebefee)] overflow-hidden shrink-0" style={{ overflow: "hidden" }} data-name="Frame 2" data-node-id="12362:10352" />
      <div className="relative flex flex-col gap-[10px] px-[130px] w-fit h-fit shrink-0" data-name="Frame 2" data-node-id="12850:21914">
        <div className="relative flex flex-col gap-[16px] w-[1180px] h-fit shrink-0" data-name=".Block Element" data-node-id="12850:21898">
          <div className="relative flex flex-row gap-[10px] w-full h-fit shrink-0" data-name=".Title" data-node-id="I12850:21898;12534:1395">
            <div className="relative w-full h-fit bg-[var(--Text-Title-1,#830051)] font-['Lexia',sans-serif] font-normal text-[46px] leading-[50px] text-left text-[color:var(--Text-Title-1,#830051)] shrink-0" data-node-id="I12850:21898;12534:1395;12529:1207">
              <p className="whitespace-pre-wrap">The most inspiring heading</p>
            </div>
          </div>
          <div className="relative flex flex-row gap-[10px] w-full h-fit shrink-0" data-name=".Text" data-node-id="I12850:21898;12534:1397">
            <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12850:21898;12534:1397;12534:1254">
              <p className="whitespace-pre-wrap">One of the biggest challenges with DCM is that it’s highly heterogeneous, both in its presentation and its underlying aetiology. While environmental factors, such as infections or exposure to certain toxins, are linked with DCM, genetics also play a role: up to 35% of DCM cases have an identifiable genetic cause.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
