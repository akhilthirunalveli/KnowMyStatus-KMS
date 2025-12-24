import React from "react";
import { Timeline } from "../../../components/common/Timeline";
import eventImage from "../../../assets/EventImage.jpg";
import phpLogo from "../../../assets/Php.png";
import sqlLogo from "../../../assets/MySQL.svg";

export const AboutTimelineSection = ({ aboutRef }) => {
    // Timeline data
    const timelineData = [
        {
            title: "Early 2023",
            content: (
                <div>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl font-normal mb-6 sm:mb-8 cabinet-grotesk">
                        Started development of KnowMyStatus to solve the problem of student-teacher
                        communication and real-time status updates in educational environments.
                    </p>
                </div>
            ),
        },
        {
            title: "2023",
            content: (
                <div>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl font-normal mb-6 sm:mb-8 cabinet-grotesk">
                        Built the core platform with QR code integration, teacher profiles in PHP & SQL first.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-black rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center">
                            <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 mb-3 sm:mb-4">
                                <img src={phpLogo} alt="PHP Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <div className="bg-black rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center">
                            <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 mb-3 sm:mb-4">
                                <img src={sqlLogo} alt="SQL Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "2024",
            content: (
                <div>
                    <div className="w-full">
                        <div className="bg-gray-900/50 rounded-xl p-2 overflow-hidden h-60 sm:h-72 md:h-80 lg:h-96 w-full">
                            <img
                                src={eventImage}
                                alt="Event Image"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm md:text-base text-center mt-3 sm:mt-4 cabinet-grotesk italic px-2">
                            KnowMyStatus got an award for Innovation on Industry Conclave at VIT
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Present",
            content: (
                <div>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl font-normal mb-6 sm:mb-8 cabinet-grotesk">
                        KnowMyStatus is now live using MERN Stack and helping educational institutions worldwide
                        improve communication between teachers and students.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <>
            {/* About Section */}
            <div ref={aboutRef} className="w-full bg-app-background pt-8 sm:pt-10 pb-1">
                <div className="max-w-xl mx-auto text-center px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-500 cabinet-grotesk flex items-center justify-center gap-2 sm:gap-4">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full"></span>
                        About
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full"></span>
                    </h2>
                </div>
            </div>

            {/* Timeline Section */}
            <Timeline data={timelineData} />

            {/* Red Scroll Section */}
            <div className="w-full py-3 sm:py-4 bg-red-900 relative overflow-hidden">
                <div className="w-full">
                    <div className="flex animate-scroll whitespace-nowrap">
                        <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 text-white text-base sm:text-lg md:text-xl lg:text-2xl cabinet-grotesk uppercase">
                            <span>•</span>
                            <span>Innovation</span>
                            <span>•</span>
                            <span>Technology</span>
                            <span>•</span>
                            <span>Education</span>
                            <span>•</span>
                            <span>Real-time Communication</span>
                            <span>•</span>
                            <span>Student-Teacher Connect</span>
                            <span>•</span>
                            <span>QR Integration</span>
                            <span>•</span>
                            <span>Award Winning</span>
                            <span>•</span>
                            <span>VIT Industry Conclave</span>
                            <span>•</span>
                            <span>Innovation</span>
                            <span>•</span>
                            <span>Technology</span>
                            <span>•</span>
                            <span>Education</span>
                            <span>•</span>
                            <span>Real-time Communication</span>
                            <span>•</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
