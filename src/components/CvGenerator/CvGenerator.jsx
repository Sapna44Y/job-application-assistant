import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./CvGenerator.css";

const predefinedSkills = [
  "JavaScript", "React", "Node.js", "Express.js", "NextJS", "HTML",
  "CSS", "Tailwind CSS", "MongoDB", "Angular", "Data Structure and Algorithm (DSA)",
  "SEO", "Content Marketing", "Social Media Marketing", "Data Analytics",
  "Email Marketing", "PPC Advertising", "AI & Marketing Automation",
  "Analytical Reasoning", "Financial Modeling", "Data Analysis",
  "Accounting Principles", "Budgeting"
];

const CvGenerator = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    careerObjective: "",
    experiences: [],
    education: [],
    skills: [],
    customSkill: "",
  });

  const [generated, setGenerated] = useState(false);
  const cvRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { role: "", company: "", duration: "", details: "" }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experiences];
    updated[index][field] = value;
    setFormData({ ...formData, experiences: updated });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", institution: "", year: "" }]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const addCustomSkill = () => {
    if (formData.customSkill.trim() && !formData.skills.includes(formData.customSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.customSkill.trim()],
        customSkill: "",
      });
    }
  };

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleDownload = async () => {
    if (!cvRef.current) return;
    const canvas = await html2canvas(cvRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.name || "my"}-cv.pdf`);
  };

  return (
    <div className="cv-generator">
      <h2>CV Generator</h2>

      {/* Input Form */}
      <div className="cv-form">
        <input type="text" name="name" placeholder="Full Name"
          value={formData.name} onChange={handleChange} />

        <input type="text" name="title" placeholder="Job Title (e.g., Full Stack Developer)"
          value={formData.title} onChange={handleChange} />

        <input type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange} />

        <input type="tel" name="phone" placeholder="Phone Number"
          value={formData.phone} onChange={handleChange} />

        <textarea name="careerObjective" placeholder="Career Objective"
          value={formData.careerObjective} onChange={handleChange} />

        {/* Experience Section */}
        <h3>Professional Experience</h3>
        {formData.experiences.map((exp, index) => (
          <div key={index} className="sub-section">
            <input type="text" placeholder="Job Role"
              value={exp.role} onChange={(e) => updateExperience(index, "role", e.target.value)} />
            <input type="text" placeholder="Company Name"
              value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
            <input type="text" placeholder="Duration (e.g., 2020-2023)"
              value={exp.duration} onChange={(e) => updateExperience(index, "duration", e.target.value)} />
            <textarea placeholder="Job Details"
              value={exp.details} onChange={(e) => updateExperience(index, "details", e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={addExperience}>+ Add Experience</button>

        {/* Education Section */}
        <h3>Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="sub-section">
            <input type="text" placeholder="Degree"
              value={edu.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
            <input type="text" placeholder="College/School"
              value={edu.institution} onChange={(e) => updateEducation(index, "institution", e.target.value)} />
            <input type="text" placeholder="Year (e.g., 2018-2022)"
              value={edu.year} onChange={(e) => updateEducation(index, "year", e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={addEducation}>+ Add Education</button>

        {/* Skills Section */}
        <h3>Skills</h3>
        <div className="skills-list">
          {predefinedSkills.map((skill, i) => (
            <label key={i}>
              <input
                type="checkbox"
                checked={formData.skills.includes(skill)}
                onChange={() => toggleSkill(skill)}
              />
              {skill}
            </label>
          ))}
        </div>
        <div className="custom-skill">
          <input type="text" placeholder="Add custom skill"
            value={formData.customSkill} onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })} />
          <button type="button" onClick={addCustomSkill}>Add Skill</button>
        </div>

        <button onClick={handleGenerate} className="generate-btn">Generate CV</button>
      </div>

      {/* CV Preview */}
      {generated && (
        <div className="cv-preview-section">
          <h3>CV Preview</h3>
          <div className="cv-preview" ref={cvRef}>
            <div className="cv-header">
              <h2>{formData.name || "Your Name"}</h2>
              <h4>{formData.title || "Job Title"}</h4>
              <p>{formData.email} | {formData.phone}</p>
            </div>

            <div className="cv-section">
              <h3>Career Objective</h3>
              <p>{formData.careerObjective || "Write your career objective here..."}</p>
            </div>

            <div className="cv-section">
              <h3>Professional Experience</h3>
              {formData.experiences.length > 0 ? (
                formData.experiences.map((exp, i) => (
                  <div key={i} className="experience-item">
                    <h4>{exp.role || "Job Role"} - {exp.company || "Company"}</h4>
                    <p><i>{exp.duration}</i></p>
                    <p>{exp.details}</p>
                  </div>
                ))
              ) : (
                <p>No experiences added yet</p>
              )}
            </div>

            <div className="cv-section">
              <h3>Education</h3>
              {formData.education.length > 0 ? (
                formData.education.map((edu, i) => (
                  <div key={i} className="education-item">
                    <p><b>{edu.degree}</b>, {edu.institution} ({edu.year})</p>
                  </div>
                ))
              ) : (
                <p>No education details added yet</p>
              )}
            </div>

            <div className="cv-section">
              <h3>Skills</h3>
              {formData.skills.length > 0 ? (
                <ul>
                  {formData.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p>No skills added yet</p>
              )}
            </div>
          </div>

          <button onClick={handleDownload} className="download-btn">
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default CvGenerator;





