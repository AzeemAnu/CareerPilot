import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  FileUp,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  RotateCcw,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  X,
  Zap,
  ChartNoAxesCombined,
  Lightbulb,
} from "lucide-react";

import "./App.css";
import "./DashboardLayout.css";

const API_URL = "http://localhost:8000/api/analyze";

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [activeView, setActiveView] = useState("overview");

  function chooseFile(selectedFile) {
    setError("");
    setResult(null);
    setCompletedTasks([]);

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF resume.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Your PDF must be smaller than 5 MB.");
      return;
    }

    setFile(selectedFile);
  }

  async function analyzeResume(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setCompletedTasks([]);

    if (!file) {
      setError("Upload your resume PDF first.");
      return;
    }

    if (jobDescription.trim().length < 30) {
      setError("Please enter a more detailed job description.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jobDescription);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Analysis failed. Please try again."
        );
      }

      setResult(data);
      setActiveView("results");

      window.setTimeout(() => {
        document
          .getElementById("cp-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 80);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure FastAPI is running on port 8000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function resetAnalysis() {
    setResult(null);
    setError("");
    setCompletedTasks([]);
    setActiveView("analysis");

    document
      .getElementById("cp-analysis")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleTask(taskId) {
    setCompletedTasks((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
  }

  function navigate(view, targetId) {
    setActiveView(view);

    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const matchedSkills = result?.matched_skills ?? [];
  const missingSkills = result?.missing_skills ?? [];
  const resumeSkills = result?.resume_skills ?? [];
  const roadmap = result?.roadmap ?? [];
  const skillEvidence = result?.skill_evidence ?? [];
  const aiModel = result?.ai_model ?? null;

  const score = Math.max(
    0,
    Math.min(100, Number(result?.match_score) || 0)
  );

  const totalRoadmapTasks = roadmap.length;
  const completedCount = completedTasks.length;

  return (
    <div className="app-shell cp-app-shell" id="home">
      {/* SIDEBAR */}
      <aside className="cp-sidebar">
        <a
          className="cp-brand"
          href="#home"
          onClick={() => setActiveView("overview")}
        >
          <span className="cp-brand-mark">
            <BrainCircuit size={22} />
          </span>

          <span>
            CareerPilot
            <small>CAREER INTELLIGENCE</small>
          </span>
        </a>

        <div className="cp-nav-label">WORKSPACE</div>

        <nav className="cp-nav" aria-label="Main navigation">
          <button
            className={activeView === "overview" ? "active" : ""}
            onClick={() => navigate("overview", "cp-overview")}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            className={activeView === "analysis" ? "active" : ""}
            onClick={() => navigate("analysis", "cp-analysis")}
          >
            <FileUp size={18} />
            Resume analysis
          </button>

          <button
            className={activeView === "results" ? "active" : ""}
            onClick={() =>
              navigate(
                result ? "results" : "analysis",
                result ? "cp-results" : "cp-analysis"
              )
            }
          >
            <ChartNoAxesCombined size={18} />
            Skill gap analysis
          </button>

          <button
            className={activeView === "roadmap" ? "active" : ""}
            onClick={() =>
              navigate(
                result ? "roadmap" : "analysis",
                result ? "cp-roadmap" : "cp-analysis"
              )
            }
          >
            <GraduationCap size={18} />
            Learning roadmap
          </button>
        </nav>

        <div className="cp-sidebar-bottom">
          <div className="cp-sidebar-tip">
            <span>
              <Lightbulb size={17} />
            </span>

            <strong>Small steps add up.</strong>

            <p>
              Turn skill gaps into a plan you can act on, one week at a time.
            </p>
          </div>

          <div className="cp-sidebar-profile">
            <div className="cp-profile-avatar">CP</div>

            <div>
              <strong>Your workspace</strong>
              <small>Local prototype</small>
            </div>

            <Settings2 size={17} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="cp-main-column">
        <header className="cp-topbar">
          <div className="cp-breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />

            <strong>
              {activeView === "results"
                ? "Analysis results"
                : activeView === "roadmap"
                  ? "Learning roadmap"
                  : activeView === "analysis"
                    ? "Resume analysis"
                    : "Overview"}
            </strong>
          </div>

          <div className="cp-topbar-right">
            <span className="cp-online-dot" />
            <span>Analysis engine ready</span>
            <div className="cp-top-avatar">CP</div>
          </div>
        </header>

        <main className="cp-content">
          {/* WELCOME */}
          <section className="cp-welcome" id="cp-overview">
            <div>
              <div className="cp-eyebrow">
                <Sparkles size={14} />
                YOUR CAREER WORKSPACE
              </div>

              <h1>
                Your next move, <span>made clearer.</span>
              </h1>

              <p>
                Understand how your resume aligns with your target role,
                identify skills to strengthen, and build a practical
                learning plan.
              </p>
            </div>

            <button
              className="cp-primary-button"
              onClick={() => navigate("analysis", "cp-analysis")}
            >
              Start new analysis
              <ArrowRight size={17} />
            </button>
          </section>

          {/* METRIC CARDS */}
          <section className="cp-metrics" aria-label="Analysis overview">
            <article className="cp-metric-card cp-metric-highlight">
              <div className="cp-metric-top">
                <span>RESUME MATCH</span>
                <span className="cp-metric-icon">
                  <Target size={18} />
                </span>
              </div>

              <div className="cp-metric-value">
                {result ? `${score}%` : "—"}
              </div>

              <div className="cp-metric-foot">
                {result
                  ? "Recognized skill overlap"
                  : "Run an analysis to see your score"}
              </div>

              {result && (
                <div className="cp-mini-track">
                  <span style={{ width: `${score}%` }} />
                </div>
              )}
            </article>

            <article className="cp-metric-card">
              <div className="cp-metric-top">
                <span>SKILLS MATCHED</span>
                <span className="cp-metric-icon mint">
                  <CheckCircle2 size={18} />
                </span>
              </div>

              <div className="cp-metric-value">
                {result ? matchedSkills.length : "—"}
              </div>

              <div className="cp-metric-foot">
                {result
                  ? "Found in resume and role"
                  : "Your relevant strengths"}
              </div>
            </article>

            <article className="cp-metric-card">
              <div className="cp-metric-top">
                <span>SKILL GAPS</span>
                <span className="cp-metric-icon sand">
                  <TrendingUp size={18} />
                </span>
              </div>

              <div className="cp-metric-value">
                {result ? missingSkills.length : "—"}
              </div>

              <div className="cp-metric-foot">
                {result
                  ? "Requirements to explore"
                  : "Areas to develop"}
              </div>
            </article>

            <article className="cp-metric-card">
              <div className="cp-metric-top">
                <span>ROADMAP TASKS</span>
                <span className="cp-metric-icon blue">
                  <GraduationCap size={18} />
                </span>
              </div>

              <div className="cp-metric-value">
                {result ? roadmap.length : "—"}
              </div>

              <div className="cp-metric-foot">
                {result
                  ? `${completedCount} completed so far`
                  : "Suggested learning steps"}
              </div>
            </article>
          </section>

          {/* ANALYSIS SECTION HEADING */}
          <section className="cp-section-intro" id="cp-analysis">
            <div>
              <div className="cp-eyebrow">01 / GET STARTED</div>
              <h2>Analyze your resume</h2>

              <p>
                Bring your resume and a target job description together for
                a focused comparison.
              </p>
            </div>

            {result && (
              <button
                className="cp-secondary-button"
                type="button"
                onClick={resetAnalysis}
              >
                <RotateCcw size={15} />
                New analysis
              </button>
            )}
          </section>

          {/* ANALYSIS FORM */}
          <form className="cp-analysis-grid" onSubmit={analyzeResume}>
            {/* JOB DESCRIPTION */}
            <section className="cp-card cp-job-card">
              <div className="cp-card-heading">
                <span className="cp-card-icon">
                  <BriefcaseBusiness size={19} />
                </span>

                <div>
                  <h3>Target role</h3>
                  <p>
                    Paste the job description you want to work toward.
                  </p>
                </div>

                <span className="cp-step-badge">STEP 1</span>
              </div>

              <label className="cp-label" htmlFor="job-description">
                JOB DESCRIPTION
              </label>

              <textarea
                id="job-description"
                className="cp-textarea"
                placeholder={
                  "Paste the job description here...\n\nInclude responsibilities, required skills, and tools mentioned in the role."
                }
                value={jobDescription}
                onChange={(event) =>
                  setJobDescription(event.target.value)
                }
                rows={10}
                maxLength={30000}
              />

              <div className="cp-field-foot">
                <span>
                  More detail helps make the comparison useful.
                </span>

                <span>
                  {jobDescription.length.toLocaleString()} / 30,000
                </span>
              </div>
            </section>

            {/* RESUME UPLOAD */}
            <section className="cp-card cp-resume-card">
              <div className="cp-card-heading">
                <span className="cp-card-icon mint">
                  <FileText size={19} />
                </span>

                <div>
                  <h3>Your resume</h3>
                  <p>Upload a text-based PDF to get started.</p>
                </div>

                <span className="cp-step-badge">STEP 2</span>
              </div>

              <label className="cp-label" htmlFor="resume-file">
                RESUME FILE
              </label>

              <div
                className={`cp-dropzone ${
                  dragging ? "is-dragging" : ""
                } ${file ? "has-file" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  chooseFile(event.dataTransfer.files?.[0]);
                }}
              >
                <input
                  id="resume-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="visually-hidden"
                  onChange={(event) =>
                    chooseFile(event.target.files?.[0])
                  }
                />

                {file ? (
                  <>
                    <div className="cp-upload-symbol">
                      <FileText size={24} />
                    </div>

                    <div className="cp-file-details">
                      <strong>{file.name}</strong>
                      <span>
                        {(file.size / 1024).toFixed(0)} KB · PDF document
                      </span>
                    </div>

                    <button
                      type="button"
                      className="cp-remove-file"
                      aria-label="Remove resume"
                      onClick={() => setFile(null)}
                    >
                      <X size={17} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="cp-upload-symbol">
                      <Upload size={24} />
                    </div>

                    <strong>Drop your resume here</strong>

                    <span>
                      or{" "}
                      <label
                        htmlFor="resume-file"
                        className="cp-browse-link"
                      >
                        browse files
                      </label>
                    </span>

                    <small>PDF only · Maximum 5 MB</small>
                  </>
                )}
              </div>

              <div className="cp-file-note">
                <CheckCircle2 size={15} />
                <span>
                  Your resume is sent to the local analysis API and is not
                  saved to a database.
                </span>
              </div>

              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              <button
                className="cp-primary-button cp-submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="spin" size={17} />
                    Analyzing with Gemini AI...
                  </>
                ) : (
                  <>
                    Analyze compatibility
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </section>
          </form>

          {/* INITIAL EXPLANATION */}
          {!result && (
            <section className="cp-how-it-works">
              <div className="cp-how-icon">
                <Zap size={18} />
              </div>

              <div>
                <strong>What you'll get from your analysis</strong>
                <p>
                  AI-assisted resume and job-description comparison, assessed
                  skill evidence, matched and missing requirements, and a
                  personalized learning roadmap. The score is not a prediction
                  of hiring success.
                </p>
              </div>

              <ChevronRight size={18} />
            </section>
          )}

          {/* RESULTS */}
          {result && (
            <section
              className="results-section cp-results-section"
              id="cp-results"
            >
              <div className="cp-section-intro cp-results-intro">
                <div>
                  <div className="cp-eyebrow">
                    <Sparkles size={14} />
                    02 / YOUR INSIGHTS
                  </div>

                  <h2>Career gap analysis</h2>
                  <p>{result.summary}</p>
                </div>

                <div className="cp-result-file" style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                  <span style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                    <FileText size={15} />
                    {result.filename || file?.name || "Resume analyzed"}
                  </span>
                  {aiModel && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        borderRadius: "999px",
                        padding: "5px 9px",
                        background: "rgba(13, 148, 136, 0.10)",
                        color: "#0f766e",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                      title="Model reported by the backend response"
                    >
                      <Sparkles size={13} />
                      AI: {aiModel}
                    </span>
                  )}
                </div>
              </div>

              {/* SCORE SUMMARY */}
              <div className="cp-result-score-grid">
                <article className="cp-card cp-score-card">
                  <div className="cp-score-label">
                    OVERALL SKILL OVERLAP
                  </div>

                  <div className="cp-score-number">
                    {score}
                    <span>%</span>
                  </div>

                  <div className="cp-score-track">
                    <span style={{ width: `${score}%` }} />
                  </div>

                  <p>
                    A simple overlap indicator based on recognized
                    skills—not a hiring prediction.
                  </p>
                </article>

                <article className="cp-card cp-result-stat">
                  <span className="cp-card-icon mint">
                    <CheckCircle2 size={19} />
                  </span>

                  <span className="cp-label">MATCHED SKILLS</span>
                  <strong>{matchedSkills.length}</strong>

                  <p>
                    Recognized in both the resume and job description.
                  </p>
                </article>

                <article className="cp-card cp-result-stat">
                  <span className="cp-card-icon sand">
                    <Target size={19} />
                  </span>

                  <span className="cp-label">SKILLS TO DEVELOP</span>
                  <strong>{missingSkills.length}</strong>

                  <p>
                    Requirements not detected in the resume text.
                  </p>
                </article>
              </div>

              {/* MATCHED AND MISSING SKILLS */}
              <div className="skill-grid cp-skill-grid">
                <section className="panel skill-panel cp-card">
                  <div className="skill-title">
                    <span className="skill-symbol matched-symbol">
                      <CheckCircle2 size={18} />
                    </span>

                    <div>
                      <h3>Skills matched</h3>
                      <p>Found in both your resume and the role.</p>
                    </div>

                    <strong className="skill-count">
                      {matchedSkills.length}
                    </strong>
                  </div>

                  <div className="skill-tags">
                    {matchedSkills.length ? (
                      matchedSkills.map((skill) => (
                        <span
                          className="skill-tag matched-tag"
                          key={skill}
                        >
                          <Check size={13} />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="empty-skills">
                        No matching recognized skills found yet.
                      </p>
                    )}
                  </div>
                </section>

                <section className="panel skill-panel cp-card">
                  <div className="skill-title">
                    <span className="skill-symbol missing-symbol">
                      <Target size={18} />
                    </span>

                    <div>
                      <h3>Skills to develop</h3>
                      <p>
                        Role requirements not detected in your resume.
                      </p>
                    </div>

                    <strong className="skill-count">
                      {missingSkills.length}
                    </strong>
                  </div>

                  <div className="skill-tags">
                    {missingSkills.length ? (
                      missingSkills.map((skill) => (
                        <span
                          className="skill-tag missing-tag"
                          key={skill}
                        >
                          {skill}
                          <ChevronRight size={13} />
                        </span>
                      ))
                    ) : (
                      <p className="empty-skills">
                        No missing recognized skills detected.
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* AI SKILL EVIDENCE */}
              {skillEvidence.length > 0 && (
                <section
                  className="panel cp-card"
                  aria-label="AI skill evidence"
                  style={{ marginTop: "20px", padding: "22px" }}
                >
                  <div className="section-heading compact-heading">
                    <div className="resume-skill-icon">
                      <BrainCircuit size={18} />
                    </div>
                    <div>
                      <h3>AI skill assessment</h3>
                      <p>
                        Review the evidence and reasoning behind each assessed
                        job requirement.
                      </p>
                    </div>
                    <span className="count-pill">
                      {skillEvidence.length} assessed
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
                    {skillEvidence.map((item, index) => (
                      <article
                        key={`${item.skill}-${index}`}
                        style={{
                          border: "1px solid var(--border-color, #e5e7eb)",
                          borderRadius: "12px",
                          padding: "14px 16px",
                          background: "var(--card-background, transparent)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          <strong>{item.skill}</strong>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              borderRadius: "999px",
                              padding: "4px 9px",
                              background: item.matched
                                ? "rgba(16, 185, 129, 0.12)"
                                : "rgba(217, 119, 6, 0.12)",
                              color: item.matched ? "#047857" : "#b45309",
                            }}
                          >
                            {item.matched ? "MATCHED" : "GAP TO REVIEW"}
                          </span>
                        </div>

                        {item.evidence && (
                          <p style={{ margin: "10px 0 0", lineHeight: 1.6 }}>
                            <strong>Resume evidence: </strong>
                            {item.evidence}
                          </p>
                        )}

                        {item.reason && (
                          <p style={{ margin: "6px 0 0", lineHeight: 1.6, opacity: 0.85 }}>
                            <strong>AI reasoning: </strong>
                            {item.reason}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>

                  <p style={{ fontSize: "12px", opacity: 0.75, marginTop: "14px" }}>
                    AI assessments can be imperfect. Verify the evidence against
                    your actual experience before using it to make career decisions.
                  </p>
                </section>
              )}

              {/* RESUME SKILLS */}
              <section className="panel resume-skills-panel cp-card">
                <div className="section-heading compact-heading">
                  <div className="resume-skill-icon">
                    <FileText size={18} />
                  </div>

                  <div>
                    <h3>Skills detected in your resume</h3>
                    <p>Skills recognized in the uploaded PDF text.</p>
                  </div>

                  <span className="count-pill">
                    {resumeSkills.length} detected
                  </span>
                </div>

                <div className="skill-tags resume-skill-tags">
                  {resumeSkills.length ? (
                    resumeSkills.map((skill) => (
                      <span
                        className="skill-tag resume-tag"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="empty-skills">
                      No recognized skills were detected in the resume
                      text.
                    </p>
                  )}
                </div>
              </section>

              {/* LEARNING ROADMAP */}
              <section
                className="panel roadmap-panel cp-card"
                id="cp-roadmap"
              >
                <div className="roadmap-header">
                  <div className="roadmap-icon">
                    <GraduationCap size={21} />
                  </div>

                  <div className="roadmap-heading-copy">
                    <h3>Your learning roadmap</h3>
                    <p>
                      Suggested practice steps based on skills to develop.
                    </p>
                  </div>

                  {totalRoadmapTasks > 0 && (
                    <span className="roadmap-progress-label">
                      {completedCount}/{totalRoadmapTasks} complete
                    </span>
                  )}
                </div>

                {totalRoadmapTasks > 0 && (
                  <div className="roadmap-progress-track">
                    <span
                      style={{
                        width: `${
                          (completedCount / totalRoadmapTasks) * 100
                        }%`,
                      }}
                    />
                  </div>
                )}

                {roadmap.length ? (
                  <div className="roadmap-list">
                    {roadmap.map((item, index) => {
                      const taskId = `${item.week}-${item.skill}`;
                      const isCompleted =
                        completedTasks.includes(taskId);

                      return (
                        <div
                          className={`roadmap-item ${
                            isCompleted ? "roadmap-item-complete" : ""
                          }`}
                          key={taskId}
                        >
                          <label
                            className="roadmap-check"
                            aria-label={`Mark ${item.skill} task complete`}
                          >
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => toggleTask(taskId)}
                            />

                            <span>
                              <Check size={13} />
                            </span>
                          </label>

                          <div className="roadmap-week">
                            WEEK{" "}
                            {String(item.week ?? index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div className="roadmap-content">
                            <strong>{item.skill}</strong>
                            <p>{item.task}</p>
                          </div>

                          <span className="task-time">
                            <Clock3 size={13} />
                            {item.estimated_time || (index < 2 ? "2–3 hrs" : "3–4 hrs")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="roadmap-empty">
                    No skill gaps were detected among recognized skills.
                    Review the role requirements for additional
                    opportunities.
                  </p>
                )}

                {roadmap.length > 0 && (
                  <p className="roadmap-disclaimer">
                    Time estimates are approximate. Progress is kept for
                    this page session only.
                  </p>
                )}
              </section>

              {/* METHODOLOGY NOTE */}
              <div className="method-note">
                <BrainCircuit size={17} />

                <p>
                  <strong>How to interpret this score:</strong>{" "}
                  {result.method_note} The score reflects recognized skill
                  overlap only; it does not measure experience depth,
                  project quality, or hiring likelihood.
                </p>
              </div>
            </section>
          )}

          {/* FOOTER */}
          <footer className="cp-footer">
            <span>
              © CareerPilot · Career intelligence for your next step
            </span>

            <span>
              <span className="cp-online-dot" />
              Local prototype
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}