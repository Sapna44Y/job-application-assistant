import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./CoverLetterGenerator.css";

const predefinedSkills = [
  "JavaScript",
  "React",
  "Node.js",
  "Express.js",
  "NextJS",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "MongoDB",
  "Angular",
  "SEO",
  "Content Marketing",
  "Social Media Marketing",
  "Data Analytics",
  "Email Marketing",
  "PPC Advertising",
  "AI & Marketing Automation",
  "Analytical Reasoning",
  "Financial Modeling",
  "Accounting",
  "Budgeting",
];

const experienceOptions = [
  "Fresher",
  "Less than 1 Year",
  "1 Year",
  "2 Years",
  "2-3 Years",
  "More than 3 Years",
];

const CoverLetterGenerator = () => {
  const [formData, setFormData] = useState({
    name: "",
    jobProfile: "",
    experience: "",
    prevRole: "",
    prevCompany: "",
    prevJobDesc: "",
    skills: [],
    customSkill: "",
    phone: "",
    github: "",
    email: "",
    linkedin: "",
  });

  const [generatedLetter, setGeneratedLetter] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skill),
      });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleAddCustomSkill = () => {
    if (formData.customSkill.trim() !== "") {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.customSkill],
        customSkill: "",
      });
    }
  };

  const handleGenerate = () => {
    const {
      name,
      jobProfile,
      experience,
      prevRole,
      prevCompany,
      prevJobDesc,
      skills,
      phone,
      github,
      email,
      linkedin,
    } = formData;

    const letter = `
Dear Hiring Manager,

I am writing to express my interest in the position of ${jobProfile} at your organization. 
As a ${experience} candidate, I bring strong dedication and skills that align with the requirements of the role.

${
  prevRole && prevCompany
    ? `Previously, I worked as a ${prevRole} at ${prevCompany}, where I gained valuable experience. My responsibilities included: ${prevJobDesc}.`
    : "As a fresher, I am eager to apply my knowledge and enthusiasm to contribute effectively to your team."
}

My key skills include: ${skills.join(", ")}.

I am confident that my background and passion for growth make me a strong fit for this role. I am excited about the opportunity to contribute to your team’s success.

Sincerely,
${name}

 Phone: ${phone}  
 Email: ${email}  
 LinkedIn: ${linkedin}  
 GitHub: ${github}
`;

    setGeneratedLetter(letter);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(generatedLetter, 180);
    doc.text(lines, 15, 20);
    doc.save("cover_letter.pdf");
  };

  return (
    <div className="cover-letter-generator">
      <h2>Cover Letter Generator</h2>

      <div className="form-section">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Job Profile:</label>
        <input
          type="text"
          name="jobProfile"
          placeholder="e.g. Frontend Developer"
          value={formData.jobProfile}
          onChange={handleChange}
        />

        <label>Experience:</label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        >
          <option value="">Select Experience</option>
          {experienceOptions.map((exp, i) => (
            <option key={i} value={exp}>
              {exp}
            </option>
          ))}
        </select>

        <h3>Previous Job Details</h3>
        <label>Role:</label>
        <input
          type="text"
          name="prevRole"
          placeholder="e.g. Software Engineer"
          value={formData.prevRole}
          onChange={handleChange}
        />

        <label>Company:</label>
        <input
          type="text"
          name="prevCompany"
          placeholder="e.g. ABC Technologies"
          value={formData.prevCompany}
          onChange={handleChange}
        />

        <label>Job Description:</label>
        <textarea
          name="prevJobDesc"
          rows="3"
          placeholder="Describe your responsibilities"
          value={formData.prevJobDesc}
          onChange={handleChange}
        />

        <h3>Skills</h3>
        <div className="skills-container">
          {predefinedSkills.map((skill, i) => (
            <label key={i} className="skill-option">
              <input
                type="checkbox"
                checked={formData.skills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
              />
              {skill}
            </label>
          ))}
        </div>
        <div className="custom-skill">
          <input
            type="text"
            name="customSkill"
            placeholder="Add custom skill"
            value={formData.customSkill}
            onChange={handleChange}
          />
          <button type="button" onClick={handleAddCustomSkill}>
            Add
          </button>
        </div>

        <h3>Contact Info</h3>
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>LinkedIn:</label>
        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn profile link"
          value={formData.linkedin}
          onChange={handleChange}
        />

        <label>GitHub:</label>
        <input
          type="text"
          name="github"
          placeholder="GitHub profile link"
          value={formData.github}
          onChange={handleChange}
        />
      </div>

      <div className="action-buttons">
        <button onClick={handleGenerate} className="generate-btn">
          Generate Cover Letter
        </button>
      </div>

      {generatedLetter && (
        <div className="generated-result">
          <h3>Generated Cover Letter</h3>
          <pre className="letter-preview">{generatedLetter}</pre>
          <button onClick={handleDownload} className="download-btn">
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;






