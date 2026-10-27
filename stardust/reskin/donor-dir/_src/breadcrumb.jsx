// Asset URLs exported from Figma
const ASSETS = {
  generalIcons: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/580c2b1b-6505-4ed5-8479-0c54fb17306e",
  generalIcons1: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c0955507-a851-448b-8284-ca7de5b57359",
};

export default function BreackpointDesktop() {
  return (
    <div className="relative flex flex-col justify-center items-center gap-[10px] w-[1440px] h-[40px] bg-[var(--Background-Supporting-2,#ffffff)] border-[1px] border-solid border-[#ebefee] shrink-0" data-name="Breackpoint=Desktop" data-node-id="12410:12885">
      <div className="relative flex flex-row items-center gap-[8px] w-[1180px] h-fit shrink-0" data-name="Frame 1" data-node-id="12410:12855">
        <div className="relative flex flex-row items-center gap-[10px] w-fit h-fit shrink-0" data-name="Breadcrumb label" data-node-id="12410:12853">
          <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[14px] leading-[16px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12410:12853;12410:12838">
            <p className="whitespace-pre-wrap">Home</p>
          </div>
        </div>
        <img
          src={ASSETS.generalIcons}
          alt="General Icons"
          className="relative w-[20px] h-[20px] shrink-0" style={{ transform: "rotate(-3.141592653589793deg)" }}
          data-node-id="12410:12850"
        />
        <div className="relative flex flex-row items-center gap-[10px] w-fit h-fit shrink-0" data-name="Breadcrumb label" data-node-id="12410:12856">
          <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Inter',sans-serif] font-normal text-[14px] leading-[16px] text-left text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12410:12856;12410:12838">
            <p className="whitespace-pre-wrap">Breadcrumb label</p>
          </div>
        </div>
        <img
          src={ASSETS.generalIcons1}
          alt="General Icons"
          className="relative w-[20px] h-[20px] shrink-0" style={{ transform: "rotate(-3.141592653589793deg)" }}
          data-node-id="12410:12858"
        />
        <div className="relative flex flex-row items-center gap-[10px] w-fit h-fit shrink-0" data-name="Breadcrumb label" data-node-id="12410:12860">
          <div className="relative w-fit h-fit bg-[var(--Text-Interaction,#d0006f)] font-['Inter',sans-serif] font-normal text-[14px] leading-[16px] text-left text-[color:var(--Text-Interaction,#d0006f)] shrink-0" data-node-id="I12410:12860;12410:12844">
            <p className="whitespace-pre-wrap">Breadcrumb label</p>
          </div>
        </div>
      </div>
    </div>
  );
}
