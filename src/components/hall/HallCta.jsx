import { Link } from "react-router-dom";

export default function HallCta({ hallData }) {
  const sanitize = (u) => typeof u === "string" ? u.replace(/`/g, "").trim() : u;
  const tel  = sanitize(hallData?.phone_number) || "";
  const mail = sanitize(hallData?.email) || "";

  return (
    <section className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-[50px] md:py-[80px] px-5 text-center flex flex-col gap-[30px] items-center">
      <h2 className="text-[32px] md:text-[42px] font-bold m-0 [text-shadow:2px_2px_4px_rgba(0,0,0,0.2)]">
        Ready to Book?
      </h2>
      <p className="text-[16px] md:text-[18px] m-0 opacity-95 max-w-[600px]">
        Contact us today to reserve the Perfect venue for your event.
      </p>

      <div className="flex gap-[15px] md:gap-5 justify-center flex-wrap">
        <a
          href={tel ? `tel:${tel}` : undefined}
          className="px-[30px] md:px-10 py-3 md:py-[14px] rounded-lg text-[14px] md:text-[16px] font-semibold no-underline transition-all duration-300 border-2 border-white cursor-pointer inline-block text-center
            bg-white text-[#667eea] hover:bg-transparent hover:text-white hover:scale-105"
        >
          Call Now
        </a>
        <a
          href={mail ? `mailto:${mail}` : undefined}
          className="px-[30px] md:px-10 py-3 md:py-[14px] rounded-lg text-[14px] md:text-[16px] font-semibold no-underline transition-all duration-300 border-2 border-white cursor-pointer inline-block text-center
            bg-transparent text-white hover:bg-white hover:text-[#667eea] hover:scale-105"
        >
          Email Us
        </a>
      </div>
    </section>
  );
}
