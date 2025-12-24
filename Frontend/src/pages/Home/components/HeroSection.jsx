import React from "react";
import { EvervaultCard } from "../../../components/common/EvervaultCard";
import { CometCard } from "../../../components/common/CometCard";
import qrHeroImage from "../../../assets/QRHeroSection.png";

export const HeroSection = () => {
    return (
        <div className="w-full h-screen relative overflow-hidden">
            {/* Evervault Card Background */}
            <EvervaultCard text="Connect. Update. Share." className="" />

            {/* Comet Card - Responsive Position */}
            <div className="absolute right-[5%] sm:right-[8%] lg:right-[12.5%] bottom-[6rem] sm:bottom-[8rem] lg:bottom-[9rem] z-20">
                <CometCard className="w-[40vw] h-[40vw] sm:w-[35vw] sm:h-[35vw] lg:w-[25vw] lg:h-[25vw]">
                    <div className="w-full h-full bg-gradient-to-br from-red-900 via-red-700 to-red-900 rounded-2xl p-4 sm:p-6 lg:p-8 flex items-center justify-center text-white">
                        <div className="w-full h-full rounded-lg flex items-center justify-center">
                            <img
                                src={qrHeroImage}
                                alt="QR Hero Section"
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </CometCard>
            </div>
        </div>
    );
};
