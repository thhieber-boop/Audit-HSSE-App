/* ============================================================================
   OUTIL D'AUDIT INTERNE HSSE — LOGIQUE APPLICATIVE
   ========================================================================== */

const $app = () => document.getElementById("app");
const $save = () => document.getElementById("saveIndicator");

let CURRENT_AUDIT = null;
let CURRENT_LANG = null;
let FLAT_QUESTIONS = []; // questions actives uniquement (parcours audit)
let DEPT_INDEX = {};
let ADMIN_FLAT_QUESTIONS = []; // toutes les questions, y compris désactivées (mode admin)
let ADMIN_DEPT_INDEX = {};
let SECTION_FILTER = "all"; // all | todo | nc
let expandedQids = new Set();

/* ---------------------------------------------------------------- utils */
function uid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}
function fmtDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString(CURRENT_LANG || "fr", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function debounce(fn, ms) {
  let tm;
  return (...args) => {
    clearTimeout(tm);
    tm = setTimeout(() => fn(...args), ms);
  };
}
function navigate(hash) {
  location.hash = hash;
}

/* ---------------------------------------------------------- data index */
function resolveDeptName(dept, lang) {
  if (lang && lang !== "fr") {
    const n = QUESTION_TRANSLATIONS[lang]?.[dept.id]?.name;
    if (n) return n;
  }
  return dept.name;
}
function resolveSectionName(dept, section, lang) {
  if (lang && lang !== "fr") {
    const n = QUESTION_TRANSLATIONS[lang]?.[dept.id]?.sections?.[section.id]?.name;
    if (n) return n;
  }
  return section.name;
}
function resolveQuestionText(dept, section, idx, baseQ, lang, edit) {
  if (edit && edit.t && edit.t[lang]) {
    return { text: edit.t[lang], group: edit.g !== undefined ? edit.g : baseQ.g || null };
  }
  if (lang && lang !== "fr") {
    const trQ = QUESTION_TRANSLATIONS[lang]?.[dept.id]?.sections?.[section.id]?.questions?.[idx];
    if (trQ && trQ.t) {
      return { text: trQ.t, group: edit && edit.g !== undefined ? edit.g : trQ.g ?? baseQ.g ?? null };
    }
  }
  if (edit && edit.t && edit.t.fr) {
    return { text: edit.t.fr, group: edit.g !== undefined ? edit.g : baseQ.g || null };
  }
  return { text: baseQ.t, group: baseQ.g || null };
}

function buildIndex() {
  const lang = CURRENT_LANG || getLang() || "fr";
  const overrides = typeof getAdminOverrides === "function" ? getAdminOverrides() : { edits: {}, added: [] };

  FLAT_QUESTIONS = [];
  DEPT_INDEX = {};
  ADMIN_FLAT_QUESTIONS = [];
  ADMIN_DEPT_INDEX = {};

  AUDIT_DATA.departments.forEach((dept) => {
    const deptName = resolveDeptName(dept, lang);
    const deptCopy = { ...dept, name: deptName, sections: [] };
    const deptCopyAdmin = { ...dept, name: deptName, sections: [] };

    dept.sections.forEach((section) => {
      const sectionName = resolveSectionName(dept, section, lang);
      const secCopy = { ...section, name: sectionName, questions: [] };
      const secCopyAdmin = { ...section, name: sectionName, questions: [] };

      section.questions.forEach((q, idx) => {
        const qid = `${dept.id}__${section.id}__${idx}`;
        const edit = overrides.edits[qid];
        const inactive = !!(edit && edit.active === false);
        const resolved = resolveQuestionText(dept, section, idx, q, lang, edit);
        const full = {
          qid,
          deptId: dept.id,
          deptName,
          sectionId: section.id,
          sectionName,
          group: resolved.group,
          text: resolved.text,
          ref: (edit && edit.ref !== undefined ? edit.ref : q.r) || null,
          isCustom: false,
          isEdited: !!edit,
          inactive,
        };
        ADMIN_FLAT_QUESTIONS.push(full);
        secCopyAdmin.questions.push(full);
        if (!inactive) {
          FLAT_QUESTIONS.push(full);
          secCopy.questions.push(full);
        }
      });

      overrides.added
        .filter((cq) => cq.deptId === dept.id && cq.sectionId === section.id)
        .forEach((cq) => {
          const text = (cq.t && cq.t[lang]) || (cq.t && cq.t.fr) || "";
          const inactive = cq.active === false;
          const full = {
            qid: cq.id,
            deptId: dept.id,
            deptName,
            sectionId: section.id,
            sectionName,
            group: cq.g || null,
            text,
            ref: cq.ref || null,
            isCustom: true,
            isEdited: false,
            inactive,
          };
          ADMIN_FLAT_QUESTIONS.push(full);
          secCopyAdmin.questions.push(full);
          if (!inactive) {
            FLAT_QUESTIONS.push(full);
            secCopy.questions.push(full);
          }
        });

      deptCopy.sections.push(secCopy);
      deptCopyAdmin.sections.push(secCopyAdmin);
    });
    DEPT_INDEX[dept.id] = deptCopy;
    ADMIN_DEPT_INDEX[dept.id] = deptCopyAdmin;
  });
}

/* --------------------------------------------------------- answer state */
function emptyAnswer() {
  return { status: null, ncLieu: null, ncGravite: null, comment: "", photos: [] };
}
function getAnswer(qid) {
  if (!CURRENT_AUDIT.answers[qid]) CURRENT_AUDIT.answers[qid] = emptyAnswer();
  return CURRENT_AUDIT.answers[qid];
}

const persistNow = async () => {
  if (!CURRENT_AUDIT) return;
  await saveAudit(CURRENT_AUDIT);
  const el = $save();
  if (el) {
    el.textContent = "✓";
    el.classList.remove("saving");
  }
};
const persistDebounced = debounce(persistNow, 500);

function markDirty() {
  const el = $save();
  if (el) {
    el.textContent = "…";
    el.classList.add("saving");
  }
  persistDebounced();
}

/* ------------------------------------------------------------- stats */
function computeSectionStats(deptId, sectionId) {
  const section = DEPT_INDEX[deptId].sections.find((s) => s.id === sectionId);
  let answered = 0,
    nc = 0;
  section.questions.forEach((q) => {
    const a = CURRENT_AUDIT.answers[q.qid];
    if (a && a.status) answered++;
    if (a && a.status === "non_conforme") nc++;
  });
  return { total: section.questions.length, answered, nc };
}
function computeDeptStats(deptId) {
  const dept = DEPT_INDEX[deptId];
  let total = 0,
    answered = 0,
    nc = 0;
  dept.sections.forEach((s) =>
    s.questions.forEach((q) => {
      total++;
      const a = CURRENT_AUDIT.answers[q.qid];
      if (a && a.status) answered++;
      if (a && a.status === "non_conforme") nc++;
    })
  );
  return { total, answered, nc };
}
function computeDeptNCBreakdown(deptId) {
  const dept = DEPT_INDEX[deptId];
  const res = { parcStd: 0, parcCrit: 0, centraleStd: 0, centraleCrit: 0 };
  dept.sections.forEach((s) =>
    s.questions.forEach((q) => {
      const a = CURRENT_AUDIT.answers[q.qid];
      if (a && a.status === "non_conforme") {
        if (a.ncLieu === "parc" && a.ncGravite === "standard") res.parcStd++;
        else if (a.ncLieu === "parc" && a.ncGravite === "critique") res.parcCrit++;
        else if (a.ncLieu === "centrale" && a.ncGravite === "standard") res.centraleStd++;
        else if (a.ncLieu === "centrale" && a.ncGravite === "critique") res.centraleCrit++;
      }
    })
  );
  return res;
}
function computeGlobalScore() {
  let totalParc = 0,
    critiqueParc = 0,
    standardParc = 0;
  const byDept = {};
  AUDIT_DATA.departments.forEach((d) => {
    const b = computeDeptNCBreakdown(d.id);
    byDept[d.id] = b;
    totalParc += b.parcStd + b.parcCrit;
    critiqueParc += b.parcCrit;
    standardParc += b.parcStd;
  });
  let score = "orange";
  if (totalParc > 25 || critiqueParc > 4) score = "rouge";
  else if (totalParc <= 15 && critiqueParc <= 2) score = "vert";
  return { totalParc, critiqueParc, standardParc, score, byDept };
}

/* ------------------------------------------------------------ routing */
window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", init);

async function init() {
  await checkStorageAvailability();
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#langSwitchBtn")) openLanguageModal();
  });
  const lang = getLang();
  if (!lang) {
    renderLanguagePicker();
    return;
  }
  CURRENT_LANG = lang;
  buildIndex();
  route();
}

async function route() {
  const hash = location.hash.slice(1) || "/";
  const parts = hash.split("/").filter(Boolean);

  if (parts[0] === "admin") {
    if (!ADMIN_UNLOCKED) return renderAdminGate();
    if (parts.length === 1) return renderAdminHome();
    if (parts[1] === "dept" && parts[2]) {
      if (parts.length === 3) return renderAdminSections(parts[2]);
      if (parts[3] === "sec" && parts[4]) return renderAdminQuestions(parts[2], parts[4]);
    }
    return renderAdminHome();
  }

  if (parts.length === 0) return renderHome();
  if (parts[0] === "new") return renderNewAuditForm();

  if (parts[0] === "audit" && parts[1]) {
    const id = parts[1];
    if (!CURRENT_AUDIT || CURRENT_AUDIT.id !== id) {
      const loaded = await getAudit(id);
      if (!loaded) {
        navigate("#/");
        return;
      }
      CURRENT_AUDIT = loaded;
      if (!CURRENT_AUDIT.answers) CURRENT_AUDIT.answers = {};
    }
    if (parts.length === 2) return renderDeptGrid();
    if (parts[2] === "infos") return renderAuditInfos();
    if (parts[2] === "conclusion") return renderConclusion();
    if (parts[2] === "print") return renderPrint();
    if (parts[2] === "dept" && parts[3]) {
      if (parts.length === 4) return renderSections(parts[3]);
      if (parts[4] === "sec" && parts[5]) return renderQuestions(parts[3], parts[5]);
    }
  }
  renderHome();
}

/* ------------------------------------------------------------ header */
function topBar({ title, backHash, right = "" }) {
  return `
  <header class="topbar no-print">
    <div class="topbar-left">
      ${backHash ? `<button class="icon-btn" data-nav="${backHash}" aria-label="${esc(t("common.back"))}">←</button>` : ""}
      <div class="topbar-title">${esc(title)}</div>
    </div>
    <div class="topbar-right">${right}<button class="icon-btn" id="langSwitchBtn" aria-label="${esc(t("common.langSwitch"))}">🌐</button><span id="saveIndicator" class="save-indicator"></span></div>
  </header>`;
}

/* ===================================================== LANGUE : PICKER */
function renderLanguagePicker() {
  const titles = LANGS.map((l) => UI_STRINGS[l.code].lang.chooseTitle).join(" / ");
  const subtitles = LANGS.map((l) => UI_STRINGS[l.code].lang.chooseSubtitle).join(" · ");
  document.body.innerHTML = `
    <div class="lang-picker-screen">
      <div class="lang-picker-card">
        <h1 id="langPickTitle">${esc(titles)}</h1>
        <p id="langPickSubtitle" class="muted">${esc(subtitles)}</p>
        <div class="lang-picker-grid">
          ${LANGS.map((l) => `<button class="lang-picker-btn" data-lang="${l.code}">${l.flag} ${l.label}</button>`).join("")}
        </div>
      </div>
    </div>`;
  document.querySelectorAll("[data-lang]").forEach((btn) =>
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      CURRENT_LANG = btn.dataset.lang;
      restoreAppShell();
      buildIndex();
      route();
    })
  );
}

function restoreAppShell() {
  document.body.innerHTML = '<div id="app"></div>';
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#langSwitchBtn")) openLanguageModal();
  });
}

function openLanguageModal() {
  if (document.querySelector(".lang-modal-overlay")) return;
  const overlay = document.createElement("div");
  overlay.className = "lang-modal-overlay";
  overlay.innerHTML = `
    <div class="lang-modal">
      <h2>${esc(t("lang.chooseTitle"))}</h2>
      ${LANGS.map((l) => `<button class="lang-picker-btn" data-lang="${l.code}">${l.flag} ${l.label}</button>`).join("")}
      <button class="btn-ghost lang-cancel">${esc(t("common.cancel"))}</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.classList.contains("lang-cancel")) {
      overlay.remove();
      return;
    }
    const btn = e.target.closest("[data-lang]");
    if (btn) {
      setLang(btn.dataset.lang);
      CURRENT_LANG = btn.dataset.lang;
      overlay.remove();
      buildIndex();
      route();
    }
  });
}

/* ================================================================ HOME */
async function renderHome() {
  CURRENT_AUDIT = null;
  const audits = await getAllAudits();
  const rows = audits
    .map((a) => {
      const total = FLAT_QUESTIONS.length;
      const answered = Object.values(a.answers || {}).filter((x) => x.status).length;
      const nc = Object.values(a.answers || {}).filter((x) => x.status === "non_conforme").length;
      const pct = total ? Math.round((answered / total) * 100) : 0;
      return `
      <div class="card audit-card" data-nav="#/audit/${a.id}">
        <div class="audit-card-main">
          <div class="audit-card-title">${esc(a.park || "—")}</div>
          <div class="audit-card-sub">${esc(a.auditor || "")} · ${esc(a.date || "")}</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="audit-card-meta">${esc(t("home.cardMeta", { answered, total, nc, date: fmtDate(a.updatedAt) }))}</div>
        </div>
        <div class="audit-card-actions">
          <button class="btn-ghost sm" data-action="export-audit" data-id="${a.id}">${esc(t("home.export"))}</button>
          <button class="btn-ghost sm danger" data-action="delete-audit" data-id="${a.id}">${esc(t("home.delete"))}</button>
        </div>
      </div>`;
    })
    .join("");

  $app().innerHTML = `
    ${topBar({ title: t("app.title") })}
    <main class="container">
      <div class="hero">
        <h1>${esc(t("app.title"))}</h1>
        <p class="muted">${esc(t("app.subtitle"))}</p>
        <button class="btn-primary lg" data-nav="#/new">${esc(t("home.newAudit"))}</button>
      </div>
      <h2 class="section-title">${esc(t("home.myAudits"))}</h2>
      ${audits.length ? rows : `<p class="muted">${esc(t("home.noAudits"))}</p>`}
      <div class="import-zone no-print">
        <label class="btn-ghost">
          ${esc(t("home.importLabel"))}
          <input type="file" id="importFile" accept="application/json" hidden />
        </label>
      </div>
      <div class="admin-entry-zone no-print">
        <a href="#/admin" class="admin-entry-link">${esc(t("home.adminLink"))}</a>
      </div>
    </main>`;

  wireNav();
  document.getElementById("importFile")?.addEventListener("change", handleImportFile);
  $app()
    .querySelectorAll('[data-action="delete-audit"]')
    .forEach((b) =>
      b.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm(t("home.deleteConfirm"))) {
          await deleteAudit(b.dataset.id);
          renderHome();
        }
      })
    );
  $app()
    .querySelectorAll('[data-action="export-audit"]')
    .forEach((b) =>
      b.addEventListener("click", async (e) => {
        e.stopPropagation();
        const a = await getAudit(b.dataset.id);
        exportAuditJSON(a);
      })
    );
}

function exportAuditJSON(audit) {
  const blob = new Blob([JSON.stringify(audit, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safePark = (audit.park || "audit").replace(/[^a-z0-9]+/gi, "_");
  link.href = url;
  link.download = `audit-hsse_${safePark}_${(audit.date || "").replace(/\//g, "-")}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (!data.id) data.id = uid();
    if (!data.answers) data.answers = {};
    await saveAudit(data);
    renderHome();
  } catch (err) {
    alert(t("home.importInvalid") + err.message);
  }
}

/* ============================================================ NEW AUDIT */
function renderNewAuditForm() {
  const lastAuditor = localStorage.getItem("hsse_last_auditor") || "";
  const lastPark = localStorage.getItem("hsse_last_park") || "";
  const today = new Date().toISOString().slice(0, 10);
  $app().innerHTML = `
    ${topBar({ title: t("newAudit.title"), backHash: "#/" })}
    <main class="container narrow">
      <form id="newAuditForm" class="form-card">
        <label>${esc(t("newAudit.park"))}
          <input type="text" name="park" required value="${esc(lastPark)}" placeholder="${esc(t("newAudit.parkPlaceholder"))}" />
        </label>
        <label>${esc(t("newAudit.auditor"))}
          <input type="text" name="auditor" required value="${esc(lastAuditor)}" placeholder="${esc(t("newAudit.auditorPlaceholder"))}" />
        </label>
        <label>${esc(t("newAudit.date"))}
          <input type="date" name="date" required value="${today}" />
        </label>
        <button type="submit" class="btn-primary lg">${esc(t("newAudit.create"))}</button>
      </form>
    </main>`;
  wireNav();
  document.getElementById("newAuditForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const audit = {
      id: uid(),
      park: fd.get("park").trim(),
      auditor: fd.get("auditor").trim(),
      date: fd.get("date"),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      answers: {},
    };
    localStorage.setItem("hsse_last_auditor", audit.auditor);
    localStorage.setItem("hsse_last_park", audit.park);
    await saveAudit(audit);
    navigate(`#/audit/${audit.id}`);
  });
}

/* ========================================================= AUDIT INFOS */
function renderAuditInfos() {
  $app().innerHTML = `
    ${topBar({ title: t("infos.title"), backHash: `#/audit/${CURRENT_AUDIT.id}` })}
    <main class="container narrow">
      <form id="infosForm" class="form-card">
        <label>${esc(t("infos.park"))} <input type="text" name="park" value="${esc(CURRENT_AUDIT.park)}" /></label>
        <label>${esc(t("infos.auditor"))} <input type="text" name="auditor" value="${esc(CURRENT_AUDIT.auditor)}" /></label>
        <label>${esc(t("infos.date"))} <input type="date" name="date" value="${esc(CURRENT_AUDIT.date)}" /></label>
        <button type="submit" class="btn-primary lg">${esc(t("infos.save"))}</button>
      </form>
      <button class="btn-ghost danger lg" id="deleteAuditBtn">${esc(t("infos.deleteAudit"))}</button>
    </main>`;
  wireNav();
  document.getElementById("infosForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    CURRENT_AUDIT.park = fd.get("park").trim();
    CURRENT_AUDIT.auditor = fd.get("auditor").trim();
    CURRENT_AUDIT.date = fd.get("date");
    await persistNow();
    navigate(`#/audit/${CURRENT_AUDIT.id}`);
  });
  document.getElementById("deleteAuditBtn").addEventListener("click", async () => {
    if (confirm(t("infos.deleteConfirm"))) {
      await deleteAudit(CURRENT_AUDIT.id);
      CURRENT_AUDIT = null;
      navigate("#/");
    }
  });
}

/* ============================================================ DEPT GRID */
function renderDeptGrid() {
  const cards = AUDIT_DATA.departments
    .map((d) => {
      const stats = computeDeptStats(d.id);
      const pct = stats.total ? Math.round((stats.answered / stats.total) * 100) : 0;
      const ncBadge = stats.nc > 0 ? `<span class="badge badge-nc">${stats.nc} NC</span>` : stats.answered === stats.total ? `<span class="badge badge-ok">✓</span>` : "";
      return `
      <div class="card dept-card" data-nav="#/audit/${CURRENT_AUDIT.id}/dept/${d.id}">
        <div class="dept-icon">${d.icon}</div>
        <div class="dept-card-body">
          <div class="dept-card-title">${esc(DEPT_INDEX[d.id].name)} ${ncBadge}</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="dept-card-meta">${esc(t("dept.questionsCount", { answered: stats.answered, total: stats.total }))}</div>
        </div>
      </div>`;
    })
    .join("");

  const gstats = (() => {
    let total = 0,
      answered = 0,
      nc = 0;
    AUDIT_DATA.departments.forEach((d) => {
      const s = computeDeptStats(d.id);
      total += s.total;
      answered += s.answered;
      nc += s.nc;
    });
    return { total, answered, nc };
  })();
  const gpct = gstats.total ? Math.round((gstats.answered / gstats.total) * 100) : 0;

  $app().innerHTML = `
    ${topBar({
      title: CURRENT_AUDIT.park || "Audit",
      backHash: "#/",
      right: `<button class="icon-btn" data-nav="#/audit/${CURRENT_AUDIT.id}/infos" aria-label="${esc(t("infos.aria"))}">ⓘ</button>`,
    })}
    <main class="container">
      <div class="audit-summary">
        <div><strong>${esc(CURRENT_AUDIT.auditor)}</strong> · ${esc(CURRENT_AUDIT.date)}</div>
        <div class="progress-bar lg"><div class="progress-fill" style="width:${gpct}%"></div></div>
        <div class="muted">${esc(t("deptGrid.summary", { answered: gstats.answered, total: gstats.total, nc: gstats.nc }))}</div>
      </div>
      <h2 class="section-title">${esc(t("deptGrid.title"))}</h2>
      <div class="dept-grid">${cards}</div>
      <button class="btn-primary lg" data-nav="#/audit/${CURRENT_AUDIT.id}/conclusion">${esc(t("deptGrid.conclusionBtn"))}</button>
    </main>`;
  wireNav();
}

/* ============================================================= SECTIONS */
function renderSections(deptId) {
  const dept = DEPT_INDEX[deptId];
  const cards = dept.sections
    .map((s) => {
      const stats = computeSectionStats(deptId, s.id);
      const pct = stats.total ? Math.round((stats.answered / stats.total) * 100) : 0;
      const ncBadge = stats.nc > 0 ? `<span class="badge badge-nc">${stats.nc} NC</span>` : stats.answered === stats.total ? `<span class="badge badge-ok">✓</span>` : "";
      return `
      <div class="card section-card" data-nav="#/audit/${CURRENT_AUDIT.id}/dept/${deptId}/sec/${s.id}">
        <div class="section-card-body">
          <div class="dept-card-title">${esc(s.name)} ${ncBadge}</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="dept-card-meta">${esc(t("dept.questionsCount", { answered: stats.answered, total: stats.total }))}</div>
        </div>
        <div class="chev">›</div>
      </div>`;
    })
    .join("");

  $app().innerHTML = `
    ${topBar({ title: dept.name, backHash: `#/audit/${CURRENT_AUDIT.id}` })}
    <main class="container">
      <h2 class="section-title">${esc(t("sections.title"))}</h2>
      ${cards}
    </main>`;
  wireNav();
}

/* ============================================================ QUESTIONS */
function renderQuestions(deptId, sectionId) {
  stopActiveRecognition();
  const dept = DEPT_INDEX[deptId];
  const section = dept.sections.find((s) => s.id === sectionId);
  const idxInDept = dept.sections.findIndex((s) => s.id === sectionId);
  const prevSection = dept.sections[idxInDept - 1];
  const nextSection = dept.sections[idxInDept + 1];

  let questions = section.questions;
  if (SECTION_FILTER === "todo") questions = questions.filter((q) => !getAnswer(q.qid).status);
  else if (SECTION_FILTER === "nc") questions = questions.filter((q) => getAnswer(q.qid).status === "non_conforme");

  let lastGroup = null;
  const cardsHtml = questions
    .map((q) => {
      let groupHeader = "";
      if (q.group && q.group !== lastGroup) {
        groupHeader = `<div class="group-header">${esc(q.group)}</div>`;
        lastGroup = q.group;
      } else if (!q.group) {
        lastGroup = null;
      }
      return groupHeader + questionCardHtml(q);
    })
    .join("");

  $app().innerHTML = `
    ${topBar({ title: section.name, backHash: `#/audit/${CURRENT_AUDIT.id}/dept/${deptId}` })}
    <main class="container">
      <div class="filter-chips no-print">
        <button class="chip ${SECTION_FILTER === "all" ? "active" : ""}" data-filter="all">${esc(t("filter.all", { n: section.questions.length }))}</button>
        <button class="chip ${SECTION_FILTER === "todo" ? "active" : ""}" data-filter="todo">${esc(t("filter.todo"))}</button>
        <button class="chip ${SECTION_FILTER === "nc" ? "active" : ""}" data-filter="nc">${esc(t("filter.nc"))}</button>
      </div>
      <div class="question-list">${cardsHtml || `<p class="muted">${esc(t("questions.noneInFilter"))}</p>`}</div>
      <div class="section-nav no-print">
        ${prevSection ? `<button class="btn-ghost" data-nav="#/audit/${CURRENT_AUDIT.id}/dept/${deptId}/sec/${prevSection.id}">← ${esc(prevSection.name)}</button>` : "<span></span>"}
        ${
          nextSection
            ? `<button class="btn-primary" data-nav="#/audit/${CURRENT_AUDIT.id}/dept/${deptId}/sec/${nextSection.id}">${esc(nextSection.name)} →</button>`
            : `<button class="btn-primary" data-nav="#/audit/${CURRENT_AUDIT.id}/dept/${deptId}">${esc(t("questions.finishSection"))}</button>`
        }
      </div>
    </main>`;

  wireNav();
  $app()
    .querySelectorAll("[data-filter]")
    .forEach((b) =>
      b.addEventListener("click", () => {
        SECTION_FILTER = b.dataset.filter;
        renderQuestions(deptId, sectionId);
      })
    );
  wireQuestionCards();
}

function statusDefs() {
  return [
    { key: "conforme", label: t("status.conforme"), cls: "st-conforme" },
    { key: "non_observe", label: t("status.nonObserve"), cls: "st-non-observe" },
    { key: "non_conforme", label: t("status.nonConforme"), cls: "st-non-conforme" },
    { key: "na", label: t("status.na"), cls: "st-na" },
  ];
}

function questionCardHtml(q) {
  const a = getAnswer(q.qid);
  const expanded = expandedQids.has(q.qid) || a.status === "non_conforme" || !!a.comment || a.photos.length > 0;
  const statusBtns = statusDefs()
    .map((s) => `<button type="button" class="status-btn ${s.cls} ${a.status === s.key ? "active" : ""}" data-qid="${q.qid}" data-status="${s.key}">${esc(s.label)}</button>`)
    .join("");

  const ncBlock =
    a.status === "non_conforme"
      ? `
    <div class="nc-block">
      <div class="pill-group">
        <span class="pill-label">${esc(t("nc.level"))}</span>
        <button type="button" class="pill ${a.ncLieu === "parc" ? "active" : ""}" data-qid="${q.qid}" data-nclieu="parc">${esc(t("nc.parc"))}</button>
        <button type="button" class="pill ${a.ncLieu === "centrale" ? "active" : ""}" data-qid="${q.qid}" data-nclieu="centrale">${esc(t("nc.centrale"))}</button>
      </div>
      <div class="pill-group">
        <span class="pill-label">${esc(t("nc.gravite"))}</span>
        <button type="button" class="pill pill-standard ${a.ncGravite === "standard" ? "active" : ""}" data-qid="${q.qid}" data-ncgravite="standard">${esc(t("nc.standard"))}</button>
        <button type="button" class="pill pill-critique ${a.ncGravite === "critique" ? "active" : ""}" data-qid="${q.qid}" data-ncgravite="critique">${esc(t("nc.critique"))}</button>
      </div>
      ${!a.ncLieu || !a.ncGravite ? `<div class="nc-warning">${esc(t("nc.warning"))}</div>` : ""}
    </div>`
      : "";

  const photosHtml = a.photos
    .map(
      (p, i) => `
      <div class="photo-thumb">
        <img src="${p}" alt="photo" />
        <button type="button" class="photo-del" data-qid="${q.qid}" data-photo-idx="${i}">✕</button>
      </div>`
    )
    .join("");

  return `
  <div class="q-card ${expanded ? "expanded" : ""}" id="card-${q.qid}">
    <div class="q-card-head" data-toggle="${q.qid}">
      <div class="q-text">${q.ref ? `<span class="q-ref">${esc(q.ref)}</span>` : ""}${esc(q.text)}</div>
      <div class="q-toggle">${expanded ? "▾" : "▸"}</div>
    </div>
    <div class="status-row">${statusBtns}</div>
    <div class="q-details" ${expanded ? "" : 'style="display:none"'}>
      ${ncBlock}
      <div class="comment-label">
        <span>${esc(t("comment.label"))}</span>
        <button type="button" class="mic-btn" data-qid="${q.qid}" title="${esc(t("mic.title"))}">${esc(t("mic.dictate"))}</button>
      </div>
      <textarea class="comment-input" data-qid="${q.qid}" placeholder="${esc(t("comment.placeholder"))}">${esc(a.comment)}</textarea>
      <div class="photos-row">
        ${photosHtml}
        <label class="photo-add-btn">
          ${esc(t("photo.add"))}
          <input type="file" accept="image/*" capture="environment" data-qid="${q.qid}" class="photo-input" hidden />
        </label>
      </div>
    </div>
  </div>`;
}

function wireQuestionCards() {
  $app()
    .querySelectorAll("[data-toggle]")
    .forEach((el) =>
      el.addEventListener("click", () => {
        const qid = el.dataset.toggle;
        const card = document.getElementById(`card-${qid}`);
        const details = card.querySelector(".q-details");
        const isOpen = details.style.display !== "none";
        if (isOpen) {
          details.style.display = "none";
          card.classList.remove("expanded");
          expandedQids.delete(qid);
          card.querySelector(".q-toggle").textContent = "▸";
        } else {
          details.style.display = "";
          card.classList.add("expanded");
          expandedQids.add(qid);
          card.querySelector(".q-toggle").textContent = "▾";
        }
      })
    );

  $app()
    .querySelectorAll(".status-btn")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const qid = btn.dataset.qid;
        const status = btn.dataset.status;
        const a = getAnswer(qid);
        a.status = a.status === status ? null : status;
        if (a.status !== "non_conforme") {
          a.ncLieu = null;
          a.ncGravite = null;
        }
        if (a.status) expandedQids.add(qid);
        markDirty();
        rerenderCurrentQuestionView();
      })
    );

  $app()
    .querySelectorAll("[data-nclieu]")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const a = getAnswer(btn.dataset.qid);
        a.ncLieu = a.ncLieu === btn.dataset.nclieu ? null : btn.dataset.nclieu;
        markDirty();
        rerenderCurrentQuestionView();
      })
    );
  $app()
    .querySelectorAll("[data-ncgravite]")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const a = getAnswer(btn.dataset.qid);
        a.ncGravite = a.ncGravite === btn.dataset.ncgravite ? null : btn.dataset.ncgravite;
        markDirty();
        rerenderCurrentQuestionView();
      })
    );

  $app()
    .querySelectorAll(".comment-input")
    .forEach((ta) =>
      ta.addEventListener("input", () => {
        const a = getAnswer(ta.dataset.qid);
        a.comment = ta.value;
        markDirty();
      })
    );

  $app()
    .querySelectorAll(".photo-input")
    .forEach((input) =>
      input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const qid = input.dataset.qid;
        try {
          const dataUrl = await readAndCompressImage(file);
          getAnswer(qid).photos.push(dataUrl);
          markDirty();
          rerenderCurrentQuestionView();
        } catch (err) {
          alert(t("photo.loadError") + err.message);
        }
      })
    );

  $app()
    .querySelectorAll(".photo-del")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const a = getAnswer(btn.dataset.qid);
        a.photos.splice(Number(btn.dataset.photoIdx), 1);
        markDirty();
        rerenderCurrentQuestionView();
      })
    );

  $app()
    .querySelectorAll(".mic-btn")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const qid = btn.dataset.qid;
        const ta = $app().querySelector(`.comment-input[data-qid="${qid}"]`);
        toggleDictation(qid, ta, btn);
      })
    );
}

/* --------------------------------------------------------- dictée vocale */
const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let activeRecognition = null;
let activeMicQid = null;

function stopActiveRecognition() {
  if (activeRecognition) {
    try {
      activeRecognition.onend = null;
      activeRecognition.stop();
    } catch (e) {
      /* ignore */
    }
  }
  activeRecognition = null;
  activeMicQid = null;
}

function resetMicBtn(btn) {
  if (!btn) return;
  btn.classList.remove("listening");
  btn.textContent = t("mic.dictate");
}

function toggleDictation(qid, textareaEl, micBtnEl) {
  if (!SpeechRecognitionCtor) {
    alert(t("mic.notSupported"));
    return;
  }

  if (activeMicQid === qid) {
    stopActiveRecognition();
    resetMicBtn(micBtnEl);
    return;
  }

  if (activeMicQid && activeMicQid !== qid) {
    const prevBtn = $app().querySelector(`.mic-btn[data-qid="${activeMicQid}"]`);
    resetMicBtn(prevBtn);
  }
  stopActiveRecognition();

  const recog = new SpeechRecognitionCtor();
  recog.lang = (CURRENT_LANG || "fr") === "fr" ? "fr-FR" : CURRENT_LANG === "en" ? "en-GB" : CURRENT_LANG === "nl" ? "nl-NL" : "de-DE";
  recog.continuous = true;
  recog.interimResults = true;

  const baseText = textareaEl.value ? textareaEl.value.replace(/\s+$/, "") + " " : "";
  let finalText = "";

  recog.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += transcript + " ";
      else interim += transcript;
    }
    textareaEl.value = (baseText + finalText + interim).trim();
    const a = getAnswer(qid);
    a.comment = textareaEl.value;
    markDirty();
  };

  recog.onerror = (event) => {
    resetMicBtn(micBtnEl);
    activeRecognition = null;
    activeMicQid = null;
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      alert(t("mic.permissionDenied"));
    } else if (event.error === "network") {
      alert(t("mic.networkError"));
    } else if (event.error !== "no-speech" && event.error !== "aborted") {
      console.warn("Erreur dictée vocale :", event.error);
    }
  };

  recog.onend = () => {
    if (activeMicQid === qid) {
      resetMicBtn(micBtnEl);
      activeRecognition = null;
      activeMicQid = null;
    }
  };

  activeRecognition = recog;
  activeMicQid = qid;
  micBtnEl.classList.add("listening");
  micBtnEl.textContent = t("mic.stop");
  try {
    recog.start();
  } catch (e) {
    console.warn("Impossible de démarrer la dictée :", e);
    resetMicBtn(micBtnEl);
    activeRecognition = null;
    activeMicQid = null;
  }
}

function rerenderCurrentQuestionView() {
  const parts = location.hash.slice(1).split("/").filter(Boolean);
  if (parts[2] === "dept" && parts[4] === "sec") renderQuestions(parts[3], parts[5]);
}

function readAndCompressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => reject(new Error("image invalide"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("lecture fichier échouée"));
    reader.readAsDataURL(file);
  });
}

/* ============================================================ CONCLUSION */
function renderConclusion() {
  const global = computeGlobalScore();
  const scoreLabel = t("score." + global.score);
  const scoreText = { vert: t("conclusion.scoreVert"), orange: t("conclusion.scoreOrange"), rouge: t("conclusion.scoreRouge") }[global.score];

  const rows = AUDIT_DATA.departments
    .map((d) => {
      const b = global.byDept[d.id];
      const totalDept = b.parcStd + b.parcCrit + b.centraleStd + b.centraleCrit;
      return `
      <tr>
        <td>${d.icon} ${esc(DEPT_INDEX[d.id].name)}</td>
        <td class="num">${b.parcStd}</td>
        <td class="num crit">${b.parcCrit}</td>
        <td class="num">${b.centraleStd}</td>
        <td class="num crit">${b.centraleCrit}</td>
        <td class="num total">${totalDept}</td>
      </tr>`;
    })
    .join("");

  $app().innerHTML = `
    ${topBar({
      title: t("conclusion.title"),
      backHash: `#/audit/${CURRENT_AUDIT.id}`,
      right: `<button class="icon-btn" data-nav="#/audit/${CURRENT_AUDIT.id}/print" aria-label="${esc(t("conclusion.printAria"))}">🖨️</button>`,
    })}
    <main class="container">
      <div class="audit-summary">
        <div><strong>${esc(CURRENT_AUDIT.park)}</strong> · ${esc(CURRENT_AUDIT.auditor)} · ${esc(CURRENT_AUDIT.date)}</div>
      </div>

      <div class="score-banner score-${global.score}">
        <div class="score-label">${esc(t("conclusion.scoreLabel"))}</div>
        <div class="score-value">${scoreLabel}</div>
        <div class="score-text">${esc(scoreText)}</div>
        <div class="score-figures">
          <div><span>${global.totalParc}</span>${esc(t("conclusion.figTotal"))}</div>
          <div><span>${global.standardParc}</span>${esc(t("conclusion.figStandard"))}</div>
          <div><span>${global.critiqueParc}</span>${esc(t("conclusion.figCritique"))}</div>
        </div>
      </div>

      <h2 class="section-title">${esc(t("conclusion.byDept"))}</h2>
      <div class="table-wrap">
        <table class="nc-table">
          <thead>
            <tr>
              <th>${esc(t("table.dept"))}</th>
              <th>${esc(t("table.parcStd"))}</th>
              <th>${esc(t("table.parcCrit"))}</th>
              <th>${esc(t("table.centraleStd"))}</th>
              <th>${esc(t("table.centraleCrit"))}</th>
              <th>${esc(t("table.total"))}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <details class="methodo no-print">
        <summary>${esc(t("methodo.summary"))}</summary>
        <ul>
          <li>${t("methodo.b1")}</li>
          <li>${t("methodo.b2")}</li>
          <li>${t("methodo.b3")}</li>
          <li>${t("methodo.b4")}</li>
        </ul>
      </details>

      <button class="btn-primary lg no-print" data-nav="#/audit/${CURRENT_AUDIT.id}/print">${esc(t("conclusion.printReportBtn"))}</button>
    </main>`;
  wireNav();
}

/* =============================================================== PRINT */
let PRINT_MODE = "nc"; // nc | all

function renderPrint() {
  const global = computeGlobalScore();
  const scoreLabel = t("score." + global.score);

  const deptSections = AUDIT_DATA.departments
    .map((d) => {
      const b = global.byDept[d.id];
      let items = [];
      DEPT_INDEX[d.id].sections.forEach((s) => {
        s.questions.forEach((q) => {
          const a = CURRENT_AUDIT.answers[q.qid];
          if (!a || !a.status) return;
          if (PRINT_MODE === "nc" && a.status !== "non_conforme") return;
          items.push({ q, s, a });
        });
      });
      if (!items.length) return "";
      const rows = items
        .map(({ q, s, a }) => {
          const statusLabel = statusDefs().find((x) => x.key === a.status)?.label || a.status;
          const ncInfo = a.status === "non_conforme" ? `<span class="tag tag-${a.ncLieu || "?"}">${esc(a.ncLieu || "?")}</span> <span class="tag tag-${a.ncGravite || "?"}">${esc(a.ncGravite || "?")}</span>` : "";
          const photos = (a.photos || []).map((p) => `<img class="print-photo" src="${p}" />`).join("");
          return `
          <div class="print-item ${a.status === "non_conforme" ? "print-item-nc" : ""}">
            <div class="print-item-head">
              <span class="print-status status-${a.status}">${esc(statusLabel)}</span> ${ncInfo}
              <span class="print-section">${esc(s.name)}${q.group ? " › " + esc(q.group) : ""}</span>
            </div>
            <div class="print-item-text">${q.ref ? `<em>${esc(q.ref)}</em> — ` : ""}${esc(q.text)}</div>
            ${a.comment ? `<div class="print-item-comment">${esc(a.comment)}</div>` : ""}
            ${photos ? `<div class="print-photos">${photos}</div>` : ""}
          </div>`;
        })
        .join("");
      return `
      <div class="print-dept">
        <h3>${d.icon} ${esc(DEPT_INDEX[d.id].name)} — ${esc(t("print.ncParcLabel"))}: ${b.parcStd + b.parcCrit} (${b.parcCrit} ${esc(t("print.critiqueSuffix"))}) · ${esc(t("print.ncCentraleLabel"))}: ${b.centraleStd + b.centraleCrit}</h3>
        ${rows}
      </div>`;
    })
    .join("");

  const rows = AUDIT_DATA.departments
    .map((d) => {
      const b = global.byDept[d.id];
      const totalDept = b.parcStd + b.parcCrit + b.centraleStd + b.centraleCrit;
      return `<tr><td>${esc(DEPT_INDEX[d.id].name)}</td><td>${b.parcStd}</td><td>${b.parcCrit}</td><td>${b.centraleStd}</td><td>${b.centraleCrit}</td><td>${totalDept}</td></tr>`;
    })
    .join("");

  $app().innerHTML = `
    ${topBar({
      title: t("print.title"),
      backHash: `#/audit/${CURRENT_AUDIT.id}/conclusion`,
      right: `<button class="icon-btn" id="doPrintBtn" aria-label="${esc(t("print.printBtn"))}">🖨️</button>`,
    })}
    <main class="container print-toggle-bar no-print">
      <button class="chip ${PRINT_MODE === "nc" ? "active" : ""}" data-printmode="nc">${esc(t("print.modeNc"))}</button>
      <button class="chip ${PRINT_MODE === "all" ? "active" : ""}" data-printmode="all">${esc(t("print.modeAll"))}</button>
    </main>

    <main class="print-page">
      <div class="print-header">
        <h1>${esc(t("print.mainTitle"))}</h1>
        <table class="print-meta">
          <tr><td>${esc(t("print.park"))}</td><td>${esc(CURRENT_AUDIT.park)}</td><td>${esc(t("print.date"))}</td><td>${esc(CURRENT_AUDIT.date)}</td></tr>
          <tr><td>${esc(t("print.auditor"))}</td><td>${esc(CURRENT_AUDIT.auditor)}</td><td>${esc(t("print.generatedOn"))}</td><td>${fmtDate(Date.now())}</td></tr>
        </table>
      </div>

      <div class="print-score score-${global.score}">
        ${esc(t("print.scoreGlobal"))} <strong>${scoreLabel}</strong> — ${global.totalParc} ${esc(t("print.ncParcLabel"))} (${global.critiqueParc} ${esc(t("print.critiqueSuffix"))})
      </div>

      <table class="nc-table print-table">
        <thead><tr><th>${esc(t("table.dept"))}</th><th>${esc(t("table.parcStd"))}</th><th>${esc(t("table.parcCrit"))}</th><th>${esc(t("table.centraleStd"))}</th><th>${esc(t("table.centraleCrit"))}</th><th>${esc(t("table.total"))}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>

      <h2>${esc(t("print.detailTitle"))}</h2>
      ${deptSections || `<p class="muted">${esc(t("print.noneToShow"))}</p>`}
    </main>`;

  wireNav();
  document.getElementById("doPrintBtn").addEventListener("click", () => window.print());
  $app()
    .querySelectorAll("[data-printmode]")
    .forEach((b) =>
      b.addEventListener("click", () => {
        PRINT_MODE = b.dataset.printmode;
        renderPrint();
      })
    );
}

/* ============================================================ nav wire */
function wireNav() {
  $app()
    .querySelectorAll("[data-nav]")
    .forEach((el) =>
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        navigate(el.dataset.nav);
      })
    );
}
