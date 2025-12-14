import React from "react";
import { withWindow } from "../../system/windowManager";
import { Github, Linkedin, Mail, MapPin, GraduationCap, Briefcase } from "lucide-react";

const aboutMe = {
  name: "Prakhar Tandon",
  role: "Co-Founder & CTO at Dualite",
  location: "Kanpur Nagar, India",
  contact: {
    email: "Ptofficial29@gmail.com",
    linkedin: "LinkedIn",
  },
};

const AboutComponent: React.FC = () => {
  return (
    <div className="h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-black dark:text-white overflow-y-auto">
      {/* Header / Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
        <div className="absolute -bottom-12 left-8">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-[#2C2C2C] p-1 shadow-lg">
             <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Prakhar" alt="Profile" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </div>

      <div className="pt-16 px-8 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{aboutMe.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{aboutMe.role}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin size={14} className="mr-1" />
              {aboutMe.location}
            </div>
          </div>
          <div className="flex space-x-2">
            <a href="#" className="p-2 bg-gray-200 dark:bg-white/10 rounded-full hover:bg-gray-300 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${aboutMe.contact.email}`} className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#2C2C2C] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-white/5">
            <h3 className="font-bold flex items-center mb-3 text-lg">
              <Briefcase size={20} className="mr-2 text-purple-500" /> Experience
            </h3>
            <div className="space-y-4">
              <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="font-semibold">Co-Founder & CTO</div>
                <div className="text-sm text-gray-500">Dualite • 2023 - Present</div>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">Reducing dev time by 10x. Simplifying UI dev & design handoff.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2C2C2C] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-white/5">
            <h3 className="font-bold flex items-center mb-3 text-lg">
              <GraduationCap size={20} className="mr-2 text-green-500" /> Education
            </h3>
             <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="font-semibold">B.Tech Computer Science</div>
                <div className="text-sm text-gray-500">HBTU • 2020 - 2024</div>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">SIH'22 National Winner</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedAbout = withWindow(AboutComponent, {
  id: "about",
  title: "About Me",
  defaultPosition: { x: 300, y: 150 },
  defaultSize: { width: 600, height: 550 },
  minSize: { width: 400, height: 400 },
});

export default WrappedAbout;
