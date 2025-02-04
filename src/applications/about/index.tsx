import React from "react";
import { withWindow } from "../../system/windowManager";

const aboutMe = {
  name: "Prakhar Tandon",
  role: "Co-Founder & CTO at Dualite",
  location: "Kanpur Nagar, Uttar Pradesh, India",
  education: {
    degree: "B.Tech in Computer Science",
    institution: "Harcourt Butler Technical University",
    period: "2020-2024",
  },
  currentRole: {
    title: "Co-Founder & CTO",
    company: "Dualite",
    period: "Feb 2023 - Present",
    achievements: [
      "Focused on reducing software development time by 10x",
      "Working on simplifying UI development and design handoff processes",
      "SIH'22 National winner",
    ],
  },
  contact: {
    email: "Ptofficial29@gmail.com",
    linkedin: "LinkedIn",
  },
};

const AboutComponent: React.FC = () => {
  return (
    <div className="p-4 text-white">
      {/* Basic Information */}
      <h2 className="text-2xl font-bold mb-2">{aboutMe.name}</h2>
      <p className="text-gray-300 mb-4">{aboutMe.role}</p>
      <p className="text-gray-300 mb-6">{aboutMe.location}</p>

      {/* Education */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Education</h3>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="font-medium">{aboutMe.education.degree}</p>
          <p className="text-gray-300">{aboutMe.education.institution}</p>
          <p className="text-gray-400 text-sm">{aboutMe.education.period}</p>
        </div>
      </div>

      {/* Current Role */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Role</h3>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="font-medium">
            {aboutMe.currentRole.title} at {aboutMe.currentRole.company}
          </p>
          <p className="text-gray-400 text-sm mb-2">
            {aboutMe.currentRole.period}
          </p>
          <ul className="list-disc list-inside text-gray-300">
            {aboutMe.currentRole.achievements.map((achievement, index) => (
              <li key={index} className="mb-1">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Contact</h3>
        <div className="bg-gray-800 rounded-lg p-3 space-y-1">
          <p>
            <span className="text-gray-400">Email: </span>
            <a
              href={`mailto:${aboutMe.contact.email}`}
              className="text-blue-400 hover:text-blue-300"
            >
              {aboutMe.contact.email}
            </a>
          </p>
          <p>
            <span className="text-gray-400">LinkedIn: </span>
            <span className="text-blue-400">{aboutMe.contact.linkedin}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const WrappedAbout = withWindow(AboutComponent, {
  id: "about",
  title: "About",
  defaultPosition: { x: 200, y: 200 },
  defaultSize: { width: 500, height: 600 },
  minSize: { width: 300, height: 400 },
});

export default WrappedAbout;
