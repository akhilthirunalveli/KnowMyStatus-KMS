import React from "react";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiExpress, SiTailwindcss, SiFramer, SiSupabase } from "react-icons/si";
import { SpotlightCard } from "../../../components/common/SpotlightCard.jsx";

export const TechStackSection = () => {
    return (
        <div className="w-full bg-app-background py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white cabinet-grotesk mb-4">
                        Powered by Modern Tech
                    </h2>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Built with the latest technologies for maximum performance and reliability.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[
                        { name: "React", icon: FaReact, color: "#61DAFB", description: "Frontend" },
                        { name: "Node.js", icon: FaNodeJs, color: "#339933", description: "Runtime" },
                        { name: "Express", icon: SiExpress, color: "#FFFFFF", description: "Backend" },
                        { name: "Supabase", icon: SiSupabase, color: "#3ECF8E", description: "Database" },
                        { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4", description: "Styling" },
                        { name: "Framer", icon: SiFramer, color: "#0055FF", description: "Animation" },
                    ].map((tech, index) => (
                        <SpotlightCard
                            mode="after"
                            spotlightColor={tech.color}
                            key={index}
                            className="group h-full flex flex-col items-center justify-center p-6 bg-black/5 hover:bg-black/10 border border-black/10"
                        >
                            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                                <div className="p-3 rounded-full bg-black/5 group-hover:bg-black/50 transition-colors">
                                    <tech.icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" style={{ color: tech.color }} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold cabinet-grotesk text-lg tracking-wide">{tech.name}</h3>
                                    <p className="text-xs text-white/ mt-1 tracking-wide">{tech.description}</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </div>
    );
};
