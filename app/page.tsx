"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── API ──────────────────────────────────────────────────────────────────────
const api = {
  register: (b: any) => fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  login: (b: any) => fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  logout: () => fetch("/api/auth/logout", { method: "POST" }).then(r => r.json()),
  me: () => fetch("/api/auth/me").then(r => r.json()),
  getData: () => fetch("/api/data").then(r => r.json()),
  createAssignment: (b: any) => fetch("/api/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  updateAssignment: (b: any) => fetch("/api/assignments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  deleteAssignment: (id: string) => fetch("/api/assignments/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }).then(r => r.json()),
  createPurchase: (b: any) => fetch("/api/purchases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  createSession: (b: any) => fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  updateSession: (b: any) => fetch("/api/sessions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  createSubmission: (b: any) => fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  createReview: (b: any) => fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  updateUser: (b: any) => fetch("/api/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  getNotifs: () => fetch("/api/notifications").then(r => r.json()),
  markNotifsRead: () => fetch("/api/notifications", { method: "PATCH" }).then(r => r.json()),
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T: Record<string, Record<string, string>> = {
  en: {
    // Nav
    signin: "Sign in", getstarted: "Get started", marketplace: "Marketplace",
    experts: "Experts", talent: "Talent", dashboard: "Dashboard", signout: "Sign out",
    // Landing
    hero_title: "Build real-world experience.",
    hero_accent: "Get endorsed by experts",
    hero_sub: "Buy domain-specific assignments from senior professionals. Complete real company-style tasks, submit your work, and earn expert endorsements that prove your skills.",
    browse: "Browse assignments", start_free: "Start for free →",
    step1t: "Choose", step1d: "Pick a domain-specific task from a senior expert.",
    step2t: "Work", step2d: "Code in the workspace with session tracking.",
    step3t: "Submit", step3d: "GitHub repo + explanation.",
    step4t: "Review", step4d: "Expert scores with rubric. Real feedback.",
    step5t: "Endorsed", step5d: "Public endorsement recruiters can verify.",
    for_learners: "For learners", for_experts: "For experts", for_recruiters: "For recruiters",
    domains_title: "Assignments by domain",
    domains_sub: "Real tasks from industries that hire for domain expertise",
    cta_title: "Ready to build domain-specific proof?",
    cta_sub: "Free to get started. Your progress saves permanently.",
    create_account: "Create your account →",
    // Auth
    create_your_account: "Create your account",
    join_as: "I want to join as...",
    learner_role: "Learner", learner_desc: "Buy assignments, build skills, get endorsed",
    expert_role: "Expert", expert_desc: "Create assignments, review work, earn commission",
    recruiter_role: "Recruiter", recruiter_desc: "Browse endorsed candidates, filter by domain",
    continue: "Continue →", back: "← Back",
    already_account: "Already have an account?",
    no_account: "No account?", create_one: "Create one free",
    your_details: "Your details",
    full_name: "Full name", email: "Email", password: "Password",
    prof_title: "Professional title", company: "Company", years_exp: "Years of experience",
    github_username: "GitHub username", linkedin_url: "LinkedIn URL",
    bio_label: "Bio", bio_ph: "Brief professional summary...",
    skills_label: "Skills (comma-separated)", skills_ph: "e.g. Node.js, PostgreSQL, AWS",
    your_domains: "Your domains",
    creating: "Creating...", create_account_btn: "Create account",
    signin_account: "Sign in to your account",
    signing_in: "Signing in...",
    // Marketplace
    assignment_marketplace: "Assignment marketplace",
    marketplace_sub: "Domain-specific practical assignments created by senior experts",
    search_ph: "Search by title, domain, description...",
    all_domains: "All domains", all_levels: "All levels", all_roles: "All roles",
    no_assignments: "No assignments yet", no_assignments_body: "Experts haven't published any assignments yet.",
    no_results: "No results", clear_filters: "Clear filters",
    enrolled: "enrolled", endorsable: "Endorsable",
    // Assignment detail
    back_marketplace: "← Back to marketplace",
    overview: "Overview", requirements: "Requirements", rubric: "Evaluation rubric", expert_tab: "Expert",
    business_scenario: "BUSINESS SCENARIO", skills_demo: "SKILLS YOU'LL DEMONSTRATE",
    what_submit: "WHAT YOU'LL SUBMIT",
    one_time: "One-time purchase", you_own: "✓ You own this",
    enter_workspace: "Enter workspace →",
    full_access: "Full workspace access", req_checklist: "Requirements checklist",
    expert_reviews: "Expert reviews submission", endorsement_75: "Endorsement if score ≥ 75",
    revision_supported: "Revision requests supported",
    endorsement_note: "Endorsement requires ≥ 75/100. Expert makes the final call.",
    // Workspace
    not_started: "⚪ Not started", active: "🟢 Active", paused: "🟡 Paused",
    start_session: "Start session", pause: "Pause", resume: "Resume", submit_work: "Submit →",
    session_status: "SESSION STATUS", active_time: "Active time",
    tab_switches: "Tab switches", pauses_label: "Pauses", camera: "Camera",
    integrity: "Integrity", good: "🟢 Good", medium: "🟡 Medium", concern: "🔴 Concern",
    link_work: "Link your work", github_url: "GitHub repo URL *", live_demo: "Live demo (optional)",
    explanation: "Explanation", expl_ph: "Your approach, decisions, trade-offs...",
    review_sub: "Review →", confirm_sub: "Confirm submission",
    submitting: "Submitting...", submit_review: "Submit for review ✓",
    submitted_title: "Submission received!", submitted_body: "The expert has been notified and will review your work.",
    go_dashboard: "Go to dashboard →",
    // Dashboard
    welcome_back: "Welcome back,",
    purchased: "Purchased", submitted: "Submitted", endorsed: "Endorsed", avg_score: "Avg score",
    my_assignments: "My assignments", submissions: "Submissions", endorsements: "Endorsements",
    no_purchases: "No assignments yet", browse_marketplace: "Browse marketplace →",
    enter_workspace_btn: "Enter workspace →", continue_btn: "Continue →",
    pending_review: "pending review", revision_requested: "revision requested",
    no_submissions: "No submissions yet", no_endorsements: "No endorsements yet",
    expert_feedback: "EXPERT FEEDBACK",
    // Expert dash
    expert_dashboard: "Expert dashboard",
    assignments_label: "Assignments", sales: "Sales", earnings: "Earnings", pending: "Pending",
    pending_verification: "⚠ Pending verification — ask an admin to approve you.",
    verified_expert: "✓ Verified Expert",
    create_assignment: "+ Create assignment",
    no_assignments_expert: "No assignments yet",
    create_first: "Create your first assignment →",
    your_assignments: "Your assignments", view_all: "View all →",
    review_submissions: "Review submissions", endorsements_given: "Endorsements given",
    no_submissions_yet: "No submissions yet", submissions_appear: "Submissions appear here once learners submit work.",
    score_submission: "Score the submission", overall_score: "Overall score",
    written_feedback: "Written feedback *", strengths_opt: "Strengths (optional)",
    decision: "Decision", endorse_btn: "🏅 Endorse", revision_btn: "↺ Revision", reject_btn: "✕ Reject",
    endorsement_text: "Endorsement text *", revision_notes: "Revision notes",
    endorsing: "Submitting...", endorse_confirm: "Endorse ✓", send_revision: "Send for revision",
    submit_rejection: "Submit rejection", cancel: "Cancel",
    endorsed_score: "✓ Endorsed · Score:", rejected_label: "✕ Rejected", revision_label: "↺ Revision requested",
    no_endorsements_given: "No endorsements given yet",
    // Admin
    admin_panel: "Admin panel", platform_overview: "Platform overview",
    total_users: "Total users", published: "Published",
    expert_verification: "Expert verification", no_experts: "No experts registered yet",
    approve: "Approve ✓", reject: "Reject", revoke: "Revoke",
    remove_assignment: "Remove",
    awaiting_verification: "awaiting verification",
    review_applications: "Review applications",
    // Profile
    edit_profile: "Edit profile", save: "Save", saving: "Saving...",
    avatar_url_label: "Profile photo URL", avatar_ph: "https://example.com/photo.jpg",
    profile_updated: "Profile updated!",
    // Payment
    complete_purchase: "Complete purchase", total_due: "Total due",
    cardholder_name: "Cardholder name", card_number: "Card number", expiry: "Expiry", cvc: "CVC",
    pay_btn: "Pay", processing: "Processing payment...", wait: "Please wait, do not close this window.",
    payment_success: "Payment successful!", redirecting: "Redirecting to your workspace...",
    secured: "Secured by Devex Pay · Encrypted",
    // Misc
    no_notifs: "No notifications yet", notifications: "Notifications",
    from_purchase: "From purchase to endorsement",
    years_experience: "years experience",
    contact: "Contact",
    verified: "✓ Verified", unverified: "Pending",
    view_profile: "View profile",
    candidates: "Candidates", browse_talent: "Browse talent",
    talent_discovery: "Talent discovery", talent_sub: "Browse learners with expert endorsements",
    no_candidates: "No candidates yet", candidates_appear: "Candidates appear here once learners complete assignments.",
    lang_toggle: "AZ",
  },
  az: {
    // Nav
    signin: "Daxil ol", getstarted: "Başla", marketplace: "Bazar",
    experts: "Ekspertlər", talent: "İstedadlar", dashboard: "İdarə paneli", signout: "Çıxış",
    // Landing
    hero_title: "Real dünya təcrübəsi qazanın.",
    hero_accent: "Ekspertlər tərəfindən təsdiqlənin",
    hero_sub: "Peşəkar mütəxəssislərdən sahəyə özgü tapşırıqlar alın. Real şirkət mühitindəki işlər edin, işinizi göndərin və bacarıqlarınızı sübut edən ekspert tövsiyələri qazanın.",
    browse: "Tapşırıqlara bax", start_free: "Pulsuz başla →",
    step1t: "Seç", step1d: "Böyük ekspertdən sahəyə özgü tapşırıq seç.",
    step2t: "İşlə", step2d: "İş mühitində otur, sessiya izlənilir.",
    step3t: "Göndər", step3d: "GitHub repo + izahat.",
    step4t: "Yoxla", step4d: "Ekspert rubrikaya görə qiymətləndirir.",
    step5t: "Təsdiqlə", step5d: "İşəgötürənlərin görəcəyi açıq tövsiyə.",
    for_learners: "Tələbələr üçün", for_experts: "Ekspertlər üçün", for_recruiters: "Işəgötürənlər üçün",
    domains_title: "Sahəyə görə tapşırıqlar",
    domains_sub: "Sahə biliyinə görə işə götürən sənayələrdən real tapşırıqlar",
    cta_title: "Sahəyə özgü sübutunuzu qurmağa hazırsınız?",
    cta_sub: "Başlamaq pulsuzdur. İrəliləyişiniz daim yadda saxlanılır.",
    create_account: "Hesab yarat →",
    // Auth
    create_your_account: "Hesabınızı yaradın",
    join_as: "Kimi qoşulmaq istəyirsiniz?",
    learner_role: "Tələbə", learner_desc: "Tapşırıq alın, bacarıq qazanın, tövsiyə alın",
    expert_role: "Ekspert", expert_desc: "Tapşırıq yaradın, işi nəzərdən keçirin, qazanın",
    recruiter_role: "İşəgötürən", recruiter_desc: "Tövsiyəli namizədlərə baxın, sahəyə görə süzün",
    continue: "Davam et →", back: "← Geri",
    already_account: "Artıq hesabınız var?",
    no_account: "Hesabınız yoxdur?", create_one: "Pulsuz yarat",
    your_details: "Məlumatlarınız",
    full_name: "Ad soyad", email: "E-poçt", password: "Şifrə",
    prof_title: "Peşəkar vəzifə", company: "Şirkət", years_exp: "Təcrübə ili",
    github_username: "GitHub istifadəçi adı", linkedin_url: "LinkedIn URL",
    bio_label: "Haqqında", bio_ph: "Qısa peşəkar məlumat...",
    skills_label: "Bacarıqlar (vergüllə)", skills_ph: "məs. Node.js, PostgreSQL, AWS",
    your_domains: "Sahələriniz",
    creating: "Yaradılır...", create_account_btn: "Hesab yarat",
    signin_account: "Hesabınıza daxil olun",
    signing_in: "Daxil olunur...",
    // Marketplace
    assignment_marketplace: "Tapşırıq bazarı",
    marketplace_sub: "Böyük ekspertlər tərəfindən hazırlanmış sahəyə özgü tapşırıqlar",
    search_ph: "Başlıq, sahə, təsvir üzrə axtar...",
    all_domains: "Bütün sahələr", all_levels: "Bütün səviyyələr", all_roles: "Bütün rollar",
    no_assignments: "Tapşırıq yoxdur", no_assignments_body: "Ekspertlər hələ tapşırıq paylaşmayıb.",
    no_results: "Nəticə yoxdur", clear_filters: "Filtrləri sıfırla",
    enrolled: "qeydiyyatçı", endorsable: "Tövsiyə oluna bilər",
    // Assignment detail
    back_marketplace: "← Bazara qayıt",
    overview: "Ümumi baxış", requirements: "Tələblər", rubric: "Qiymətləndirmə rubrikası", expert_tab: "Ekspert",
    business_scenario: "BIZNES SENARİSİ", skills_demo: "NƏMÜNƏYİ EDƏCƏYİNİZ BACARIQLAR",
    what_submit: "NƏ GÖNDƏRƏCƏKSINIZ",
    one_time: "Bir dəfəlik ödəniş", you_own: "✓ Sizdə var",
    enter_workspace: "İş mühitinə keç →",
    full_access: "Tam iş mühiti girişi", req_checklist: "Tələblər siyahısı",
    expert_reviews: "Ekspert işinizi nəzərdən keçirir", endorsement_75: "75+ bal olduqda tövsiyə",
    revision_supported: "Düzəliş istəkləri dəstəklənir",
    endorsement_note: "Tövsiyə üçün ≥ 75/100 tələb olunur. Ekspert son qərarı verir.",
    // Workspace
    not_started: "⚪ Başlanmayıb", active: "🟢 Aktiv", paused: "🟡 Fasilə",
    start_session: "Sessiyanı başlat", pause: "Fasilə", resume: "Davam et", submit_work: "Göndər →",
    session_status: "SESSİYA VƏZİYYƏTİ", active_time: "Aktiv vaxt",
    tab_switches: "Tab keçidləri", pauses_label: "Fasilələr", camera: "Kamera",
    integrity: "Bütövlük", good: "🟢 Yaxşı", medium: "🟡 Orta", concern: "🔴 Şübhəli",
    link_work: "İşinizi əlavə edin", github_url: "GitHub repo URL *", live_demo: "Canlı demo (ixtiyari)",
    explanation: "İzahat", expl_ph: "Yanaşmanız, qərarlarınız, kompromislər...",
    review_sub: "Yoxla →", confirm_sub: "Göndərişi təsdiqləyin",
    submitting: "Göndərilir...", submit_review: "Nəzərdən keçirməyə göndər ✓",
    submitted_title: "Göndəriş qəbul edildi!", submitted_body: "Ekspert xəbərdar edildi və işinizi yoxlayacaq.",
    go_dashboard: "İdarə panelinə keç →",
    // Dashboard
    welcome_back: "Xoş gəldiniz,",
    purchased: "Alınan", submitted: "Göndərilən", endorsed: "Tövsiyə olunan", avg_score: "Ort. bal",
    my_assignments: "Tapşırıqlarım", submissions: "Göndərişlər", endorsements: "Tövsiyələr",
    no_purchases: "Tapşırıq yoxdur", browse_marketplace: "Bazara bax →",
    enter_workspace_btn: "İş mühitinə keç →", continue_btn: "Davam et →",
    pending_review: "gözləyir", revision_requested: "düzəliş istənildi",
    no_submissions: "Göndəriş yoxdur", no_endorsements: "Tövsiyə yoxdur",
    expert_feedback: "EKSPERT RƏYİ",
    // Expert dash
    expert_dashboard: "Ekspert paneli",
    assignments_label: "Tapşırıqlar", sales: "Satışlar", earnings: "Qazanc", pending: "Gözləyən",
    pending_verification: "⚠ Təsdiq gözlənilir — admin sizə icazə verməlidir.",
    verified_expert: "✓ Təsdiqlənmiş Ekspert",
    create_assignment: "+ Tapşırıq yarat",
    no_assignments_expert: "Tapşırıq yoxdur",
    create_first: "İlk tapşırığınızı yaradın →",
    your_assignments: "Tapşırıqlarınız", view_all: "Hamısına bax →",
    review_submissions: "Göndərişlərə bax", endorsements_given: "Verilən tövsiyələr",
    no_submissions_yet: "Hələ göndəriş yoxdur", submissions_appear: "Tələbələr iş göndərəndə burda görünər.",
    score_submission: "Göndərişi qiymətləndir", overall_score: "Ümumi bal",
    written_feedback: "Yazılı rəy *", strengths_opt: "Güclü tərəflər (ixtiyari)",
    decision: "Qərar", endorse_btn: "🏅 Tövsiyə et", revision_btn: "↺ Düzəliş", reject_btn: "✕ Rədd et",
    endorsement_text: "Tövsiyə mətni *", revision_notes: "Düzəliş qeydləri",
    endorsing: "Göndərilir...", endorse_confirm: "Tövsiyə et ✓", send_revision: "Düzəlişə göndər",
    submit_rejection: "Rəddi göndər", cancel: "Ləğv et",
    endorsed_score: "✓ Tövsiyə edildi · Bal:", rejected_label: "✕ Rədd edildi", revision_label: "↺ Düzəliş istənildi",
    no_endorsements_given: "Hələ tövsiyə verilməyib",
    // Admin
    admin_panel: "Admin paneli", platform_overview: "Platforma icmalı",
    total_users: "Ümumi istifadəçilər", published: "Yayımlanmış",
    expert_verification: "Ekspert təsdiqi", no_experts: "Hələ ekspert yoxdur",
    approve: "Təsdiqlə ✓", reject: "Rədd et", revoke: "Ləğv et",
    remove_assignment: "Sil",
    awaiting_verification: "təsdiq gözləyir",
    review_applications: "Müraciətlərə bax",
    // Profile
    edit_profile: "Profili düzəlt", save: "Saxla", saving: "Saxlanılır...",
    avatar_url_label: "Profil foto URL", avatar_ph: "https://example.com/foto.jpg",
    profile_updated: "Profil yeniləndi!",
    // Payment
    complete_purchase: "Ödənişi tamamla", total_due: "Cəmi",
    cardholder_name: "Kart sahibinin adı", card_number: "Kart nömrəsi", expiry: "Son tarix", cvc: "CVC",
    pay_btn: "Ödə", processing: "Ödəniş emal edilir...", wait: "Zəhmət olmasa gözləyin, pəncərəni bağlamayın.",
    payment_success: "Ödəniş uğurlu oldu!", redirecting: "İş mühitinə yönləndirilirsiniz...",
    secured: "Devex Pay ilə təhlükəsiz · Şifrələnmiş",
    // Misc
    no_notifs: "Bildiriş yoxdur", notifications: "Bildirişlər",
    from_purchase: "Alışdan tövsiyəyə qədər",
    years_experience: "il təcrübə",
    contact: "Əlaqə",
    verified: "✓ Təsdiqlənmiş", unverified: "Gözləyir",
    view_profile: "Profili gör",
    candidates: "Namizədlər", browse_talent: "İstedadlara bax",
    talent_discovery: "İstedadları kəşf et", talent_sub: "Ekspert tövsiyəli tələbələrə baxın",
    no_candidates: "Namizəd yoxdur", candidates_appear: "Tələbələr tapşırıq tamamladıqda burda görünər.",
    lang_toggle: "EN",
  },
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DOMAINS = ["Fintech","E-commerce","Healthcare","EdTech","Logistics","SaaS","Cybersecurity","AI/ML","HRTech","TravelTech","PropTech","Gaming"];
const ROLE_TYPES = ["Backend Developer","Frontend Developer","Full-stack Developer","Mobile Developer","DevOps Engineer","QA Engineer","Data Engineer","ML Engineer","UI/UX Designer","Product Manager"];
const DIFFICULTIES = ["Beginner","Junior","Intermediate","Advanced"];
const DC: Record<string,string> = {Fintech:"#dc2626","E-commerce":"#d97706",Healthcare:"#16a34a",EdTech:"#0284c7",Logistics:"#7c3aed",SaaS:"#6366f1",Cybersecurity:"#b91c1c","AI/ML":"#6d28d9",HRTech:"#c2410c",TravelTech:"#0369a1",PropTech:"#047857",Gaming:"#9333ea"};
const ADMIN_EMAIL = "testest@gmail.com";

const C = {bg:"#0a0f1e",card:"#0f172a",cardH:"#131f35",bd:"#1e293b",acc:"#6366f1",accBg:"rgba(99,102,241,0.12)",grn:"#22c55e",grnBg:"rgba(34,197,94,0.1)",red:"#ef4444",redBg:"rgba(239,68,68,0.1)",amb:"#f59e0b",ambBg:"rgba(245,158,11,0.1)",tp:"#f1f5f9",ts:"#94a3b8",tm:"#475569"};
const card0 = (x: any = {}) => ({ background: C.card, border: `1px solid ${C.bd}`, borderRadius: 12, ...x });

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function Btn({ children, v = "primary", sz = "md", onClick, disabled, full, style = {} }: any) {
  const pad: any = { sm: "7px 14px", md: "10px 20px", lg: "14px 30px" };
  const fs: any = { sm: 13, md: 14, lg: 15 };
  const vs: any = { primary: { background: C.acc, color: "#fff", border: "none" }, ghost: { background: "transparent", color: C.ts, border: `1px solid ${C.bd}` }, danger: { background: C.red, color: "#fff", border: "none" }, success: { background: C.grn, color: "#fff", border: "none" }, outline: { background: "transparent", color: C.acc, border: `1px solid ${C.acc}` } };
  return <button onClick={onClick} disabled={disabled} style={{ padding: pad[sz], fontSize: fs[sz], fontWeight: 600, borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "opacity 0.15s", width: full ? "100%" : undefined, opacity: disabled ? 0.45 : 1, ...vs[v], ...style }} onMouseEnter={(e: any) => { if (!disabled) e.currentTarget.style.opacity = "0.8"; }} onMouseLeave={(e: any) => e.currentTarget.style.opacity = "1"}>{children}</button>;
}

function Field({ label, value, onChange, placeholder, type = "text", textarea, rows = 3, options, hint }: any) {
  const s: any = { width: "100%", boxSizing: "border-box", padding: "10px 14px", background: "#080d18", border: `1px solid ${C.bd}`, borderRadius: 8, color: C.tp, fontSize: 14, outline: "none", resize: "vertical" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: C.ts }}>{label}</label>}
      {hint && <span style={{ fontSize: 12, color: C.tm }}>{hint}</span>}
      {options ? (
        <select value={value} onChange={(e: any) => onChange(e.target.value)} style={{ ...s, cursor: "pointer" }}>{options.map((o: any) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>
      ) : textarea ? (
        <textarea value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s} />
      ) : (
        <input value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} type={type} style={s} onFocus={(e: any) => e.target.style.borderColor = C.acc} onBlur={(e: any) => e.target.style.borderColor = C.bd} />
      )}
    </div>
  );
}

function Tag({ children, color = C.acc }: any) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, background: color + "22", color, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>{children}</span>;
}
function DTag({ domain }: any) { return <Tag color={DC[domain] || C.acc}>{domain}</Tag>; }

function Avi({ name, size = 36, avatarUrl }: any) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: C.bd }} onError={(e: any) => { e.target.style.display = "none"; }} />;
  }
  const ini = (name || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = [...(name || "")].reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % 360;
  return <div style={{ width: size, height: size, borderRadius: "50%", background: `hsl(${hue},50%,32%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>{ini}</div>;
}

function ExtLink({ href, children, style = {} }: any) {
  if (!href) return <span style={style}>{children}</span>;
  const url = href.startsWith("http") ? href : "https://" + href;
  return <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: C.acc, textDecoration: "none", ...style }} onMouseEnter={(e: any) => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={(e: any) => e.currentTarget.style.textDecoration = "none"}>{children}</a>;
}

function Card({ children, style = {}, onClick }: any) {
  const [h, setH] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ ...card0(), padding: 20, cursor: onClick ? "pointer" : "default", borderColor: h && onClick ? C.acc : C.bd, background: h && onClick ? C.cardH : C.card, ...style }}>{children}</div>;
}
function Empty({ icon, title, body, action }: any) {
  return <div style={{ textAlign: "center", padding: "60px 24px" }}><div style={{ fontSize: 48, marginBottom: 14 }}>{icon}</div><h3 style={{ color: C.tp, fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>{title}</h3>{body && <p style={{ color: C.ts, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>{body}</p>}{action}</div>;
}
function Spinner() { return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: C.tm, fontSize: 14, gap: 10 }}><div style={{ width: 20, height: 20, border: `2px solid ${C.bd}`, borderTop: `2px solid ${C.acc}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Loading...</div>; }
function Toast({ msg, type, onDone }: any) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);
  const bc = type === "error" ? C.red : type === "warn" ? C.amb : C.grn;
  return <div style={{ position: "fixed", bottom: 24, right: 24, background: C.card, border: `1px solid ${bc}`, borderRadius: 10, padding: "13px 20px", color: C.tp, fontSize: 14, zIndex: 2000, maxWidth: 360, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", animation: "fadeIn 0.2s ease" }}><span style={{ color: bc }}>{type === "error" ? "✕ " : type === "warn" ? "⚠ " : "✓ "}</span>{msg}</div>;
}
function Tabs({ tabs, active, onChange }: any) {
  return <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${C.bd}`, marginBottom: 24, overflowX: "auto" }}>{tabs.map((t: any) => <button key={t.id} onClick={() => onChange(t.id)} style={{ padding: "10px 16px", background: "none", border: "none", borderBottom: `2px solid ${active === t.id ? C.acc : "transparent"}`, color: active === t.id ? C.acc : C.ts, fontWeight: active === t.id ? 600 : 400, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>{t.label}</button>)}</div>;
}
function Score({ v }: any) { const c = v >= 80 ? C.grn : v >= 60 ? C.amb : C.red; return <span style={{ fontWeight: 700, color: c }}>{v}/100</span>; }

function NotifBell({ userId }: any) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const unread = notifs.filter(n => !n.read).length;
  useEffect(() => {
    api.getNotifs().then(d => Array.isArray(d) ? setNotifs(d) : null).catch(() => {});
    const t = setInterval(() => api.getNotifs().then(d => Array.isArray(d) ? setNotifs(d) : null).catch(() => {}), 15000);
    return () => clearInterval(t);
  }, [userId]);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={async () => { setOpen(o => !o); if (!open && unread > 0) { await api.markNotifsRead(); setNotifs(p => p.map(n => ({ ...n, read: true }))); } }} style={{ background: "none", border: `1px solid ${C.bd}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: C.ts, fontSize: 15, position: "relative" }}>
        🔔{unread > 0 && <span style={{ position: "absolute", top: 3, right: 3, width: 7, height: 7, borderRadius: "50%", background: C.red }} />}
      </button>
      {open && <div style={{ position: "fixed", left: 228, bottom: 80, width: 300, ...card0(), zIndex: 500, maxHeight: "60vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.8)", border: `1px solid ${C.acc}44` }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.bd}`, fontSize: 13, fontWeight: 600, color: C.tp }}>Notifications</div>
        {notifs.length === 0 ? <div style={{ padding: "20px 16px", textAlign: "center", color: C.tm, fontSize: 13 }}>No notifications yet</div>
          : notifs.slice(0, 10).map((n: any) => <div key={n.id} style={{ padding: "11px 16px", borderBottom: `1px solid ${C.bd}`, background: n.read ? "transparent" : C.accBg }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.tp, marginBottom: 2 }}>{n.title}</div>
            <div style={{ fontSize: 12, color: C.ts }}>{n.message}</div>
          </div>)}
      </div>}
    </div>
  );
}

function useData() {
  const [data, setData] = useState<any>({ users: [], assignments: [], purchases: [], sessions: [], submissions: [], reviews: [], endorsements: [] });
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try { const d = await api.getData(); if (d && !d.error) setData(d); } catch (e) { console.error(e); }
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, []);
  return { data, loading, refresh };
}


// ─── PROFILE EDIT MODAL ───────────────────────────────────────────────────────
function ProfileModal({ user, onSave, onClose, t }: any) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [github, setGithub] = useState(user.github || "");
  const [linkedin, setLinkedin] = useState(user.linkedin || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [title, setTitle] = useState(user.title || "");
  const [company, setCompany] = useState(user.company || "");
  const [skills, setSkills] = useState((user.skills || []).join(", "));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await api.updateUser({ id: user.id, name, bio, github, linkedin, avatar_url: avatarUrl, title, company, skills: skills.split(",").map((s: string) => s.trim()).filter(Boolean) });
    setSaving(false);
    onSave({ ...user, name, bio, github, linkedin, avatar_url: avatarUrl, title, company });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ ...card0(), width: "100%", maxWidth: 480, padding: 28, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.tp }}>{t.edit_profile}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.tm, fontSize: 24 }}>×</button>
        </div>
        {/* Avatar preview */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Avi name={name} size={64} avatarUrl={avatarUrl} />
          <div style={{ flex: 1 }}>
            <Field label={t.avatar_url_label} value={avatarUrl} onChange={setAvatarUrl} placeholder={t.avatar_ph} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label={t.full_name} value={name} onChange={setName} placeholder="Your name" />
          {(user.role === "expert") && <>
            <Field label={t.prof_title} value={title} onChange={setTitle} placeholder="e.g. Senior Backend Engineer" />
            <Field label={t.company} value={company} onChange={setCompany} placeholder="e.g. Stripe" />
          </>}
          <Field label={t.bio_label} value={bio} onChange={setBio} placeholder={t.bio_ph} textarea rows={3} />
          <Field label={t.skills_label} value={skills} onChange={setSkills} placeholder={t.skills_ph} />
          <Field label={t.github_username} value={github} onChange={setGithub} placeholder="yourhandle" />
          <Field label={t.linkedin_url} value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn v="ghost" onClick={onClose}>{t.cancel}</Btn>
            <Btn full onClick={save} disabled={saving}>{saving ? t.saving : t.save}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PaymentModal({ assignment, onSuccess, onClose, t }: any) {
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [card, setCard] = useState(""); const [expiry, setExpiry] = useState(""); const [cvc, setCvc] = useState(""); const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const fmt4 = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };
  const pay = () => {
    if (!name.trim()) { setErr(t.cardholder_name + " is required."); return; }
    if (card.replace(/\s/g, "").length < 16) { setErr("Enter a valid 16-digit card number."); return; }
    if (expiry.length < 5) { setErr("Enter a valid expiry date."); return; }
    if (cvc.length < 3) { setErr("Enter a valid CVC."); return; }
    setErr(""); setStep("processing");
    setTimeout(() => { setStep("done"); setTimeout(onSuccess, 1200); }, 2000);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ ...card0(), width: "100%", maxWidth: 420, padding: 28, animation: "fadeIn 0.2s ease" }}>
        {step === "form" && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.tp }}>{t.complete_purchase}</h2>
              <div style={{ fontSize: 13, color: C.ts, marginTop: 2 }}>{assignment.title}</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.tm, fontSize: 24 }}>×</button>
          </div>
          <div style={{ background: "#080d18", borderRadius: 10, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: C.ts, fontSize: 14 }}>{t.total_due}</span>
            <span style={{ fontSize: 26, fontWeight: 800, color: C.tp }}>${assignment.price}</span>
          </div>
          {err && <div style={{ background: C.redBg, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13, marginBottom: 14 }}>{err}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label={t.cardholder_name} value={name} onChange={setName} placeholder="Name on card" />
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: C.ts, display: "block", marginBottom: 5 }}>{t.card_number}</label>
              <input value={card} onChange={e => setCard(fmt4(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", background: "#080d18", border: `1px solid ${C.bd}`, borderRadius: 8, color: C.tp, fontSize: 14, outline: "none", fontFamily: "monospace", letterSpacing: 1 }} onFocus={(e: any) => e.target.style.borderColor = C.acc} onBlur={(e: any) => e.target.style.borderColor = C.bd} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: C.ts, display: "block", marginBottom: 5 }}>{t.expiry}</label><input value={expiry} onChange={e => setExpiry(fmtExp(e.target.value))} placeholder="MM/YY" maxLength={5} style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", background: "#080d18", border: `1px solid ${C.bd}`, borderRadius: 8, color: C.tp, fontSize: 14, outline: "none" }} onFocus={(e: any) => e.target.style.borderColor = C.acc} onBlur={(e: any) => e.target.style.borderColor = C.bd} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 500, color: C.ts, display: "block", marginBottom: 5 }}>{t.cvc}</label><input value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="123" maxLength={3} style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", background: "#080d18", border: `1px solid ${C.bd}`, borderRadius: 8, color: C.tp, fontSize: 14, outline: "none" }} onFocus={(e: any) => e.target.style.borderColor = C.acc} onBlur={(e: any) => e.target.style.borderColor = C.bd} /></div>
            </div>
          </div>
          <Btn full onClick={pay} style={{ marginTop: 20, padding: "13px", fontSize: 15, background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>{t.pay_btn} ${assignment.price} →</Btn>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 12, color: C.tm }}><span>🔒</span>{t.secured}</div>
        </>}
        {step === "processing" && <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${C.bd}`, borderTop: `3px solid ${C.acc}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: C.tp, marginBottom: 6 }}>{t.processing}</div>
          <div style={{ fontSize: 13, color: C.ts }}>{t.wait}</div>
        </div>}
        {step === "done" && <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.tp, marginBottom: 6 }}>{t.payment_success}</div>
          <div style={{ fontSize: 13, color: C.ts }}>{t.redirecting}</div>
        </div>}
      </div>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({ go, lang, setLang, t }: any) {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.tp }}>
      <nav style={{ borderBottom: `1px solid ${C.bd}`, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, background: C.bg + "ee", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Dev<span style={{ color: C.acc }}>ex</span></span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => setLang(lang === "en" ? "az" : "en")} style={{ background: C.accBg, border: `1px solid ${C.acc}44`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: C.acc, fontSize: 12, fontWeight: 700 }}>{t.lang_toggle}</button>
          <Btn v="ghost" sz="sm" onClick={() => go("login")}>{t.signin}</Btn>
          <Btn sz="sm" onClick={() => go("register")}>{t.getstarted}</Btn>
        </div>
      </nav>
      <div style={{ padding: "100px 40px 80px", textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: C.accBg, border: `1px solid ${C.acc}44`, borderRadius: 20, padding: "5px 16px", marginBottom: 28, fontSize: 13, color: C.acc, fontWeight: 600 }}>Domain-specific hiring proof for IT talent</div>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, margin: "0 0 22px", letterSpacing: -1.5 }}>{t.hero_title}<br /><span style={{ color: C.acc }}>{t.hero_accent}</span></h1>
        <p style={{ fontSize: 17, color: C.ts, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 40px" }}>{t.hero_sub}</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <Btn sz="lg" onClick={() => go("register")} style={{ padding: "14px 34px" }}>{t.start_free}</Btn>
          <Btn sz="lg" v="ghost" onClick={() => go("marketplace")} style={{ padding: "14px 34px" }}>{t.browse}</Btn>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.bd}`, borderBottom: `1px solid ${C.bd}`, padding: "64px 40px", background: "#0c1220" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, margin: "0 0 40px", letterSpacing: -0.5 }}>{t.from_purchase}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
            {[{ n: 1, icon: "🎯", tk: "step1t", dk: "step1d" }, { n: 2, icon: "💻", tk: "step2t", dk: "step2d" }, { n: 3, icon: "📤", tk: "step3t", dk: "step3d" }, { n: 4, icon: "🔍", tk: "step4t", dk: "step4d" }, { n: 5, icon: "🏅", tk: "step5t", dk: "step5d" }].map(({ n, icon, tk, dk }) => (
              <div key={n} style={{ textAlign: "center", padding: "14px 8px" }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: n === 5 ? C.acc : C.accBg, border: `1px solid ${C.acc}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 10px" }}>{icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.acc, marginBottom: 4 }}>STEP {n}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.tp, marginBottom: 4 }}>{t[tk]}</div>
                <div style={{ fontSize: 12, color: C.ts, lineHeight: 1.5 }}>{t[dk]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "64px 40px", background: "#0c1220", borderBottom: `1px solid ${C.bd}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { rk: "for_learners", icon: "👨‍💻", color: C.acc, pts: ["Real company-style tasks by senior experts", "Workspace with session integrity tracking", "Expert review with structured rubric", "Public endorsements on your profile", "Domain-specific proof for employers"] },
            { rk: "for_experts", icon: "🎓", color: C.grn, pts: ["Monetise your real industry experience", "Create assignments once, sell to many", "Review and endorse talent", "Build your professional authority", "80% commission on every sale"] },
            { rk: "for_recruiters", icon: "🏢", color: C.amb, pts: ["Filter candidates by domain and skill", "See who endorsed them and the rubric", "Review real GitHub repos and code", "Session integrity signals included", "Contact candidates directly"] },
          ].map(({ rk, icon, color, pts }) => (
            <div key={rk} style={{ ...card0(), padding: 28, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 30, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.tp, marginBottom: 14 }}>{t[rk]}</div>
              {pts.map(p => <div key={p} style={{ fontSize: 13, color: C.ts, padding: "4px 0", display: "flex", gap: 8 }}><span style={{ color }}>✓</span>{p}</div>)}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.bd}`, padding: "64px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 12px", letterSpacing: -0.5 }}>{t.cta_title}</h2>
        <p style={{ color: C.ts, fontSize: 16, margin: "0 0 30px" }}>{t.cta_sub}</p>
        <Btn sz="lg" onClick={() => go("register")} style={{ padding: "15px 40px", fontSize: 16 }}>{t.create_account}</Btn>
      </div>
      <div style={{ borderTop: `1px solid ${C.bd}`, padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Dev<span style={{ color: C.acc }}>ex</span></span>
        <span style={{ color: C.tm, fontSize: 13 }}>© 2025 Devex — Proof-of-work marketplace for IT talent</span>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function Register({ go, setUser, toast, t }: any) {
  const [step, setStep] = useState(1); const [role, setRole] = useState("");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [title, setTitle] = useState(""); const [company, setCompany] = useState(""); const [years, setYears] = useState("");
  const [bio, setBio] = useState(""); const [github, setGithub] = useState(""); const [linkedin, setLinkedin] = useState("");
  const [domains, setDomains] = useState<string[]>([]); const [skills, setSkills] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const toggleD = (d: string) => setDomains(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const submit = async () => {
    if (!name || !email || !password) { setErr("Name, email and password are required."); return; }
    if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (role === "expert" && domains.length === 0) { setErr("Please select at least one domain."); return; }
    // Block admin email from registering
    if (email.toLowerCase().trim() === ADMIN_EMAIL) { setErr("This email is reserved."); return; }
    setLoading(true); setErr("");
    const res = await api.register({ name, email, password, role, github, linkedin, bio, title, company, years: parseInt(years) || 0, domains, skills: skills.split(",").map((s: string) => s.trim()).filter(Boolean) });
    if (res.error) { setErr(res.error); setLoading(false); return; }
    setUser(res.user); toast("Account created! Welcome to Devex.", "success"); go("dashboard");
    setLoading(false);
  };
  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <button onClick={() => go("landing")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, fontWeight: 800, color: C.tp }}>Dev<span style={{ color: C.acc }}>ex</span></button>
          <div style={{ color: C.ts, fontSize: 14, marginTop: 6 }}>{t.create_your_account}</div>
        </div>
        <Card>
          {step === 1 && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.tp, marginBottom: 4 }}>{t.join_as}</div>
            {[{ r: "learner", icon: "👨‍💻", tk: "learner_role", dk: "learner_desc" }, { r: "expert", icon: "🎓", tk: "expert_role", dk: "expert_desc" }, { r: "recruiter", icon: "🏢", tk: "recruiter_role", dk: "recruiter_desc" }].map(({ r, icon, tk, dk }) => (
              <button key={r} onClick={() => setRole(r)} style={{ display: "flex", gap: 14, alignItems: "center", padding: 16, borderRadius: 10, border: `2px solid ${role === r ? C.acc : C.bd}`, background: role === r ? C.accBg : "transparent", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 28 }}>{icon}</span><div><div style={{ fontWeight: 700, color: C.tp, fontSize: 15 }}>{t[tk]}</div><div style={{ fontSize: 13, color: C.ts }}>{t[dk]}</div></div>
              </button>
            ))}
            <Btn full disabled={!role} onClick={() => setStep(2)}>{t.continue}</Btn>
            <div style={{ textAlign: "center", fontSize: 13, color: C.ts }}>{t.already_account} <button onClick={() => go("login")} style={{ background: "none", border: "none", cursor: "pointer", color: C.acc, fontWeight: 600 }}>{t.signin}</button></div>
          </div>}
          {step === 2 && <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.tp, marginBottom: 4 }}>{t.your_details}</div>
            {err && <div style={{ background: C.redBg, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13 }}>{err}</div>}
            <Field label={t.full_name + " *"} value={name} onChange={setName} placeholder="Your full name" />
            <Field label={t.email + " *"} value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
            <Field label={t.password + " *"} value={password} onChange={setPassword} placeholder="Min 6 characters" type="password" />
            {role === "expert" && <><Field label={t.prof_title + " *"} value={title} onChange={setTitle} placeholder="e.g. Senior Backend Engineer" /><Field label={t.company} value={company} onChange={setCompany} placeholder="e.g. Stripe" /><Field label={t.years_exp} value={years} onChange={setYears} placeholder="e.g. 8" type="number" /></>}
            <Field label={t.github_username} value={github} onChange={setGithub} placeholder="yourhandle" />
            <Field label={t.linkedin_url} value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
            <Field label={t.bio_label} value={bio} onChange={setBio} placeholder={t.bio_ph} textarea rows={3} />
            <Field label={t.skills_label} value={skills} onChange={setSkills} placeholder={t.skills_ph} />
            {role === "expert" && <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.ts, marginBottom: 8 }}>{t.your_domains} *</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{DOMAINS.map(d => { const c = DC[d] || C.acc; return <button key={d} onClick={() => toggleD(d)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${domains.includes(d) ? c : C.bd}`, background: domains.includes(d) ? c + "22" : "transparent", color: domains.includes(d) ? c : C.ts, cursor: "pointer", fontSize: 12 }}>{d}</button>; })}</div>
            </div>}
            <div style={{ display: "flex", gap: 10 }}><Btn v="ghost" onClick={() => setStep(1)}>{t.back}</Btn><Btn full onClick={submit} disabled={loading}>{loading ? t.creating : t.create_account_btn}</Btn></div>
          </div>}
        </Card>
      </div>
    </div>
  );
}

function Login({ go, setUser, toast, t }: any) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!email || !password) { setErr("Email and password required."); return; }
    setLoading(true); setErr("");
    const res = await api.login({ email, password });
    if (res.error) { setErr(res.error); setLoading(false); return; }
    setUser(res.user); toast("Welcome back, " + res.user.name.split(" ")[0] + "!", "success"); go("dashboard");
    setLoading(false);
  };
  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <button onClick={() => go("landing")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, fontWeight: 800, color: C.tp }}>Dev<span style={{ color: C.acc }}>ex</span></button>
          <div style={{ color: C.ts, fontSize: 14, marginTop: 6 }}>{t.signin_account}</div>
        </div>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {err && <div style={{ background: C.redBg, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13 }}>{err}</div>}
            <Field label={t.email} value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
            <Field label={t.password} value={password} onChange={setPassword} placeholder="Your password" type="password" />
            <Btn full onClick={submit} disabled={loading}>{loading ? t.signing_in : t.signin}</Btn>
            {/* Don't show register link - admin uses this page too */}
            <div style={{ textAlign: "center", fontSize: 13, color: C.ts }}>{t.no_account} <button onClick={() => go("register")} style={{ background: "none", border: "none", cursor: "pointer", color: C.acc, fontWeight: 600 }}>{t.create_one}</button></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Shell({ user, go, page, lang, setLang, t, setProfileOpen }: any) {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.tp }}>
      <nav style={{ borderBottom: `1px solid ${C.bd}`, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, background: C.bg + "ee", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => go("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, fontWeight: 800, color: C.tp }}>Dev<span style={{ color: C.acc }}>ex</span></button>
          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>{[["marketplace", t.marketplace], ["experts", t.experts], ["learners", t.talent]].map(([p, l]) => <button key={p} onClick={() => go(p)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: page === p ? C.accBg : "transparent", color: page === p ? C.acc : C.ts, fontSize: 13, fontWeight: page === p ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>{l}</button>)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLang(lang === "en" ? "az" : "en")} style={{ background: C.accBg, border: `1px solid ${C.acc}44`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: C.acc, fontSize: 12, fontWeight: 700 }}>{t.lang_toggle}</button>
          {user && <><NotifBell userId={user.id} />
            <button onClick={() => setProfileOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: `1px solid ${C.bd}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: C.ts, fontSize: 13 }}>
              <Avi name={user.name} size={24} avatarUrl={user.avatar_url} />{user.name.split(" ")[0]}
            </button>
          </>}
        </div>
      </nav>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 24px" }}>{page === "experts" || page === "learners" || page === "marketplace" || page.startsWith("assignment:") || page.startsWith("learner:") ? <div /> : null}</div>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 28px" }}>{/* content injected by parent */}</div>
    </div>
  );
}


// ─── SHELL (public nav wrapper) ───────────────────────────────────────────────
function Shell2({ user, go, page, lang, setLang, t, setProfileOpen, children }: any) {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.tp }}>
      <nav style={{ borderBottom: `1px solid ${C.bd}`, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, background: C.bg + "ee", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => go("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, fontWeight: 800, color: C.tp }}>Dev<span style={{ color: C.acc }}>ex</span></button>
          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            {[["marketplace", t.marketplace], ["experts", t.experts], ["learners", t.talent]].map(([p, l]) => (
              <button key={p} onClick={() => go(p)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: page === p ? C.accBg : "transparent", color: page === p ? C.acc : C.ts, fontSize: 13, fontWeight: page === p ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLang(lang === "en" ? "az" : "en")} style={{ background: C.accBg, border: `1px solid ${C.acc}44`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: C.acc, fontSize: 12, fontWeight: 700 }}>{t.lang_toggle}</button>
          {user && <>
            <NotifBell userId={user.id} />
            <button onClick={() => setProfileOpen && setProfileOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: `1px solid ${C.bd}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: C.ts, fontSize: 13 }}>
              <Avi name={user.name} size={24} avatarUrl={user.avatar_url} />{user.name.split(" ")[0]}
            </button>
          </>}
        </div>
      </nav>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 24px" }}>{children}</div>
    </div>
  );
}

// ─── MARKETPLACE ─────────────────────────────────────────────────────────────
function Marketplace({ go, user, data, handleBuy, t }: any) {
  const [search, setSearch] = useState(""); const [domain, setDomain] = useState(""); const [diff, setDiff] = useState(""); const [role, setRole] = useState("");
  const all = data.assignments.filter((a: any) => a.status === "published");
  const filtered = all.filter((a: any) => {
    const q = search.toLowerCase();
    if (q && !a.title?.toLowerCase().includes(q) && !a.domain?.toLowerCase().includes(q) && !(a.short_desc || "").toLowerCase().includes(q)) return false;
    if (domain && a.domain !== domain) return false;
    if (diff && a.difficulty !== diff) return false;
    if (role && a.role_type !== role) return false;
    return true;
  });
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: C.tp }}>{t.assignment_marketplace}</h1><p style={{ color: C.ts, margin: 0 }}>{t.marketplace_sub}</p></div>
      <div style={{ ...card0(), padding: "14px 18px", marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 180px 160px 180px", gap: 12, alignItems: "end" }}>
        <Field value={search} onChange={setSearch} placeholder={t.search_ph} />
        <Field value={domain} onChange={setDomain} options={[{ value: "", label: t.all_domains }, ...DOMAINS.map(d => ({ value: d, label: d }))]} />
        <Field value={diff} onChange={setDiff} options={[{ value: "", label: t.all_levels }, ...DIFFICULTIES.map(d => ({ value: d, label: d }))]} />
        <Field value={role} onChange={setRole} options={[{ value: "", label: t.all_roles }, ...ROLE_TYPES.slice(0, 6).map(r => ({ value: r, label: r }))]} />
      </div>
      <div style={{ fontSize: 13, color: C.tm, marginBottom: 16 }}>{filtered.length} {t.assignments_label?.toLowerCase() || "assignments"}</div>
      {filtered.length === 0
        ? <Empty icon="📋" title={all.length === 0 ? t.no_assignments : t.no_results} body={all.length === 0 ? t.no_assignments_body : undefined} action={(search || domain || diff || role) ? <Btn v="ghost" onClick={() => { setSearch(""); setDomain(""); setDiff(""); setRole(""); }}>{t.clear_filters}</Btn> : null} />
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 }}>
          {filtered.map((a: any) => {
            const exp = data.users.find((u: any) => u.id === a.expert_id);
            const diffColors: Record<string, string> = { Beginner: C.grn, Junior: "#06b6d4", Intermediate: C.amb, Advanced: C.red };
            const dc = diffColors[a.difficulty] || C.ts;
            return (
              <Card key={a.id} onClick={() => go("assignment:" + a.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}><DTag domain={a.domain} /><span style={{ fontWeight: 700, color: C.tp, fontSize: 16 }}>${a.price}</span></div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.tp, margin: "0 0 8px", lineHeight: 1.4, wordBreak: "break-word" }}>{a.title}</h3>
                <p style={{ fontSize: 13, color: C.ts, margin: "0 0 12px", lineHeight: 1.5, wordBreak: "break-word", overflowWrap: "anywhere" }}>{a.short_desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}><Tag color={dc}>{a.difficulty}</Tag><Tag color={C.tm}>~{a.hours}h</Tag><Tag color={C.tm}>{a.role_type}</Tag></div>
                {exp && <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: `1px solid ${C.bd}` }}>
                  <Avi name={exp.name} size={26} avatarUrl={exp.avatar_url} />
                  <div><div style={{ fontSize: 12, fontWeight: 600, color: C.tp }}>{exp.name}</div><div style={{ fontSize: 11, color: C.tm }}>{exp.title || "Expert"}</div></div>
                  {exp.verified_status === "verified" && <span style={{ marginLeft: "auto", fontSize: 10, color: C.grn, background: C.grnBg, padding: "2px 6px", borderRadius: 10, fontWeight: 600 }}>✓ Verified</span>}
                </div>}
                <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: C.tm }}><span>📚 {a.sales_count || 0} {t.enrolled}</span><span>🏅 {t.endorsable}</span></div>
              </Card>
            );
          })}
        </div>}
    </div>
  );
}

function AssignmentDetail({ id, go, user, toast, data, refresh, handleBuy, t }: any) {
  const a = data.assignments.find((x: any) => x.id === id);
  const exp = a ? data.users.find((u: any) => u.id === a.expert_id) : null;
  const [tab, setTab] = useState("overview");
  if (!a) return <Empty icon="🔍" title="Assignment not found" action={<Btn onClick={() => go("marketplace")}>{t.back_marketplace}</Btn>} />;
  const purchased = user && data.purchases.find((p: any) => p.learner_id === user.id && p.assignment_id === a.id);
  const diffColors2: Record<string, string> = { Beginner: C.grn, Junior: "#06b6d4", Intermediate: C.amb, Advanced: C.red };
  const dc = diffColors2[a.difficulty] || C.ts;
  return (
    <div>
      <button onClick={() => go("marketplace")} style={{ background: "none", border: "none", cursor: "pointer", color: C.ts, fontSize: 13, marginBottom: 20 }}>{t.back_marketplace}</button>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 28, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}><DTag domain={a.domain} /><Tag color={dc}>{a.difficulty}</Tag><Tag color={C.tm}>~{a.hours}h</Tag><Tag color={C.tm}>{a.role_type}</Tag></div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.tp, margin: "0 0 12px", lineHeight: 1.3, wordBreak: "break-word" }}>{a.title}</h1>
          <p style={{ color: C.ts, fontSize: 15, lineHeight: 1.6, margin: "0 0 24px", wordBreak: "break-word" }}>{a.short_desc}</p>
          <Tabs tabs={[{ id: "overview", label: t.overview }, { id: "requirements", label: t.requirements }, { id: "evaluation", label: t.rubric }, { id: "expert", label: t.expert_tab }]} active={tab} onChange={setTab} />
          {tab === "overview" && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card style={{ borderLeft: `3px solid ${C.acc}` }}><div style={{ fontSize: 11, fontWeight: 600, color: C.acc, letterSpacing: 1, marginBottom: 8 }}>{t.business_scenario}</div><p style={{ color: C.tp, fontSize: 15, lineHeight: 1.75, margin: 0, wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>{a.scenario}</p></Card>
            {a.skills?.length > 0 && <Card><div style={{ fontSize: 11, fontWeight: 600, color: C.ts, letterSpacing: 1, marginBottom: 10 }}>{t.skills_demo}</div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{a.skills.map((s: string) => <Tag key={s} color={C.acc}>{s}</Tag>)}</div></Card>}
          </div>}
          {tab === "requirements" && <Card>{!a.requirements?.length ? <div style={{ color: C.tm }}>No requirements listed.</div> : a.requirements.map((r: string, i: number) => <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < a.requirements.length - 1 ? `1px solid ${C.bd}` : "none" }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: C.accBg, color: C.acc, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div><span style={{ fontSize: 14, color: C.tp, lineHeight: 1.5, wordBreak: "break-word" }}>{r}</span></div>)}</Card>}
          {tab === "evaluation" && <Card><div style={{ fontSize: 11, fontWeight: 600, color: C.ts, letterSpacing: 1, marginBottom: 16 }}>SCORING RUBRIC</div>{!(a.evaluation_criteria?.length) ? <div style={{ color: C.tm }}>No rubric defined.</div> : (a.evaluation_criteria || []).map((ec: any) => <div key={ec.name} style={{ marginBottom: 16 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 14, fontWeight: 600, color: C.tp }}>{ec.name}</span><span style={{ fontSize: 13, color: C.acc, fontWeight: 600 }}>{ec.weight}%</span></div>{ec.description && <div style={{ fontSize: 12, color: C.ts, marginBottom: 6 }}>{ec.description}</div>}<div style={{ height: 4, background: C.bd, borderRadius: 2 }}><div style={{ height: "100%", width: ec.weight + "%", background: C.acc, borderRadius: 2 }} /></div></div>)}<div style={{ background: C.accBg, border: `1px solid ${C.acc}33`, borderRadius: 8, padding: 12, marginTop: 8, fontSize: 13, color: C.ts }}>{t.endorsement_note}</div></Card>}
          {tab === "expert" && exp && <Card>
            <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <Avi name={exp.name} size={56} avatarUrl={exp.avatar_url} />
              <div><div style={{ fontWeight: 700, fontSize: 17, color: C.tp }}>{exp.name}</div><div style={{ color: C.ts, fontSize: 13 }}>{exp.title}{exp.company ? ` · ${exp.company}` : ""}</div>{exp.years > 0 && <div style={{ color: C.tm, fontSize: 12, marginTop: 2 }}>{exp.years} {t.years_experience}</div>}</div>
            </div>
            {exp.bio && <p style={{ color: C.ts, fontSize: 14, lineHeight: 1.6, margin: "0 0 12px", wordBreak: "break-word" }}>{exp.bio}</p>}
            {exp.domains?.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>{exp.domains.map((d: string) => <DTag key={d} domain={d} />)}</div>}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {exp.github && <ExtLink href={`https://github.com/${exp.github}`}><Tag color={C.tm}>⌨ {exp.github}</Tag></ExtLink>}
              {exp.linkedin && <ExtLink href={exp.linkedin}><Tag color="#0a66c2">in {exp.linkedin.replace(/.*linkedin\.com\/in\//, "")}</Tag></ExtLink>}
              {exp.verified_status === "verified" && <Tag color={C.grn}>✓ {t.verified_expert}</Tag>}
            </div>
          </Card>}
        </div>
        <div style={{ position: "sticky", top: 80 }}>
          <Card style={{ border: `1px solid ${C.acc}44` }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}><div style={{ fontSize: 38, fontWeight: 800, color: C.tp }}>${a.price}</div><div style={{ color: C.tm, fontSize: 13 }}>{t.one_time}</div></div>
            {purchased
              ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={{ background: C.grnBg, border: `1px solid ${C.grn}44`, borderRadius: 8, padding: 12, textAlign: "center", fontSize: 13, color: C.grn, fontWeight: 600 }}>{t.you_own}</div><Btn full v="success" onClick={() => go("workspace:" + a.id)}>{t.enter_workspace}</Btn></div>
              : <Btn full onClick={() => handleBuy(a)}>{t.pay_btn} — ${a.price}</Btn>}
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {[t.full_access, t.req_checklist, t.expert_reviews, t.endorsement_75, t.revision_supported].map(f => <div key={f} style={{ fontSize: 12, color: C.ts, display: "flex", gap: 8 }}><span style={{ color: C.grn }}>✓</span>{f}</div>)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ExpertsPage({ data, t }: any) {
  const experts = data.users.filter((u: any) => u.role === "expert");
  return <div>
    <div style={{ marginBottom: 24 }}><h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: C.tp }}>{t.experts}</h1></div>
    {experts.length === 0 ? <Empty icon="🎓" title={t.no_experts} /> : <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 20 }}>
      {experts.map((e: any) => {
        const theirA = data.assignments.filter((a: any) => a.expert_id === e.id && a.status === "published");
        const given = data.endorsements.filter((en: any) => en.expert_id === e.id).length;
        return <Card key={e.id}>
          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <Avi name={e.name} size={56} avatarUrl={e.avatar_url} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><div style={{ fontWeight: 700, fontSize: 17, color: C.tp }}>{e.name}</div>{e.verified_status === "verified" && <Tag color={C.grn}>✓ {t.verified}</Tag>}</div>
              <div style={{ color: C.ts, fontSize: 13 }}>{e.title}{e.company ? ` · ${e.company}` : ""}</div>
              {e.years > 0 && <div style={{ color: C.tm, fontSize: 12, marginTop: 2 }}>{e.years} {t.years_experience}</div>}
            </div>
          </div>
          {e.bio && <p style={{ color: C.ts, fontSize: 13, lineHeight: 1.6, margin: "0 0 12px", wordBreak: "break-word" }}>{e.bio}</p>}
          {e.domains?.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>{e.domains.map((d: string) => <DTag key={d} domain={d} />)}</div>}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {e.github && <ExtLink href={`https://github.com/${e.github}`}><Tag color={C.tm}>⌨ GitHub</Tag></ExtLink>}
            {e.linkedin && <ExtLink href={e.linkedin}><Tag color="#0a66c2">in LinkedIn</Tag></ExtLink>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, paddingTop: 12, borderTop: `1px solid ${C.bd}` }}>
            {[["Assignments", theirA.length], ["Endorsements", given], [t.years_experience, e.years || "—"]].map(([l, v]: any) => <div key={l} style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 700, color: C.acc }}>{v}</div><div style={{ fontSize: 11, color: C.tm }}>{l}</div></div>)}
          </div>
        </Card>;
      })}
    </div>}
  </div>;
}

function LearnersPage({ go, data, t }: any) {
  const [search, setSearch] = useState("");
  const learners = data.users.filter((u: any) => u.role === "learner").filter((l: any) => !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.skills?.some((s: string) => s.toLowerCase().includes(search.toLowerCase())));
  return <div>
    <div style={{ marginBottom: 24 }}><h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: C.tp }}>{t.talent_discovery}</h1><p style={{ color: C.ts, margin: 0 }}>{t.talent_sub}</p></div>
    <div style={{ marginBottom: 20, maxWidth: 400 }}><Field value={search} onChange={setSearch} placeholder={t.search_ph} /></div>
    {learners.length === 0 ? <Empty icon="👨‍💻" title={t.no_candidates} body={t.candidates_appear} />
      : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 }}>
        {learners.map((l: any) => {
          const endr = data.endorsements.filter((e: any) => e.learner_id === l.id);
          return <Card key={l.id} onClick={() => go("learner:" + l.id)}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}><Avi name={l.name} size={44} avatarUrl={l.avatar_url} /><div><div style={{ fontWeight: 700, color: C.tp }}>{l.name}</div><div style={{ fontSize: 12, color: C.ts }}>{l.skills?.slice(0, 2).join(", ") || "—"}</div></div></div>
            {endr.length > 0 && <div style={{ marginBottom: 8 }}><Tag color={C.grn}>🏅 {endr.length} {t.endorsed?.toLowerCase() || "endorsed"}</Tag></div>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, paddingTop: 10, borderTop: `1px solid ${C.bd}` }}>
              {[["Done", data.submissions.filter((s: any) => s.learner_id === l.id && s.status === "endorsed").length], [t.endorsed, endr.length], [t.avg_score, endr.length ? Math.round(endr.reduce((s: number, e: any) => s + e.score, 0) / endr.length) : "—"]].map(([l2, v]: any) => <div key={l2} style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: C.acc }}>{v}</div><div style={{ fontSize: 11, color: C.tm }}>{l2}</div></div>)}
            </div>
          </Card>;
        })}
      </div>}
  </div>;
}

function LearnerProfile({ id, go, data, t }: any) {
  const learner = data.users.find((u: any) => u.id === id);
  const endr = learner ? data.endorsements.filter((e: any) => e.learner_id === learner.id) : [];
  const subs = learner ? data.submissions.filter((s: any) => s.learner_id === learner.id) : [];
  const [tab, setTab] = useState("portfolio");
  if (!learner) return <Empty icon="🔍" title="Profile not found" action={<Btn onClick={() => go("learners")}>Browse talent</Btn>} />;
  const avg = endr.length ? Math.round(endr.reduce((s: number, e: any) => s + e.score, 0) / endr.length) : null;
  return <div style={{ maxWidth: 820, margin: "0 auto" }}>
    <button onClick={() => go("learners")} style={{ background: "none", border: "none", cursor: "pointer", color: C.ts, fontSize: 13, marginBottom: 20 }}>← {t.browse_talent}</button>
    <Card style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
        <Avi name={learner.name} size={72} avatarUrl={learner.avatar_url} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.tp }}>{learner.name}</h1>{endr.length > 0 && <Tag color={C.grn}>🏅 {endr.length} {t.endorsed?.toLowerCase()}</Tag>}</div>
          {learner.bio && <p style={{ color: C.ts, fontSize: 14, margin: "8px 0 0", lineHeight: 1.6, wordBreak: "break-word" }}>{learner.bio}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {learner.skills?.map((s: string) => <Tag key={s} color={C.acc}>{s}</Tag>)}
            {learner.github && <ExtLink href={`https://github.com/${learner.github}`}><Tag color={C.tm}>⌨ {learner.github}</Tag></ExtLink>}
            {learner.linkedin && <ExtLink href={learner.linkedin}><Tag color="#0a66c2">in LinkedIn</Tag></ExtLink>}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 16, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.bd}` }}>
        {[[t.submissions, subs.length, C.acc], [t.endorsed, endr.length, C.grn], [t.avg_score, avg ?? "—", C.amb], ["Status", "Active", C.ts]].map(([l, v, c]: any) => <div key={l} style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div><div style={{ fontSize: 12, color: C.tm }}>{l}</div></div>)}
      </div>
    </Card>
    <Tabs tabs={[{ id: "portfolio", label: "Portfolio" }, { id: "submissions", label: t.submissions }]} active={tab} onChange={setTab} />
    {tab === "portfolio" && (endr.length === 0 ? <Empty icon="🏅" title={t.no_endorsements} /> : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {endr.map((e: any) => { const expert = data.users.find((u: any) => u.id === e.expert_id); const assignment = data.assignments.find((a: any) => a.id === e.assignment_id); return <Card key={e.id} style={{ borderLeft: `3px solid ${C.grn}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><div><div style={{ fontSize: 11, fontWeight: 600, color: C.grn, letterSpacing: 1, marginBottom: 4 }}>EXPERT ENDORSEMENT</div><div style={{ fontWeight: 700, fontSize: 16, color: C.tp, wordBreak: "break-word" }}>{assignment?.title}</div>{assignment && <div style={{ marginTop: 4 }}><DTag domain={assignment.domain} /></div>}</div><Score v={e.score} /></div>
        {e.text && <p style={{ color: C.ts, fontSize: 14, lineHeight: 1.7, margin: "0 0 14px", fontStyle: "italic", wordBreak: "break-word" }}>&quot;{e.text}&quot;</p>}
        {expert && <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: `1px solid ${C.bd}` }}>
          <Avi name={expert.name} size={34} avatarUrl={expert.avatar_url} />
          <div><div style={{ fontSize: 13, fontWeight: 700, color: C.tp }}>{expert.name}</div><div style={{ fontSize: 12, color: C.tm }}>{expert.title}</div></div>
          {expert.verified_status === "verified" && <Tag color={C.grn}>✓ {t.verified}</Tag>}
          <div style={{ marginLeft: "auto", fontSize: 12, color: C.tm }}>{new Date(e.created_at).toLocaleDateString()}</div>
        </div>}
      </Card>; })}
    </div>)}
    {tab === "submissions" && (subs.length === 0 ? <Empty icon="📤" title={t.no_submissions} /> : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {subs.map((s: any) => { const a = data.assignments.find((x: any) => x.id === s.assignment_id); const sc: any = { pending_review: C.amb, endorsed: C.grn, rejected: C.red, revision_requested: "#f97316" }; return <Card key={s.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><div style={{ fontWeight: 600, color: C.tp, wordBreak: "break-word" }}>{a?.title}</div><div style={{ fontSize: 12, color: C.tm, marginTop: 3 }}>{new Date(s.submitted_at).toLocaleDateString()}</div>{s.github_repo_url && <ExtLink href={s.github_repo_url} style={{ fontSize: 12, marginTop: 3, display: "block" }}>{s.github_repo_url}</ExtLink>}</div><Tag color={sc[s.status] || C.ts}>{s.status.replace(/_/g, " ")}</Tag></div></Card>; })}
    </div>)}
  </div>;
}


// ─── WORKSPACE ────────────────────────────────────────────────────────────────
function Workspace({ assignmentId, user, go, toast, data, refresh, t }: any) {
  const a = data.assignments.find((x: any) => x.id === assignmentId);
  const purchase = a && user ? data.purchases.find((p: any) => p.learner_id === user.id && p.assignment_id === a.id) : null;
  const [state, setState] = useState("not_started"); const [elapsed, setElapsed] = useState(0); const [tabs, setTabs] = useState(0); const [pauses, setPauses] = useState(0);
  const [camera, setCamera] = useState<any>(false); const [check, setCheck] = useState<any>({}); const [notes, setNotes] = useState("");
  const [activeF, setActiveF] = useState("solution.js"); const [files, setFiles] = useState<any>({ "solution.js": "", "README.md": "" });
  const [repoUrl, setRepoUrl] = useState(""); const [demoUrl, setDemoUrl] = useState(""); const [expl, setExpl] = useState("");
  const [step, setStep] = useState(0); const [sessId, setSessId] = useState<string | null>(null); const [submitting, setSubmitting] = useState(false);
  const timer = useRef<any>(null);
  useEffect(() => { const h = () => { if (state === "running") setTabs(t2 => t2 + 1); }; window.addEventListener("blur", h); return () => window.removeEventListener("blur", h); }, [state]);
  useEffect(() => { if (state === "running") { timer.current = setInterval(() => setElapsed(e => e + 1), 1000); } else clearInterval(timer.current); return () => clearInterval(timer.current); }, [state]);
  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const sus = Math.min(100, tabs * 12 + pauses * 4);
  const startSess = async () => {
    if (!sessId) {
      const res = await api.createSession({ assignment_id: a.id, purchase_id: purchase?.id, status: "in_progress", total_active_time: 0, tab_switch_count: 0, pause_count: 0, camera_enabled: false });
      if (res.error) { toast("Session error: " + res.error, "error"); return; }
      setSessId(res.id);
    }
    setState("running");
  };
  const pauseSess = async () => { setState("paused"); setPauses((p: number) => p + 1); if (sessId) await api.updateSession({ id: sessId, status: "paused", total_active_time: elapsed, pause_count: pauses + 1 }); };
  const submitWork = async () => {
    if (!repoUrl.trim()) { toast(t.github_url + " required.", "error"); return; }
    setSubmitting(true);
    if (sessId) await api.updateSession({ id: sessId, status: "submitted", total_active_time: elapsed, tab_switch_count: tabs, pause_count: pauses, camera_enabled: camera, ended_at: new Date().toISOString() });
    const res = await api.createSubmission({ assignment_id: a.id, expert_id: a.expert_id, purchase_id: purchase?.id, session_id: sessId, github_repo_url: repoUrl.trim(), live_demo_url: demoUrl.trim(), written_explanation: expl.trim(), assignment_title: a.title });
    if (res.error) { toast("Submit failed: " + res.error, "error"); setSubmitting(false); return; }
    await refresh(); toast(t.submitted_title, "success"); setStep(99);
    setSubmitting(false);
  };
  if (!a) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.tp, flexDirection: "column", gap: 16 }}>Assignment not found.<Btn onClick={() => go("marketplace")}>Back</Btn></div>;
  if (!purchase) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.tp, flexDirection: "column", gap: 16 }}><div>You haven&apos;t purchased this assignment.</div><Btn onClick={() => go("assignment:" + assignmentId)}>View assignment</Btn></div>;
  if (step === 99) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: C.tp, padding: 24 }}>
    <div style={{ fontSize: 56 }}>🎉</div><h2 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{t.submitted_title}</h2>
    <p style={{ color: C.ts, textAlign: "center", maxWidth: 440, margin: 0, lineHeight: 1.6 }}>{t.submitted_body}</p>
    <Btn onClick={() => go("dashboard")}>{t.go_dashboard}</Btn>
  </div>;
  return (
    <div style={{ background: C.bg, height: "100vh", display: "flex", flexDirection: "column", color: C.tp, overflow: "hidden" }}>
      <div style={{ background: "#060b16", borderBottom: `1px solid ${C.bd}`, padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => go("assignment:" + assignmentId)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 800, color: C.tp }}>Dev<span style={{ color: C.acc }}>ex</span></button>
          <span style={{ color: C.bd }}>|</span><span style={{ fontSize: 13, color: C.ts, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span><DTag domain={a.domain} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
          <span style={{ color: C.tm }}>⏱ {fmt(elapsed)}</span>
          <span style={{ color: tabs > 3 ? C.red : C.tm }}>⇄ {tabs}</span>
          <span style={{ color: sus < 20 ? C.grn : sus < 60 ? C.amb : C.red }}>{sus < 20 ? t.good : sus < 60 ? t.medium : t.concern}</span>
          {state === "not_started" && <Btn v="success" sz="sm" onClick={startSess}>{t.start_session}</Btn>}
          {state === "running" && <><Btn v="ghost" sz="sm" onClick={pauseSess}>{t.pause}</Btn>{step === 0 && <Btn sz="sm" onClick={() => setStep(1)}>{t.submit_work}</Btn>}</>}
          {state === "paused" && <Btn v="success" sz="sm" onClick={() => setState("running")}>{t.resume}</Btn>}
        </div>
      </div>
      {state === "running" && camera === false && <div style={{ background: "#0a1020", borderBottom: `1px solid ${C.bd}`, padding: "6px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: C.tm }}>📷 Enable camera to show integrity to reviewer (optional)</span>
        <div style={{ display: "flex", gap: 8 }}><Btn sz="sm" v="outline" onClick={() => setCamera(true)}>Enable</Btn><button onClick={() => setCamera(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.tm, fontSize: 12 }}>✕</button></div>
      </div>}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "230px 1fr 260px", overflow: "hidden" }}>
        <div style={{ background: "#060b16", borderRight: `1px solid ${C.bd}`, overflow: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
          <div><div style={{ fontSize: 11, fontWeight: 600, color: C.tm, letterSpacing: 1, marginBottom: 8 }}>{t.requirements?.toUpperCase()}</div>
            {!a.requirements?.length ? <div style={{ fontSize: 12, color: C.tm }}>None defined.</div> : a.requirements.map((r: string, i: number) => <label key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", marginBottom: 8 }}><input type="checkbox" checked={!!check[i]} onChange={() => setCheck((c: any) => ({ ...c, [i]: !c[i] }))} style={{ marginTop: 2, flexShrink: 0 }} /><span style={{ fontSize: 12, color: check[i] ? C.tm : C.ts, lineHeight: 1.4, textDecoration: check[i] ? "line-through" : "none" }}>{r}</span></label>)}
            {a.requirements?.length > 0 && <div style={{ fontSize: 11, color: C.tm, marginTop: 4 }}>{Object.values(check).filter(Boolean).length}/{a.requirements.length}</div>}
          </div>
          <div><div style={{ fontSize: 11, fontWeight: 600, color: C.tm, letterSpacing: 1, marginBottom: 8 }}>FILES</div>
            {Object.keys(files).map((f: string) => <button key={f} onClick={() => setActiveF(f)} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", background: activeF === f ? C.accBg : "transparent", color: activeF === f ? C.acc : C.ts, fontSize: 12, marginBottom: 2, fontFamily: "monospace" }}>{f}</button>)}
            <button onClick={() => { const fn = window.prompt("File name:"); if (fn?.trim()) { setFiles((f: any) => ({ ...f, [fn.trim()]: "" })); setActiveF(fn.trim()); } }} style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 8px", borderRadius: 6, border: "none", cursor: "pointer", background: "transparent", color: C.tm, fontSize: 12 }}>+ Add file</button>
          </div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: C.tm, letterSpacing: 1, marginBottom: 8 }}>NOTES</div>
            <textarea value={notes} onChange={(e: any) => setNotes(e.target.value)} placeholder="Planning notes..." style={{ width: "100%", minHeight: 80, background: "#0a0f1e", border: `1px solid ${C.bd}`, borderRadius: 6, color: C.ts, fontSize: 12, padding: 8, resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ background: "#060b16", padding: "6px 12px", borderBottom: `1px solid ${C.bd}`, display: "flex", gap: 6, flexShrink: 0 }}>
            {Object.keys(files).map((f: string) => <button key={f} onClick={() => setActiveF(f)} style={{ padding: "3px 10px", borderRadius: 5, border: "none", cursor: "pointer", background: activeF === f ? C.accBg : "transparent", color: activeF === f ? C.acc : C.tm, fontSize: 12, fontFamily: "monospace" }}>{f}</button>)}
          </div>
          <textarea value={files[activeF] || ""} onChange={(e: any) => setFiles((f: any) => ({ ...f, [activeF]: e.target.value }))} disabled={state !== "running"}
            placeholder={state === "not_started" ? "Click 'Start session' to begin..." : state === "paused" ? "Paused — Resume to continue." : "// Write your solution here..."}
            style={{ flex: 1, background: "#0d1117", color: "#e6edf3", fontFamily: "'Fira Code','Courier New',monospace", fontSize: 13, padding: "16px 20px", border: "none", outline: "none", resize: "none", lineHeight: 1.75, opacity: state === "running" ? 1 : 0.5 }} />
          <div style={{ background: "#060b16", padding: "4px 14px", borderTop: `1px solid ${C.bd}`, fontSize: 11, color: C.tm, display: "flex", gap: 16, flexShrink: 0 }}>
            <span>{activeF.endsWith(".md") ? "Markdown" : activeF.endsWith(".py") ? "Python" : activeF.endsWith(".ts") ? "TypeScript" : "JavaScript"}</span>
            <span style={{ marginLeft: "auto" }}>{state === "running" ? t.active : state === "paused" ? t.paused : t.not_started}</span>
          </div>
        </div>
        <div style={{ background: C.card, borderLeft: `1px solid ${C.bd}`, overflow: "auto", padding: 16 }}>
          {step === 0 && <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.tm, marginBottom: 12 }}>{t.session_status}</div>
            {[[t.integrity, sus < 20 ? t.good : sus < 60 ? t.medium : t.concern], [t.active_time, fmt(elapsed)], [t.tab_switches, String(tabs)], [t.pauses_label, String(pauses)], [t.camera, camera === true ? "✅ On" : "Off"]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.bd}`, fontSize: 13 }}><span style={{ color: C.tm }}>{l}</span><span style={{ color: C.tp, fontWeight: 500 }}>{v}</span></div>)}
            {a.requirements?.length > 0 && <div style={{ marginTop: 12 }}><div style={{ height: 4, background: C.bd, borderRadius: 2, marginBottom: 6 }}><div style={{ height: "100%", width: ((Object.values(check).filter(Boolean).length / a.requirements.length) * 100) + "%", background: C.grn, borderRadius: 2, transition: "width 0.3s" }} /></div><div style={{ fontSize: 12, color: C.tm }}>{Object.values(check).filter(Boolean).length}/{a.requirements.length} {t.requirements?.toLowerCase()}</div></div>}
            {state === "running" && <Btn full onClick={() => setStep(1)} style={{ marginTop: 16 }}>{t.submit_work}</Btn>}
            {state === "not_started" && <Btn full v="success" onClick={startSess} style={{ marginTop: 16 }}>{t.start_session}</Btn>}
          </div>}
          {step === 1 && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.tp, marginBottom: 4 }}>{t.link_work}</div>
            <Field label={t.github_url} value={repoUrl} onChange={setRepoUrl} placeholder="https://github.com/you/project" />
            <Field label={t.live_demo} value={demoUrl} onChange={setDemoUrl} placeholder="https://demo.com" />
            <Field label={t.explanation} value={expl} onChange={setExpl} placeholder={t.expl_ph} textarea rows={5} />
            <Btn full onClick={() => { if (!repoUrl.trim()) { toast(t.github_url + " required.", "error"); return; } setStep(2); }}>{t.review_sub}</Btn>
            <button onClick={() => setStep(0)} style={{ background: "none", border: "none", cursor: "pointer", color: C.tm, fontSize: 12, textAlign: "center" }}>← Back</button>
          </div>}
          {step === 2 && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.tp, marginBottom: 4 }}>{t.confirm_sub}</div>
            <div style={{ ...card0(), padding: 14, fontSize: 13, display: "flex", flexDirection: "column", gap: 8 }}>
              <div><div style={{ color: C.tm, fontSize: 11, marginBottom: 2 }}>GitHub</div><div style={{ color: C.tp, wordBreak: "break-all" }}>{repoUrl}</div></div>
              <div><div style={{ color: C.tm, fontSize: 11, marginBottom: 2 }}>{t.active_time}</div><div style={{ color: C.tp }}>{fmt(elapsed)}</div></div>
            </div>
            <Btn full v="success" onClick={submitWork} disabled={submitting}>{submitting ? t.submitting : t.submit_review}</Btn>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: C.tm, fontSize: 12, textAlign: "center" }}>← Back</button>
          </div>}
        </div>
      </div>
    </div>
  );
}


// ─── CREATE ASSIGNMENT ────────────────────────────────────────────────────────
function CreateAssignment({ user, go, toast, refresh, t }: any) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(""); const [domain, setDomain] = useState(DOMAINS[0]); const [roleType, setRoleType] = useState(ROLE_TYPES[0]); const [diff, setDiff] = useState(DIFFICULTIES[0]);
  const [price, setPrice] = useState(""); const [hours, setHours] = useState(""); const [shortDesc, setShortDesc] = useState(""); const [scenario, setScenario] = useState("");
  const [reqText, setReqText] = useState(""); const [skillsText, setSkillsText] = useState("");
  const [criteria, setCriteria] = useState([{ name: "Code quality", weight: 25, description: "Clean, maintainable code" }, { name: "Architecture", weight: 25, description: "Design patterns, scalability" }, { name: "Domain understanding", weight: 25, description: "Business logic, real-world thinking" }, { name: "Documentation", weight: 25, description: "README, setup, explanation quality" }]);
  const [err, setErr] = useState(""); const [publishing, setPublishing] = useState(false);
  const totalW = criteria.reduce((s: number, c: any) => s + Number(c.weight), 0);
  const publish = async () => {
    if (!title.trim() || !shortDesc.trim() || !scenario.trim() || !price || !hours) { setErr("Please fill all required fields."); return; }
    if (totalW !== 100) { setErr(`Weights must sum to 100 (currently ${totalW}).`); return; }
    if (user.verified_status !== "verified") { setErr("Your account must be verified by admin before publishing."); return; }
    setPublishing(true);
    const res = await api.createAssignment({ title: title.trim(), domain, role_type: roleType, difficulty: diff, price: parseFloat(price), hours: parseInt(hours), short_desc: shortDesc.trim(), scenario: scenario.trim(), requirements: reqText.split("\n").map((s: string) => s.trim()).filter(Boolean), skills: skillsText.split(",").map((s: string) => s.trim()).filter(Boolean), evaluation_criteria: criteria.map(c => ({ ...c, weight: Number(c.weight) })), status: "published", sales_count: 0 });
    if (res.error) { setErr("Error: " + res.error); setPublishing(false); return; }
    await refresh(); toast("Assignment published!", "success"); go("dashboard");
    setPublishing(false);
  };
  const STEPS = ["Basic info", "Scenario", "Requirements", "Evaluation", "Review"];
  if (user.verified_status !== "verified") {
    return <div style={{ maxWidth: 600, margin: "0 auto" }}><Card style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
      <h2 style={{ color: C.tp, margin: "0 0 12px" }}>{t.pending_verification}</h2>
      <p style={{ color: C.ts, lineHeight: 1.6 }}>An admin needs to verify your expert account before you can publish assignments. Please contact the platform admin.</p>
      <div style={{ marginTop: 24 }}><Btn onClick={() => go("dashboard")}>← Back to dashboard</Btn></div>
    </Card></div>;
  }
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div><h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: C.tp }}>{t.create_assignment}</h1><div style={{ color: C.ts, fontSize: 13 }}>Step {step} of {STEPS.length}: {STEPS[step - 1]}</div></div>
        <div style={{ display: "flex", gap: 5 }}>{STEPS.map((_, i) => <div key={i} style={{ width: 28, height: 3, borderRadius: 2, background: i < step ? C.acc : C.bd }} />)}</div>
      </div>
      <Card>
        {err && <div style={{ background: C.redBg, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13, marginBottom: 16 }}>{err}</div>}
        {step === 1 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Assignment title *" value={title} onChange={setTitle} placeholder="e.g. Build a Transaction Monitoring API for a Digital Bank" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}><Field label="Domain" value={domain} onChange={setDomain} options={DOMAINS} /><Field label="Role type" value={roleType} onChange={setRoleType} options={ROLE_TYPES} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}><Field label="Difficulty" value={diff} onChange={setDiff} options={DIFFICULTIES} /><Field label="Price (USD) *" value={price} onChange={setPrice} placeholder="79" type="number" /><Field label="Est. hours *" value={hours} onChange={setHours} placeholder="12" type="number" /></div>
          <Field label="Short description *" value={shortDesc} onChange={setShortDesc} placeholder="1–2 sentences shown on the marketplace card" textarea rows={2} />
          <Field label="Skills (comma-separated)" value={skillsText} onChange={setSkillsText} placeholder="e.g. Node.js, PostgreSQL, JWT" />
        </div>}
        {step === 2 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.accBg, border: `1px solid ${C.acc}33`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.ts }}><strong style={{ color: C.tp }}>This is the most important part.</strong> Write a realistic company scenario.</div>
          <Field label="Business scenario *" value={scenario} onChange={setScenario} placeholder={"e.g. You're joining a digital bank as a backend engineer..."} textarea rows={9} />
        </div>}
        {step === 3 && <Field label="Technical requirements (one per line)" value={reqText} onChange={setReqText} placeholder={"User account and transaction records\nSuspicious transaction detection\nAudit log\nRole-based access control\nAPI documentation"} textarea rows={10} hint="Each line becomes a checkbox in the learner's workspace" />}
        {step === 4 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 14, color: C.ts }}>Define how submissions are scored. Weights must total exactly 100.</div>
          {criteria.map((ec: any, i: number) => <Card key={i} style={{ padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 12, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><Field label="Criterion" value={ec.name} onChange={(v: string) => setCriteria((p: any[]) => p.map((x, j) => j === i ? { ...x, name: v } : x))} /><Field label="Description" value={ec.description} onChange={(v: string) => setCriteria((p: any[]) => p.map((x, j) => j === i ? { ...x, description: v } : x))} /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                <label style={{ fontSize: 12, color: C.tm }}>Weight %</label>
                <input type="number" min={0} max={100} value={ec.weight} onChange={(e: any) => setCriteria((p: any[]) => p.map((x, j) => j === i ? { ...x, weight: e.target.value } : x))} style={{ width: 64, padding: "8px", background: "#080d18", border: `1px solid ${C.bd}`, borderRadius: 8, color: C.tp, fontSize: 14, textAlign: "center", outline: "none" }} />
                <button onClick={() => setCriteria((p: any[]) => p.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 20, lineHeight: 1 }}>×</button>
              </div>
            </div>
          </Card>)}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Btn v="ghost" sz="sm" onClick={() => setCriteria((p: any[]) => [...p, { name: "", weight: 0, description: "" }])}>+ Add criterion</Btn>
            <span style={{ fontSize: 13, color: totalW === 100 ? C.grn : C.red, fontWeight: 600 }}>Total: {totalW}% {totalW === 100 ? "✓" : "(must be 100)"}</span>
          </div>
        </div>}
        {step === 5 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.tp }}>Review before publishing</div>
          <Card style={{ padding: 16 }}>{[["Title", title || "—"], ["Domain", domain], ["Role", roleType], ["Difficulty", diff], ["Price", "$" + price], ["Hours", "~" + hours + "h"]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.bd}`, fontSize: 13 }}><span style={{ color: C.tm }}>{l}</span><span style={{ color: C.tp, fontWeight: 500 }}>{v}</span></div>)}</Card>
        </div>}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.bd}` }}>
          {step > 1 ? <Btn v="ghost" onClick={() => { setErr(""); setStep(s => s - 1); }}>← Back</Btn> : <button onClick={() => go("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", color: C.tm, fontSize: 14 }}>Cancel</button>}
          {step < STEPS.length ? <Btn onClick={() => { setErr(""); setStep(s => s + 1); }}>Continue →</Btn> : <Btn v="success" onClick={publish} disabled={publishing}>{publishing ? "Publishing..." : "Publish ✓"}</Btn>}
        </div>
      </Card>
    </div>
  );
}

// ─── LEARNER DASHBOARD ────────────────────────────────────────────────────────
function LearnerDash({ user, go, data, t }: any) {
  const purchases = data.purchases.filter((p: any) => p.learner_id === user.id);
  const subs = data.submissions.filter((s: any) => s.learner_id === user.id);
  const endr = data.endorsements.filter((e: any) => e.learner_id === user.id);
  const [tab, setTab] = useState("overview");
  const sc: any = { pending_review: C.amb, endorsed: C.grn, rejected: C.red, revision_requested: "#f97316" };
  return <div>
    <Tabs tabs={[{ id: "overview", label: t.overview }, { id: "purchases", label: t.my_assignments }, { id: "submissions", label: t.submissions }, { id: "endorsements", label: t.endorsements }]} active={tab} onChange={setTab} />
    {tab === "overview" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg,#0f1a30,#1a2d50)", borderRadius: 14, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ color: C.tm, fontSize: 13, marginBottom: 4 }}>{t.welcome_back}</div><h2 style={{ color: C.tp, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{user.name}</h2><div style={{ color: C.ts, fontSize: 13 }}>{user.bio || "Add a bio to complete your profile"}</div></div>
        <Btn onClick={() => go("marketplace")}>{t.browse}</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>
        {[[t.purchased, purchases.length, C.acc], [t.submitted, subs.length, C.amb], [t.endorsed, endr.length, C.grn], [t.avg_score, endr.length ? Math.round(endr.reduce((s: number, e: any) => s + e.score, 0) / endr.length) : "—", "#f97316"]].map(([l, v, c]: any) => <Card key={l}><div style={{ fontSize: 28, fontWeight: 800, color: c, marginBottom: 4 }}>{v}</div><div style={{ fontSize: 12, color: C.tm }}>{l}</div></Card>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.tp }}>{t.my_assignments}</div>
          {purchases.length > 3 && <button onClick={() => setTab("purchases")} style={{ background: "none", border: "none", cursor: "pointer", color: C.acc, fontSize: 13 }}>{t.view_all}</button>}
        </div>
        {purchases.length === 0
          ? <div style={{ ...card0(), padding: 24, textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 10 }}>📋</div><div style={{ color: C.ts, fontSize: 14, marginBottom: 14 }}>{t.no_purchases}</div><Btn sz="sm" onClick={() => go("marketplace")}>{t.browse_marketplace}</Btn></div>
          : purchases.slice(0, 3).map((p: any) => { const a = data.assignments.find((x: any) => x.id === p.assignment_id); const sub = subs.find((s: any) => s.assignment_id === p.assignment_id); if (!a) return null; return <div key={p.id} style={{ ...card0(), padding: "14px 18px" }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><DTag domain={a.domain} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, color: C.tp, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div><div style={{ fontSize: 12, color: C.tm, marginTop: 2 }}>📅 {new Date(p.purchased_at).toLocaleDateString()}</div></div>{sub ? <Tag color={sc[sub.status] || C.ts}>{sub.status.replace(/_/g, " ")}</Tag> : <Btn sz="sm" onClick={() => go("workspace:" + a.id)}>{t.continue_btn}</Btn>}</div></div>; })}
      </div>
    </div>}
    {tab === "purchases" && (purchases.length === 0 ? <Empty icon="🛒" title={t.no_purchases} action={<Btn onClick={() => go("marketplace")}>{t.browse_marketplace}</Btn>} />
      : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{purchases.map((p: any) => { const a = data.assignments.find((x: any) => x.id === p.assignment_id); const sub = subs.find((s: any) => s.assignment_id === p.assignment_id); if (!a) return null; return <Card key={p.id}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><DTag domain={a.domain} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, color: C.tp }}>{a.title}</div><div style={{ fontSize: 12, color: C.tm, marginTop: 3 }}>{new Date(p.purchased_at).toLocaleDateString()} · ${p.amount_paid}</div></div>{sub ? <Tag color={sc[sub.status] || C.ts}>{sub.status.replace(/_/g, " ")}</Tag> : <Btn sz="sm" onClick={() => go("workspace:" + a.id)}>{t.enter_workspace_btn}</Btn>}</div></Card>; })}</div>)}
    {tab === "submissions" && (subs.length === 0 ? <Empty icon="📤" title={t.no_submissions} /> : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{subs.map((s: any) => { const a = data.assignments.find((x: any) => x.id === s.assignment_id); const review = data.reviews.find((r: any) => r.submission_id === s.id); return <Card key={s.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, color: C.tp }}>{a?.title}</div><div style={{ fontSize: 12, color: C.tm, marginTop: 4 }}>{new Date(s.submitted_at).toLocaleDateString()}</div>{s.github_repo_url && <ExtLink href={s.github_repo_url} style={{ fontSize: 12, marginTop: 3, display: "block" }}>{s.github_repo_url}</ExtLink>}{review && <div style={{ marginTop: 12, padding: "12px 14px", background: "#080d18", borderRadius: 8 }}><div style={{ fontSize: 11, color: C.tm, marginBottom: 6 }}>{t.expert_feedback}</div><div style={{ fontSize: 13, color: C.ts, lineHeight: 1.6 }}>{review.feedback}</div>{review.overall_score != null && <div style={{ marginTop: 8 }}><Score v={review.overall_score} /></div>}</div>}</div><Tag color={sc[s.status] || C.ts}>{s.status.replace(/_/g, " ")}</Tag></div></Card>; })}</div>)}
    {tab === "endorsements" && (endr.length === 0 ? <Empty icon="🏅" title={t.no_endorsements} /> : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{endr.map((e: any) => { const expert = data.users.find((u: any) => u.id === e.expert_id); const a = data.assignments.find((x: any) => x.id === e.assignment_id); return <Card key={e.id} style={{ borderLeft: `3px solid ${C.grn}` }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div><div style={{ fontSize: 11, color: C.grn, fontWeight: 600, marginBottom: 4 }}>ENDORSEMENT</div><div style={{ fontWeight: 700, color: C.tp }}>{a?.title}</div>{a && <div style={{ marginTop: 4 }}><DTag domain={a.domain} /></div>}</div><Score v={e.score} /></div>{e.text && <p style={{ color: C.ts, fontSize: 13, lineHeight: 1.6, margin: "0 0 10px", fontStyle: "italic" }}>&quot;{e.text}&quot;</p>}{expert && <div style={{ fontSize: 13, color: C.tm, display: "flex", alignItems: "center", gap: 8 }}><Avi name={expert.name} size={24} avatarUrl={expert.avatar_url} />{expert.name}</div>}</Card>; })}</div>)}
  </div>;
}


// ─── EXPERT DASHBOARD ─────────────────────────────────────────────────────────
function ExpertDash({ user, go, data, refresh, toast, t }: any) {
  const myA = data.assignments.filter((a: any) => a.expert_id === user.id);
  const subs = data.submissions.filter((s: any) => s.expert_id === user.id);
  const pending = subs.filter((s: any) => s.status === "pending_review");
  const sales = data.purchases.filter((p: any) => myA.some((a: any) => a.id === p.assignment_id));
  const earnings = sales.reduce((s: number, p: any) => s + parseFloat(p.expert_earnings || 0), 0);
  const [tab, setTab] = useState("overview");
  const [revId, setRevId] = useState<string | null>(null); const [scores, setScores] = useState<any>({}); const [feedback, setFeedback] = useState("");
  const [strengths, setStrengths] = useState(""); const [decision, setDecision] = useState("endorse");
  const [endText, setEndText] = useState(""); const [revNotes, setRevNotes] = useState("");
  const [reviewErr, setReviewErr] = useState(""); const [submittingReview, setSubmittingReview] = useState(false);

  const doReview = async (sub: any) => {
    setReviewErr("");
    if (!feedback.trim()) { setReviewErr("Feedback is required."); return; }
    if (decision === "endorse" && !endText.trim()) { setReviewErr("Endorsement text is required."); return; }
    setSubmittingReview(true);
    const a = data.assignments.find((x: any) => x.id === sub.assignment_id);
    const res = await api.createReview({ submission_id: sub.id, scores, feedback: feedback.trim(), strengths: strengths.trim(), revision_notes: revNotes.trim(), decision, endorsement_text: endText.trim(), learner_id: sub.learner_id, assignment_id: sub.assignment_id, assignment_title: a?.title, skills: a?.skills || [] });
    if (res.error) { setReviewErr("Error: " + res.error); setSubmittingReview(false); return; }
    await refresh(); setRevId(null); setScores({}); setFeedback(""); setStrengths(""); setEndText(""); setRevNotes(""); setDecision("endorse");
    toast("Review submitted!", "success"); setSubmittingReview(false);
  };

  return <div>
    <Tabs tabs={[{ id: "overview", label: t.overview }, { id: "assignments", label: t.assignments_label }, { id: "reviews", label: t.review_submissions }, { id: "endorsements", label: t.endorsements_given }]} active={tab} onChange={setTab} />
    {tab === "overview" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg,#0f1430,#1a1050)", borderRadius: 14, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: C.tm, fontSize: 13, marginBottom: 4 }}>{t.expert_dashboard}</div>
          <h2 style={{ color: C.tp, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{user.name}</h2>
          <div style={{ color: C.ts, fontSize: 13 }}>{user.title}{user.company ? ` · ${user.company}` : ""}</div>
          {user.verified_status === "pending" && <div style={{ marginTop: 8, fontSize: 13, color: C.amb }}>{t.pending_verification}</div>}
          {user.verified_status === "verified" && <div style={{ marginTop: 8 }}><Tag color={C.grn}>{t.verified_expert}</Tag></div>}
        </div>
        <Btn onClick={() => go("create-assignment")}>{t.create_assignment}</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>
        {[[t.assignments_label, myA.length, C.acc], [t.sales, sales.length, C.grn], [t.earnings, "$" + earnings.toFixed(0), C.grn], [t.pending, pending.length, C.amb]].map(([l, v, c]: any) => <Card key={l}><div style={{ fontSize: 28, fontWeight: 800, color: c, marginBottom: 4 }}>{v}</div><div style={{ fontSize: 12, color: C.tm }}>{l}</div></Card>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.tp }}>{t.your_assignments}</div>
          {myA.length > 3 && <button onClick={() => setTab("assignments")} style={{ background: "none", border: "none", cursor: "pointer", color: C.acc, fontSize: 13 }}>{t.view_all}</button>}
        </div>
        {myA.length === 0
          ? <div style={{ ...card0(), padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
              <div style={{ color: C.ts, fontSize: 14, marginBottom: 14 }}>{t.no_assignments_expert}</div>
              <Btn sz="sm" onClick={() => go("create-assignment")}>{t.create_first}</Btn>
            </div>
          : myA.slice(0, 3).map((a: any) => {
              const aSales = sales.filter((p: any) => p.assignment_id === a.id);
              return <div key={a.id} style={{ ...card0(), padding: "14px 18px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <DTag domain={a.domain} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: C.tp, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: C.tm, marginTop: 3 }}>📚 {aSales.length} {t.sales} · 💰 ${aSales.reduce((s: number, p: any) => s + parseFloat(p.expert_earnings || 0), 0).toFixed(0)} {t.earnings}</div>
                  </div>
                  <Tag color={C.grn}>{a.status}</Tag>
                </div>
              </div>;
            })}
      </div>
      {pending.length > 0 && <div style={{ ...card0(), padding: 18, borderLeft: `3px solid ${C.amb}` }}><div style={{ fontWeight: 700, color: C.tp, marginBottom: 8 }}>⚠ {pending.length} {t.pending}</div><Btn sz="sm" v="outline" onClick={() => setTab("reviews")}>{t.review_submissions} →</Btn></div>}
    </div>}

    {tab === "assignments" && <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        {myA.map((a: any) => { const aSales = sales.filter((p: any) => p.assignment_id === a.id); return <Card key={a.id}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><DTag domain={a.domain} /><Tag color={C.grn}>{a.status}</Tag></div><div style={{ fontWeight: 700, color: C.tp, fontSize: 15, marginBottom: 10, wordBreak: "break-word" }}>{a.title}</div><div style={{ display: "flex", gap: 16, fontSize: 12, color: C.tm }}><span>📚 {aSales.length} {t.sales}</span><span>💰 ${aSales.reduce((s: number, p: any) => s + parseFloat(p.expert_earnings || 0), 0).toFixed(0)}</span></div></Card>; })}
        <button onClick={() => go("create-assignment")} style={{ border: `2px dashed ${C.bd}`, borderRadius: 12, padding: 20, background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: C.tm }}><span style={{ fontSize: 32 }}>+</span><span style={{ fontSize: 14 }}>{t.create_assignment}</span></button>
      </div>
    </div>}

    {tab === "reviews" && (subs.length === 0 ? <Empty icon="🔍" title={t.no_submissions_yet} body={t.submissions_appear} /> : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {subs.map((sub: any) => {
        const a = data.assignments.find((x: any) => x.id === sub.assignment_id); const learner = data.users.find((u: any) => u.id === sub.learner_id); const sess = data.sessions.find((s: any) => s.id === sub.session_id); const isRev = revId === sub.id; const done = sub.status !== "pending_review";
        return <Card key={sub.id}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Avi name={learner?.name || "?"} size={44} avatarUrl={learner?.avatar_url} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div><div style={{ fontWeight: 700, color: C.tp }}>{learner?.name}</div><div style={{ fontSize: 13, color: C.ts, marginBottom: 4, wordBreak: "break-word" }}>{a?.title}</div><div style={{ fontSize: 12, color: C.tm }}>{new Date(sub.submitted_at).toLocaleDateString()}</div></div>
                <Tag color={done ? (sub.status === "endorsed" ? C.grn : sub.status === "rejected" ? C.red : C.amb) : C.amb}>{sub.status.replace(/_/g, " ")}</Tag>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {sub.github_repo_url && <ExtLink href={sub.github_repo_url}><Tag color={C.acc}>⌨ GitHub repo</Tag></ExtLink>}
                {sess && <Tag color={C.tm}>⏱ {Math.round((sess.total_active_time || 0) / 60)}m</Tag>}
                {sess?.tab_switch_count > 0 && <Tag color={sess.tab_switch_count > 5 ? C.red : C.tm}>⇄ {sess.tab_switch_count}</Tag>}
                {sess?.camera_enabled && <Tag color={C.grn}>📷</Tag>}
              </div>
              {sub.written_explanation && <div style={{ marginTop: 10, padding: "10px 14px", background: "#080d18", borderRadius: 8 }}><div style={{ fontSize: 11, color: C.tm, marginBottom: 4 }}>EXPLANATION</div><div style={{ fontSize: 13, color: C.ts, lineHeight: 1.6, wordBreak: "break-word" }}>{sub.written_explanation}</div></div>}
              {!done && !isRev && <div style={{ marginTop: 12 }}><Btn sz="sm" onClick={() => { setRevId(sub.id); setDecision("endorse"); const init: any = {}; (a?.evaluation_criteria || []).forEach((ec: any) => init[ec.name] = 75); if (!(a?.evaluation_criteria?.length)) init["Overall"] = 75; setScores(init); }}>{t.score_submission} →</Btn></div>}
              {isRev && <div style={{ marginTop: 14, padding: 20, background: "#080d18", borderRadius: 10, display: "flex", flexDirection: "column", gap: 14 }}>
                {reviewErr && <div style={{ background: C.redBg, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13 }}>{reviewErr}</div>}
                <div style={{ fontSize: 14, fontWeight: 700, color: C.tp }}>{t.score_submission}</div>
                {Object.keys(scores).map((name: string) => { const crit = (a?.evaluation_criteria || []).find((c: any) => c.name === name); return <div key={name}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.ts }}>{name}{crit ? <span style={{ color: C.tm }}> ({crit.weight}%)</span> : ""}</label><span style={{ fontSize: 13, fontWeight: 700, color: C.acc }}>{scores[name]}/100</span></div>{crit?.description && <div style={{ fontSize: 12, color: C.tm, marginBottom: 5 }}>{crit.description}</div>}<input type="range" min={0} max={100} value={scores[name]} onChange={(e: any) => setScores((s: any) => ({ ...s, [name]: parseInt(e.target.value) }))} style={{ width: "100%" }} /></div>; })}
                <div style={{ padding: "10px 14px", background: "#0a0f1e", borderRadius: 8, display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: C.ts }}>{t.overall_score}</span><Score v={Math.round(Object.values(scores).reduce((s: number, v: any) => s + Number(v), 0) / Math.max(Object.values(scores).length, 1))} /></div>
                <Field label={t.written_feedback} value={feedback} onChange={setFeedback} placeholder="Detailed feedback..." textarea rows={4} />
                <Field label={t.strengths_opt} value={strengths} onChange={setStrengths} placeholder="What impressed you..." textarea rows={2} />
                <div><div style={{ fontSize: 13, fontWeight: 600, color: C.ts, marginBottom: 8 }}>{t.decision}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[["endorse", t.endorse_btn, C.grn], ["revision", t.revision_btn, C.amb], ["reject", t.reject_btn, C.red]].map(([d, label, c]: any) => <button key={d} onClick={() => setDecision(d)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${decision === d ? c : C.bd}`, background: decision === d ? c + "22" : "transparent", color: decision === d ? c : C.ts, cursor: "pointer", fontSize: 13, fontWeight: decision === d ? 600 : 400 }}>{label}</button>)}</div>
                </div>
                {decision === "endorse" && <Field label={t.endorsement_text} value={endText} onChange={setEndText} placeholder="Public endorsement text..." textarea rows={3} />}
                {decision === "revision" && <Field label={t.revision_notes} value={revNotes} onChange={setRevNotes} placeholder="What needs to change..." textarea rows={3} />}
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn v={decision === "endorse" ? "success" : decision === "reject" ? "danger" : "outline"} onClick={() => doReview(sub)} disabled={submittingReview}>{submittingReview ? t.endorsing : (decision === "endorse" ? t.endorse_confirm : decision === "revision" ? t.send_revision : t.submit_rejection)}</Btn>
                  <Btn v="ghost" onClick={() => { setRevId(null); setReviewErr(""); }}>{t.cancel}</Btn>
                </div>
              </div>}
              {done && <div style={{ marginTop: 10 }}>
                {sub.status === "endorsed" && <div style={{ padding: "8px 12px", background: C.grnBg, borderRadius: 8, fontSize: 13, color: C.grn }}>{t.endorsed_score} {sub.final_score}/100</div>}
                {sub.status === "rejected" && <div style={{ padding: "8px 12px", background: C.redBg, borderRadius: 8, fontSize: 13, color: C.red }}>{t.rejected_label}</div>}
                {sub.status === "revision_requested" && <div style={{ padding: "8px 12px", background: C.ambBg, borderRadius: 8, fontSize: 13, color: C.amb }}>{t.revision_label}</div>}
              </div>}
            </div>
          </div>
        </Card>;
      })}
    </div>)}

    {tab === "endorsements" && (data.endorsements.filter((e: any) => e.expert_id === user.id).length === 0
      ? <Empty icon="🏅" title={t.no_endorsements_given} />
      : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{data.endorsements.filter((e: any) => e.expert_id === user.id).map((e: any) => { const learner = data.users.find((u: any) => u.id === e.learner_id); const a = data.assignments.find((x: any) => x.id === e.assignment_id); return <Card key={e.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><Avi name={learner?.name || "?"} size={36} avatarUrl={learner?.avatar_url} /><div><div style={{ fontWeight: 600, color: C.tp }}>{learner?.name}</div><div style={{ fontSize: 12, color: C.ts, wordBreak: "break-word" }}>{a?.title}</div></div></div><Score v={e.score} /></div>{e.text && <p style={{ fontSize: 13, color: C.ts, margin: "10px 0 0", fontStyle: "italic", lineHeight: 1.6 }}>&quot;{e.text}&quot;</p>}</Card>; })}</div>)}
  </div>;
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDash({ data, refresh, toast, t }: any) {
  const [tab, setTab] = useState("overview");
  const experts = data.users.filter((u: any) => u.role === "expert");
  const pending = experts.filter((e: any) => e.verified_status === "pending");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const verify = async (id: string, status: string) => {
    const res = await api.updateUser({ id, verified_status: status });
    if (res.error) { toast("Error: " + res.error, "error"); return; }
    await refresh(); toast("Updated.", "success");
  };

  const deleteAssignment = async (id: string) => {
    const res = await api.deleteAssignment(id);
    if (res.error) { toast("Error: " + res.error, "error"); return; }
    setConfirmDelete(null);
    await refresh(); toast("Assignment removed.", "success");
  };

  return <div>
    <Tabs tabs={[{ id: "overview", label: t.overview }, { id: "experts", label: t.expert_verification }, { id: "assignments", label: t.assignments_label }, { id: "users", label: "Users" }]} active={tab} onChange={setTab} />

    {tab === "overview" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg,#0f1430,#1c0f30)", borderRadius: 14, padding: "24px 28px" }}><div style={{ color: C.tm, fontSize: 13 }}>{t.admin_panel}</div><h2 style={{ color: C.tp, fontSize: 22, fontWeight: 800, margin: "4px 0 0" }}>{t.platform_overview}</h2></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>{[[t.total_users, data.users.length, C.acc], [t.published, data.assignments.filter((a: any) => a.status === "published").length, C.grn], [t.submissions, data.submissions.length, C.amb], [t.endorsements, data.endorsements.length, "#f97316"]].map(([l, v, c]: any) => <Card key={l}><div style={{ fontSize: 28, fontWeight: 800, color: c, marginBottom: 4 }}>{v}</div><div style={{ fontSize: 12, color: C.tm }}>{l}</div></Card>)}</div>
      {pending.length > 0 && <div style={{ ...card0(), padding: 18, borderLeft: `3px solid ${C.amb}` }}><div style={{ fontWeight: 700, color: C.tp, marginBottom: 8 }}>⚠ {pending.length} {t.expert_verification} {t.awaiting_verification}</div><Btn sz="sm" v="outline" onClick={() => setTab("experts")}>{t.review_applications}</Btn></div>}
    </div>}

    {tab === "experts" && (experts.length === 0 ? <Empty icon="🎓" title={t.no_experts} /> : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {experts.map((e: any) => <Card key={e.id}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Avi name={e.name} size={48} avatarUrl={e.avatar_url} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: C.tp, fontSize: 15 }}>{e.name}</div>
            <div style={{ fontSize: 13, color: C.ts }}>{e.email}</div>
            <div style={{ fontSize: 13, color: C.ts }}>{e.title}{e.company ? ` · ${e.company}` : ""}{e.years ? ` · ${e.years} yrs` : ""}</div>
            {e.bio && <div style={{ fontSize: 12, color: C.tm, marginTop: 4, lineHeight: 1.5, wordBreak: "break-word" }}>{e.bio}</div>}
            {e.domains?.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{e.domains.map((d: string) => <DTag key={d} domain={d} />)}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {e.github && <ExtLink href={`https://github.com/${e.github}`}><Tag color={C.tm}>⌨ {e.github}</Tag></ExtLink>}
              {e.linkedin && <ExtLink href={e.linkedin}><Tag color="#0a66c2">in LinkedIn</Tag></ExtLink>}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
            <Tag color={e.verified_status === "verified" ? C.grn : e.verified_status === "rejected" ? C.red : C.amb}>{e.verified_status}</Tag>
            {e.verified_status === "pending" && <div style={{ display: "flex", gap: 6 }}><Btn sz="sm" v="success" onClick={() => verify(e.id, "verified")}>{t.approve}</Btn><Btn sz="sm" v="danger" onClick={() => verify(e.id, "rejected")}>{t.reject}</Btn></div>}
            {e.verified_status === "verified" && <Btn sz="sm" v="ghost" onClick={() => verify(e.id, "pending")}>{t.revoke}</Btn>}
            {e.verified_status === "rejected" && <Btn sz="sm" v="outline" onClick={() => verify(e.id, "verified")}>{t.approve}</Btn>}
          </div>
        </div>
      </Card>)}
    </div>)}

    {tab === "assignments" && (data.assignments.length === 0 ? <Empty icon="📋" title="No assignments yet" /> : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.assignments.map((a: any) => {
        const exp = data.users.find((u: any) => u.id === a.expert_id);
        return <div key={a.id} style={{ ...card0(), padding: "14px 18px" }}>
          {confirmDelete === a.id
            ? <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, color: C.red, fontWeight: 600 }}>Delete &quot;{a.title}&quot;? This cannot be undone.</div>
                <div style={{ display: "flex", gap: 8 }}><Btn sz="sm" v="danger" onClick={() => deleteAssignment(a.id)}>Yes, delete</Btn><Btn sz="sm" v="ghost" onClick={() => setConfirmDelete(null)}>{t.cancel}</Btn></div>
              </div>
            : <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <DTag domain={a.domain} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: C.tp, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: C.tm, marginTop: 2 }}>by {exp?.name || "?"} · ${a.price} · {a.sales_count || 0} sales</div>
                </div>
                <Tag color={a.status === "published" ? C.grn : C.amb}>{a.status}</Tag>
                <Btn sz="sm" v="danger" onClick={() => setConfirmDelete(a.id)}>{t.remove_assignment}</Btn>
              </div>}
        </div>;
      })}
    </div>)}

    {tab === "users" && (data.users.length === 0 ? <Empty icon="👥" title="No users yet" /> : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.users.map((u: any) => <div key={u.id} style={{ ...card0(), padding: "13px 18px" }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><Avi name={u.name} size={36} avatarUrl={u.avatar_url} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, color: C.tp }}>{u.name}</div><div style={{ fontSize: 12, color: C.tm, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email} · Joined {new Date(u.created_at).toLocaleDateString()}</div></div><Tag color={u.role === "expert" ? C.acc : u.role === "admin" ? C.red : C.ts}>{u.role}</Tag></div></div>)}
    </div>)}
  </div>;
}

function RecruiterDash({ go, data, t }: any) {
  const [search, setSearch] = useState("");
  const learners = data.users.filter((u: any) => u.role === "learner").filter((l: any) => !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.skills?.some((s: string) => s.toLowerCase().includes(search.toLowerCase())));
  return <div>
    <div style={{ marginBottom: 24 }}><h1 style={{ fontSize: 24, fontWeight: 800, color: C.tp, margin: "0 0 6px" }}>{t.talent_discovery}</h1><p style={{ color: C.ts, margin: 0 }}>{t.talent_sub}</p></div>
    <div style={{ marginBottom: 20, maxWidth: 400 }}><Field value={search} onChange={setSearch} placeholder={t.search_ph} /></div>
    {learners.length === 0 ? <Empty icon="👨‍💻" title={t.no_candidates} body={t.candidates_appear} />
      : <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16 }}>
        {learners.map((l: any) => { const endr = data.endorsements.filter((e: any) => e.learner_id === l.id); return <Card key={l.id} onClick={() => go("learner:" + l.id)}><div style={{ display: "flex", gap: 14, marginBottom: 12 }}><Avi name={l.name} size={48} avatarUrl={l.avatar_url} /><div><div style={{ fontWeight: 700, color: C.tp, fontSize: 15 }}>{l.name}</div><div style={{ fontSize: 13, color: C.ts }}>{l.skills?.slice(0, 2).join(", ") || "—"}</div>{endr.length > 0 && <div style={{ marginTop: 4 }}><Tag color={C.grn}>🏅 {endr.length} {t.endorsed?.toLowerCase()}</Tag></div>}</div></div>{l.bio && <p style={{ fontSize: 13, color: C.ts, margin: "0 0 10px", lineHeight: 1.5, wordBreak: "break-word" }}>{l.bio}</p>}<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{l.github && <ExtLink href={`https://github.com/${l.github}`}><Tag color={C.tm}>⌨ GitHub</Tag></ExtLink>}{l.linkedin && <ExtLink href={l.linkedin}><Tag color="#0a66c2">in LinkedIn</Tag></ExtLink>}</div></Card>; })}
      </div>}
  </div>;
}


// ─── DASHBOARD SHELL ─────────────────────────────────────────────────────────
function Dashboard({ user, setUser, go, data, loading, refresh, toast, lang, setLang, t, setProfileOpen }: any) {
  const nav: any = {
    learner: [["marketplace", "📋", t.marketplace], ["dashboard", "🏠", t.dashboard], ["learner:" + user.id, "👤", "Profile"]],
    expert: [["dashboard", "🏠", t.overview], ["create-assignment", "✚", t.create_assignment], ["marketplace", "🌐", t.marketplace], ["experts", "👥", t.experts]],
    admin: [["dashboard", "🏠", t.admin_panel], ["marketplace", "🌐", t.marketplace], ["experts", "👥", t.experts]],
    recruiter: [["dashboard", "🏠", t.candidates], ["learners", "🌐", t.browse_talent]],
  };
  const items = nav[user.role] || nav.learner;
  const logout = async () => { await api.logout(); setUser(null); go("landing"); };
  return <div style={{ background: C.bg, minHeight: "100vh", display: "grid", gridTemplateColumns: "220px 1fr", color: C.tp }}>
    <div style={{ background: "#060b16", borderRight: `1px solid ${C.bd}`, padding: "18px 12px", display: "flex", flexDirection: "column", height: "100vh", boxSizing: "border-box", position: "sticky", top: 0, overflowY: "auto" }}>
      <button onClick={() => go("landing")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 800, color: C.tp, marginBottom: 24, padding: "0 8px", textAlign: "left" }}>Dev<span style={{ color: C.acc }}>ex</span></button>
      <button onClick={() => setProfileOpen(true)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, padding: "8px 8px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
        <Avi name={user.name} size={36} avatarUrl={user.avatar_url} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.tp, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name.split(" ")[0]}</div>
          <div style={{ fontSize: 11, color: C.tm, textTransform: "capitalize" }}>{user.role}</div>
        </div>
      </button>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {items.map(([id, icon, label]: any) => <button key={id + label} onClick={() => go(id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: C.ts, fontWeight: 400, fontSize: 13, cursor: "pointer", textAlign: "left" }}>{icon} {label}</button>)}
      </div>
      <div style={{ borderTop: `1px solid ${C.bd}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        <NotifBell userId={user.id} />
        <button onClick={() => setLang(lang === "en" ? "az" : "en")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: C.acc, fontSize: 13, cursor: "pointer" }}>🌐 {t.lang_toggle}</button>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: C.tm, fontSize: 13, cursor: "pointer" }}>← {t.signout}</button>
      </div>
    </div>
    <div style={{ padding: "32px 36px", overflowY: "auto", height: "100vh", boxSizing: "border-box", minWidth: 0 }}>
      {loading ? <Spinner /> :
        user.role === "learner" ? <LearnerDash user={user} go={go} data={data} t={t} /> :
        user.role === "expert" ? <ExpertDash user={user} go={go} data={data} refresh={refresh} toast={toast} t={t} /> :
        user.role === "admin" ? <AdminDash data={data} refresh={refresh} toast={toast} t={t} /> :
        <RecruiterDash go={go} data={data} t={t} />}
    </div>
  </div>;
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function Home() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [toast, setToast] = useState<any>(null);
  const [payModal, setPayModal] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [lang, setLang] = useState<"en"|"az">("en");
  const t = T[lang];
  const { data, loading, refresh } = useData();

  // Restore session from httpOnly cookie on every refresh
  useEffect(() => {
    api.me().then(({ user: u }) => {
      if (u) { setUser(u); setPage("dashboard"); }
      setUserLoading(false);
    }).catch(() => setUserLoading(false));
  }, []);

  const showToast = (msg: string, type = "success") => setToast({ msg, type, key: Date.now() });

  const go = useCallback((p: string) => {
    if (!user && ["dashboard", "create-assignment"].includes(p)) { setPage("login"); return; }
    if (!user && p.startsWith("workspace:")) { setPage("login"); return; }
    setPage(p);
    window.scrollTo(0, 0);
  }, [user]);

  const handleBuy = useCallback(async (assignment: any) => {
    if (!user) { setPage("login"); return; }
    if (user.role !== "learner") { showToast("Only learners can purchase assignments.", "error"); return; }
    setPayModal(assignment);
  }, [user]);

  const completePurchase = useCallback(async (assignment: any) => {
    setPayModal(null);
    const res = await api.createPurchase({ assignment_id: assignment.id, price: assignment.price, expert_id: assignment.expert_id, title: assignment.title, current_sales: assignment.sales_count });
    if (res.error) { showToast("Purchase failed: " + res.error, "error"); return; }
    await refresh();
    showToast(t.payment_success, "success");
    setPage("workspace:" + assignment.id);
  }, [refresh, t]);

  const handleSaveProfile = useCallback((updatedUser: any) => {
    setUser((u: any) => ({ ...u, ...updatedUser }));
    setProfileOpen(false);
    showToast(t.profile_updated, "success");
    refresh();
  }, [refresh, t]);

  const shell = (content: any) => (
    <Shell2 user={user} go={go} page={page} lang={lang} setLang={setLang} t={t} setProfileOpen={setProfileOpen}>
      {content}
    </Shell2>
  );
  const pid = page.includes(":") ? page.split(":").slice(1).join(":") : null;

  if (userLoading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;

  let view;
  if (page === "landing") view = <Landing go={go} lang={lang} setLang={setLang} t={t} />;
  else if (page === "login") view = <Login go={go} setUser={setUser} toast={showToast} t={t} />;
  else if (page === "register") view = <Register go={go} setUser={setUser} toast={showToast} t={t} />;
  else if (page === "dashboard") view = user ? <Dashboard user={user} setUser={setUser} go={go} data={data} loading={loading} refresh={refresh} toast={showToast} lang={lang} setLang={setLang} t={t} setProfileOpen={setProfileOpen} /> : <Login go={go} setUser={setUser} toast={showToast} t={t} />;
  else if (page === "marketplace") view = shell(<Marketplace go={go} user={user} data={data} handleBuy={handleBuy} t={t} />);
  else if (page === "experts") view = shell(<ExpertsPage data={data} t={t} />);
  else if (page === "learners") view = shell(<LearnersPage go={go} data={data} t={t} />);
  else if (page === "create-assignment") view = user ? shell(<CreateAssignment user={user} go={go} toast={showToast} refresh={refresh} t={t} />) : <Login go={go} setUser={setUser} toast={showToast} t={t} />;
  else if (page.startsWith("assignment:")) view = shell(<AssignmentDetail id={pid} go={go} user={user} toast={showToast} data={data} refresh={refresh} handleBuy={handleBuy} t={t} />);
  else if (page.startsWith("workspace:")) view = <Workspace assignmentId={pid} user={user} go={go} toast={showToast} data={data} refresh={refresh} t={t} />;
  else if (page.startsWith("learner:")) view = shell(<LearnerProfile id={pid} go={go} data={data} t={t} />);
  else view = <Landing go={go} lang={lang} setLang={setLang} t={t} />;

  return (
    <>
      {view}
      {payModal && <PaymentModal assignment={payModal} onSuccess={() => completePurchase(payModal)} onClose={() => setPayModal(null)} t={t} />}
      {profileOpen && user && <ProfileModal user={user} onSave={handleSaveProfile} onClose={() => setProfileOpen(false)} t={t} />}
      {toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}
