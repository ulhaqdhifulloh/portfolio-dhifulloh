// Ringkas profil & proyek untuk prompt sistem (sumber: portofolio PDF & CV).
// Lihat "AI Enthusiast | Data Protection Intern..." dan "Key Projects" (PDF hlm 1 & 5),
// serta ringkasan pengalaman (CV satu halaman). :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}
window.__PROFILE__ = {
  basics: {
    name: "Dhifulloh Dhiya Ulhaq",
    pronouns: "He/Him",
    title: "AI Enthusiast | Data Protection Intern at Telkom Indonesia | Bangkit Academy Graduate | IS Undergraduate",
    location: "Bandung, West Java, Indonesia (from Purwokerto)",
    email: "dhifullohdhiyaulhaq@gmail.com",
    links: {
      github: "https://github.com/ulhaqdhifulloh",
      linkedin: "https://linkedin.com/in/ulhaqdhifulloh",
      youtube: "https://youtube.com/@ulhaq25"
    }
  },
  summary: "Information Systems undergraduate at Telkom University focused on bridging business and tech. Passion in AI, trained via Bangkit (ML) plus various AI bootcamps. Practical experience in ML, data workflows, and AI automation. Committed to building socially impactful AI.",
  skillsTop: ["Artificial Intelligence (AI)","Machine Learning","Data Science","Prompt Engineering","Concept Generation"],
  experience: [
    {org:"Central Computer Improvement (CCI) — Telkom University", role:"Member, Data Research Division", period:"Jan 2025–Present", summary:"Exploration & implementation of DS/ML/DL projects."},
    {org:"Telkom Indonesia (Data Protection Office)", role:"Intern — Data Protection (AI Automation)", period:"Jun 2025–Sep 2025", summary:"Contributed to Teman PDP LLM chatbot; policy drafting, compliance audits, and awareness programs; strengthened understanding of data security & privacy."},
    {org:"EDM Laboratory", role:"Member — Enterprise Data Management Study Group", period:"Jan 2025–Jul 2025", summary:"Applied data science to information systems projects."},
    {org:"ERP Laboratory", role:"Member — ERP Study Group", period:"Feb 2025–Mar 2025", summary:"Learned Odoo modules (Inventory, Purchasing, Mfg, Sales)."},
    {org:"Bangkit Academy", role:"Machine Learning Cohort", period:"Sep 2024–Jan 2025", summary:"Completed cross-disciplinary ML projects (Python/TensorFlow)."},
    {org:"EAD Laboratory", role:"OOP Practicum Assistant", period:"Aug 2024–Dec 2024", summary:"Supported OOP labs; authored modules; Java."}
  ],
  projects: [
    {name:"Teman PDP", blurb:"LLM chatbot hub for Indonesia’s PDP Law; built with n8n/OpenAI/Pinecone; Telegram & web demo.", tags:["LLM","RAG","Privacy"], year:2025},
    {name:"FinSight AI", blurb:"AI financial management & inclusive investment platform (BI-OJK Hackathon).", tags:["AI Agents","Automation"], year:2025},
    {name:"WARM THE HACK — Tokopedia Reviews", blurb:"IndoBERT fine-tuning; 93% acc / 90.77 F1; Streamlit dashboard.", tags:["NLP","BERT"], year:2025},
    {name:"Diabetes Risk & Segmentation", blurb:"LogReg + K-Means; Streamlit dashboard.", tags:["Data Mining","Healthcare"], year:2025},
    {name:"PROSPEKTA", blurb:"Random Forest classifies coffee shops by performance; Streamlit.", tags:["ML","Analytics"], year:2025},
    {name:"MoneySense", blurb:"CNN/TensorFlow detects banknote denomination & authenticity for visually impaired.", tags:["CV","Accessibility"], year:2024}
  ],
  education: {school:"Telkom University", program:"B.Sc. Information Systems (GPA 3.82)", years:"2022–2026"},
  certs: ["Dev Certified for Machine Learning with TensorFlow (dev.id, 2025–2028)","Bangkit 2024 ML Graduate","Udemy — AI Automation: LLM Apps & Agents with n8n (2025)"],
  // Suggested questions shown as pills:
  suggestions: [
    "Apa itu proyek Teman PDP dan peranku di sana?",
    "Highlight proyek ML/NLP terbaikmu?",
    "Skill apa yang paling kuat dan contoh penerapannya?",
    "Kenapa tertarik di AI privacy & compliance?",
    "Rencana karier 1–2 tahun ke depan?"
  ]
};