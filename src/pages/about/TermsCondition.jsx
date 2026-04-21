import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserTermsAction } from "../../redux/UserActions";

const TermsConditions = () => {
  const dispatch = useDispatch();
  const { loading, error, list } = useSelector((state) => state.userTermsAndConditions || {});

  useEffect(() => { dispatch(getUserTermsAction()); }, [dispatch]);

  const data = list;
  console.log(data);

  let intro = "";
  let formattedData = [];

  if (data?.body) {
    const sections = data.body.split("\n\n");
    intro = sections[0];
    formattedData = sections.slice(1).map((section) => {
      const [titleRaw, ...descParts] = section.split("\n");
      const title = titleRaw.replace(/^\d+\.\s*/, "");
      const desc  = descParts.join(" ");
      return { title, desc };
    });
  }

  return (
    <div className="px-4 sm:px-[50px] md:px-[80px] lg:px-[140px] xl:px-[170px] pt-[90px] sm:pt-[100px] md:pt-[120px] lg:pt-[140px]  font-[Outfit]">
      <div>
        <h1 className="font-[Playfair_Display] font-bold text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] text-center mb-[18px]">
          Terms & Conditions
        </h1>

        {loading && <p>Loading...</p>}
        {!loading && error && <p>Something went wrong</p>}
        {!loading && !error && !data?.body && <p>No terms available</p>}

        {!loading && !error && data?.body && (
          <p className="text-center text-[#666] mb-[30px] leading-[1.8] text-sm sm:text-base">
            {intro}
          </p>
        )}

        {!loading && !error && data?.body && (
          <h2 className="font-[Playfair_Display] text-[18px] sm:text-[20px] md:text-[22px] mt-[35px] mb-[18px] relative
            after:content-[''] after:block after:w-[50px] after:h-[3px] after:bg-[#b0895a] after:mt-[6px] after:rounded-sm">
            Booking Rules & Policies
          </h2>
        )}

        {!loading && !error && formattedData.length > 0 && (
          <div className="overflow-x-auto mb-[30px]">
            <table className="w-full border-collapse min-w-[300px]">
              <tbody>
                {formattedData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-[#e5e5e5] px-[10px] sm:px-[14px] py-[10px] sm:py-[14px] align-top text-[12px] sm:text-[14px] leading-[1.6] w-[40%] sm:w-[30%] font-semibold">
                      <strong>{item.title}</strong>
                    </td>
                    <td className="border border-[#e5e5e5] px-[10px] sm:px-[14px] py-[10px] sm:py-[14px] align-top text-[12px] sm:text-[14px] leading-[1.6]">
                      {item.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsConditions;
