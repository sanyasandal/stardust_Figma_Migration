// Asset URLs exported from Figma
const ASSETS = {
  leftContent: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d579aa77-e715-4780-9550-d4b63aeab1c1",
  azText: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e8c7977b-1db3-4413-bdca-fad0ec23b25e",
  azMark: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c8ba3cc8-0d3e-479b-81cf-28ddb93c51de",
  generalIcons: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a096cb47-8102-41ef-9e83-67e3ac6a4ce9",
  generalIcons1: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/45e689cf-8d4d-4b35-a558-1e132d17c065",
  button: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/bb814b26-2180-43ae-8ce0-b456e5d375a6",
};

export default function Header() {
  return (
    <div className="relative flex flex-col w-[1440px] h-fit shrink-0" data-name="Header" data-node-id="12387:11888">


      <div className="relative flex flex-col items-center gap-[10px] py-[8px] w-full h-fit bg-[var(--Background-Supporting-2,#ffffff)] shrink-0" data-name="Contact Navigation" data-node-id="I12387:11888;12379:10804">
        <div className="relative flex flex-row justify-end items-center gap-[16px] w-[1180px] h-fit shrink-0" data-name="Content" data-node-id="I12387:11888;12379:10803">
          <div className="relative flex flex-row justify-end items-center gap-[-1px] w-fit h-fit shrink-0" data-name=".Header / Links Selector" data-node-id="I12387:11888;12385:11076">
            <div className="relative flex flex-row justify-end items-center gap-[10px] w-fit h-fit shrink-0" data-name=".Header / Contact Selecter Item" data-node-id="I12387:11888;12385:11076;12385:11073">
              <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Lexia',sans-serif] font-medium text-[12px] leading-[16px] text-left text-[color:var(--Text-Body-1,#3c4242)] underline capitalize shrink-0" data-node-id="I12387:11888;12385:11076;12385:11073;12379:10693">
                <p className="whitespace-pre-wrap">Contact Us</p>
              </div>
            </div>
          </div>
          <div className="relative flex flex-row justify-end items-center gap-[-1px] w-fit h-fit shrink-0" data-name=". Header / Language Selector" data-node-id="I12387:11888;12385:11045">
            <div className="relative flex flex-row justify-end items-center gap-[10px] pr-[8px] w-fit h-fit border-[1px] border-solid border-[#3c4242] shrink-0" data-name=".Header / Contact Selecter Item" data-node-id="I12387:11888;12385:11045;12379:11036">
              <div className="relative w-fit h-fit bg-[var(--Text-Interaction,#d0006f)] font-['Lexia',sans-serif] font-medium text-[12px] leading-[16px] text-left text-[color:var(--Text-Interaction,#d0006f)] underline capitalize shrink-0" data-node-id="I12387:11888;12385:11045;12379:11036;12379:10706">
                <p className="whitespace-pre-wrap">EN</p>
              </div>
            </div>
            <div className="relative flex flex-row justify-end items-center gap-[10px] pl-[8px] w-fit h-fit border-[1px] border-solid border-[#3c4242] shrink-0" data-name=".Header / Contact Selecter Item" data-node-id="I12387:11888;12385:11045;12379:11039">
              <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Lexia',sans-serif] font-medium text-[12px] leading-[16px] text-left text-[color:var(--Text-Body-1,#3c4242)] underline capitalize shrink-0" data-node-id="I12387:11888;12385:11045;12379:11039;12379:10693">
                <p className="whitespace-pre-wrap">FR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col justify-center items-center gap-[10px] py-[12px] w-full h-fit bg-[var(--Background-Supporting-2,#ffffff)] border-[1px] border-solid border-[#ebefee] shrink-0" data-name="Main Header" data-node-id="I12387:11888;12379:10783">
        <div className="relative flex flex-row justify-between items-center gap-[97px] w-[1180px] h-fit shrink-0" data-name="Content" data-node-id="I12387:11888;12379:10768">
          <img
            src={ASSETS.leftContent}
            alt="Left Content"
            className="relative flex flex-col gap-[10px] w-[136px] h-fit shrink-0"
            data-node-id="I12387:11888;12379:10779"
          />
          <div className="relative flex flex-row items-center w-fit h-fit shrink-0" data-name="Main Navigation" data-node-id="I12387:11888;12379:10759">
            <div className="relative flex flex-row items-center gap-[4px] px-[16px] py-[8px] w-fit h-[36px] shrink-0" data-name=".Header / Navigation Item" data-node-id="I12387:11888;12379:10746">
              <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Lexia',sans-serif] font-normal text-[14px] leading-[16px] text-center text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12387:11888;12379:10746;12370:10625">
                <p className="whitespace-pre-wrap">Products</p>
              </div>
              <img
                src={ASSETS.generalIcons}
                alt="General Icons"
                className="relative w-[20px] h-[20px] shrink-0" style={{ transform: "rotate(-3.141592653589793deg)" }}
                data-node-id="I12387:11888;12379:10746;12370:10626"
              />
            </div>
            <div className="relative flex flex-row items-center gap-[4px] px-[16px] py-[8px] w-fit h-[36px] shrink-0" data-name=".Header / Navigation Item" data-node-id="I12387:11888;12379:10750">
              <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Lexia',sans-serif] font-normal text-[14px] leading-[16px] text-center text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12387:11888;12379:10750;12370:10625">
                <p className="whitespace-pre-wrap">Therapeutic Areas</p>
              </div>
              <img
                src={ASSETS.generalIcons1}
                alt="General Icons"
                className="relative w-[20px] h-[20px] shrink-0" style={{ transform: "rotate(-3.141592653589793deg)" }}
                data-node-id="I12387:11888;12379:10750;12370:10626"
              />
            </div>
            <div className="relative flex flex-row items-center gap-[4px] px-[16px] py-[8px] w-fit h-[36px] shrink-0" data-name=".Header / Navigation Item" data-node-id="I12387:11888;12379:10754">
              <div className="relative w-fit h-fit bg-[var(--Text-Body-1,#3c4242)] font-['Lexia',sans-serif] font-normal text-[14px] leading-[16px] text-center text-[color:var(--Text-Body-1,#3c4242)] shrink-0" data-node-id="I12387:11888;12379:10754;12370:10637">
                <p className="whitespace-pre-wrap">News</p>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col gap-[10px] w-[136px] h-fit shrink-0" data-name="Right Content" data-node-id="I12387:11888;12379:10780">
            <div className="relative flex flex-row justify-end items-center gap-[10px] w-full h-fit shrink-0" data-name=".Header / Actions" data-node-id="I12387:11888;12379:10760">
              <img
                src={ASSETS.button}
                alt="Button"
                className="relative flex flex-row justify-center items-center gap-[8px] w-[34px] h-[34px] rounded-[4px] shrink-0"
                data-node-id="I12387:11888;12379:10760;12370:10538"
              />
              <div className="relative flex flex-row justify-center items-center gap-[8px] px-[16px] w-fit h-[34px] rounded-[4px] bg-[var(--Button-Secondary-Background,#ffffff)] border-[1px] border-solid border-[#d0006f] shrink-0" data-name="Button" data-node-id="I12387:11888;12379:10760;12370:10525">

                <div className="relative w-fit h-fit bg-[var(--Button-Secondary-Text,#d0006f)] font-['Inter',sans-serif] font-medium text-[12px] leading-[20px] text-center text-[color:var(--Button-Secondary-Text,#d0006f)] shrink-0" data-node-id="I12387:11888;12379:10760;12370:10525;12084:109216">
                  <p className="whitespace-pre-wrap">Login</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
