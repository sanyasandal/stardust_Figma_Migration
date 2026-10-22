// Asset URLs exported from Figma
const ASSETS = {
  imagePlaceholder: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b4f1511a-c5d4-42e6-a279-e81405b4639f",
  button: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/db22ecc4-d8bb-4f42-8088-5bf590c86c81",
};

export default function ElementTypeListingCardBreakpointDesktop() {
  return (
    <div className="relative flex flex-row gap-[40px] w-[1180px] h-fit shrink-0" data-name="Element type=Listing Card, Breakpoint=Desktop" data-node-id="12534:1414">
      <img
        src={ASSETS.imagePlaceholder}
        alt="Image Placeholder"
        className="relative w-[336px] h-[190px] overflow-hidden shrink-0" style={{ overflow: "hidden" }}
        data-node-id="12534:1419"
      />
      <div className="relative flex flex-col gap-[16px] w-full h-fit shrink-0" data-name="Frame 1" data-node-id="12534:1422">
        <div className="relative flex flex-row justify-center items-center gap-[10px] w-[451px] h-fit shrink-0" data-name=".Title" data-node-id="12534:1415">
          <div className="relative w-full h-fit bg-[var(--Text-Title-1,#830051)] font-['Lexia',sans-serif] font-normal text-[36px] leading-[40px] text-left text-[color:var(--Text-Title-1,#830051)] shrink-0" data-node-id="I12534:1415;12529:1208">
            <p className="whitespace-pre-wrap">The most inspiring heading</p>
          </div>
        </div>
        <div className="relative flex flex-row gap-[10px] w-full h-fit shrink-0" data-name=".Text" data-node-id="12534:1416">
          <div className="relative w-full h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12534:1416;12534:1254">
            <p className="whitespace-pre-wrap">One of the biggest challenges with DCM is that it’s highly heterogeneous, both in its presentation and its underlying aetiology. While environmental factors, such as infections or exposure to certain toxins, are linked with DCM, genetics also play a role: up to 35% of DCM cases have an identifiable genetic cause. Research shows that genetic variants associated with DCM typically disrupt the structure and function of cardiomyocytes.</p>
          </div>
        </div>
      </div>
      <img
        src={ASSETS.button}
        alt="Button"
        className="relative flex flex-row justify-center items-center gap-[8px] w-[42px] h-[42px] rounded-[4px] shrink-0"
        data-node-id="12534:1438"
      />
    </div>
  );
}
