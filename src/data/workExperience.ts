export type WorkExperience = {
  id: string;
  title: string;
  company: string;
  duration: string;
  location: string;
  type: string;
  status: "Current" | "Completed";
  description: string;
  achievements: string[];
  technologies: string[];
};

export const workExperience: WorkExperience[] = [
  {
    id: "dotnet-developer",
    title: ".NET Developer",
    company: "Freelance",
    duration: "2025 – Present",
    location: "Remote",
    type: "Freelance",
    status: "Current",
    description: "Developed modern backend and full-stack applications using .NET and C#. Worked with REST APIs, database-driven systems, and scalable application architecture.",
    achievements: [
      "Built backend systems and REST APIs",
      "Developed database-driven applications",
      "Worked on scalable full-stack solutions",
    ],
    technologies: [".NET", "C#", "ASP.NET Core", "REST APIs", "SQL"],
  },
  {
    id: "ai-ml-developer",
    title: "AI / ML Developer",
    company: "Freelance",
    duration: "2025 – Present",
    location: "Remote",
    type: "Freelance",
    status: "Current",
    description: "Worked on AI-powered applications, intelligent automation workflows, Python-based solutions, machine learning workflows, and API integrations.",
    achievements: [
      "Developed AI-powered application features",
      "Built Python-based AI and automation workflows",
      "Integrated AI models and APIs into web applications",
    ],
    technologies: ["Python", "AI/ML", "Machine Learning", "LLM APIs", "Automation"],
  },
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    company: "Freelance",
    duration: "2024 – Present",
    location: "Remote",
    type: "Freelance",
    status: "Current",
    description: "",
    achievements: [],
    technologies: ["React", "Angular", "Node.js", "MongoDB"],
  },
  {
    id: "remote-shopify-developer",
    title: "Remote Shopify Developer",
    company: "Freelance",
    duration: "2024 – Present",
    location: "Remote",
    type: "Freelance",
    status: "Current",
    description: "",
    achievements: [],
    technologies: ["Shopify", "Liquid", "API Integration"],
  },
  {
    id: "shopify-developer-internship",
    title: "Shopify Developer (Internship)",
    company: "AU Softs",
    duration: "July 2025",
    location: "Gujrat | Onsite",
    type: "Internship",
    status: "Completed",
    description: "",
    achievements: [],
    technologies: ["Shopify", "Liquid", "JavaScript"],
  },
  {
    id: "meta-ads-specialist",
    title: "Meta Ads Specialist",
    company: "Freelance",
    duration: "2024 – Present",
    location: "Remote",
    type: "Freelance",
    status: "Current",
    description: "",
    achievements: [],
    technologies: ["Meta Ads", "Facebook/Instagram Ads", "Shopify"],
  },
];
