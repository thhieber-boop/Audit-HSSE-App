/* ============================================================================
   MODE ADMINISTRATEUR (Niveau A — local, sans backend)
   Permet d'éditer/ajouter/désactiver des questions, avec textes multilingues
   optionnels. Stocké dans localStorage, indépendant des audits.
   ⚠ Le code d'accès est une protection locale simple, PAS un dispositif de
   sécurité réel (cf. échanges avec l'utilisateur sur le point 3 / API).
   ========================================================================== */

const ADMIN_KEY = "hsse_admin_overrides";
let ADMIN_UNLOCKED = false;

function defaultAdminOverrides() {
  return { version: 1, pin: null, edits: {}, added: [] };
}
function getAdminOverrides() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return defaultAdminOverrides();
    const parsed = JSON.parse(raw);
    return { ...defaultAdminOverrides(), ...parsed, edits: parsed.edits || {}, added: parsed.added || [] };
  } catch (e) {
    return defaultAdminOverrides();
  }
}
function saveAdminOverrides(ov) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(ov));
}
function adminCustomId() {
  return "custom-" + Math.random().toString(36).slice(2, 10);
}
function adminEditedCount(overrides) {
  return Object.keys(overrides.edits).filter((k) => {
    const e = overrides.edits[k];
    return e && (e.t || e.active === false || e.g !== undefined || e.ref !== undefined);
  }).length;
}

/* ------------------------------------------------------------- gate */
function renderAdminGate() {
  const overrides = getAdminOverrides();
  const isSetting = !overrides.pin;
  $app().innerHTML = `
    ${topBar({ title: t("admin.entry"), backHash: "#/" })}
    <main class="container narrow">
      <p class="admin-warning">${esc(t("admin.gateWarning"))}</p>
      <form id="adminGateForm" class="form-card">
        <label>${esc(isSetting ? t("admin.gateTitleSet") : t("admin.gateTitleEnter"))}
          <input type="password" name="pin" required minlength="4" placeholder="${esc(t("admin.gatePinLabel"))}" autocomplete="off" />
        </label>
        <button type="submit" class="btn-primary lg">${esc(isSetting ? t("admin.gateSetBtn") : t("admin.gateEnterBtn"))}</button>
      </form>
      <p class="admin-error" id="adminGateError" style="display:none"></p>
    </main>`;
  wireNav();
  document.getElementById("adminGateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const pin = fd.get("pin");
    const errEl = document.getElementById("adminGateError");
    if (isSetting) {
      if (pin.length < 4) {
        errEl.textContent = t("admin.gatePinTooShort");
        errEl.style.display = "";
        return;
      }
      overrides.pin = pin;
      saveAdminOverrides(overrides);
      ADMIN_UNLOCKED = true;
      route();
    } else if (pin === overrides.pin) {
      ADMIN_UNLOCKED = true;
      route();
    } else {
      errEl.textContent = t("admin.gateWrongPin");
      errEl.style.display = "";
    }
  });
}

/* ------------------------------------------------------------- home */
function renderAdminHome() {
  const overrides = getAdminOverrides();
  const customCount = overrides.added.length;
  const editedCount = adminEditedCount(overrides);
  const cards = AUDIT_DATA.departments
    .map((d) => {
      const name = resolveDeptName(d, CURRENT_LANG);
      return `
      <div class="card dept-card" data-nav="#/admin/dept/${d.id}">
        <div class="dept-icon">${d.icon}</div>
        <div class="dept-card-body"><div class="dept-card-title">${esc(name)}</div></div>
        <div class="chev">›</div>
      </div>`;
    })
    .join("");

  $app().innerHTML = `
    ${topBar({ title: t("admin.homeTitle"), backHash: "#/" })}
    <main class="container">
      <p class="muted">${esc(t("admin.homeSubtitle"))}</p>
      ${
        customCount || editedCount
          ? `<div class="admin-stats">${esc(t("admin.customBadge", { n: customCount }))} · ${esc(t("admin.editedBadge", { n: editedCount }))}</div>`
          : ""
      }
      <div class="dept-grid">${cards}</div>
      <div class="admin-actions">
        <button class="btn-ghost" id="adminExportBtn">${esc(t("admin.export"))}</button>
        <label class="btn-ghost">${esc(t("admin.import"))}<input type="file" id="adminImportFile" accept="application/json" hidden /></label>
        <button class="btn-ghost danger" id="adminResetBtn">${esc(t("admin.reset"))}</button>
        <button class="btn-ghost" id="adminExitBtn">${esc(t("admin.exit"))}</button>
      </div>
    </main>`;
  wireNav();
  document.getElementById("adminExportBtn").addEventListener("click", exportAdminOverrides);
  document.getElementById("adminImportFile").addEventListener("change", handleAdminImport);
  document.getElementById("adminResetBtn").addEventListener("click", () => {
    if (confirm(t("admin.resetConfirm"))) {
      const ov = getAdminOverrides();
      saveAdminOverrides({ ...defaultAdminOverrides(), pin: ov.pin });
      buildIndex();
      renderAdminHome();
    }
  });
  document.getElementById("adminExitBtn").addEventListener("click", () => {
    ADMIN_UNLOCKED = false;
    navigate("#/");
  });
}

function exportAdminOverrides() {
  const ov = getAdminOverrides();
  const exportable = { version: ov.version, edits: ov.edits, added: ov.added };
  const blob = new Blob([JSON.stringify(exportable, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hsse-admin-config_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function handleAdminImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (!confirm(t("admin.importConfirm"))) return;
    const current = getAdminOverrides();
    saveAdminOverrides({ version: 1, pin: current.pin, edits: data.edits || {}, added: data.added || [] });
    buildIndex();
    alert(t("admin.importSuccess"));
    renderAdminHome();
  } catch (err) {
    alert(t("admin.importError") + err.message);
  }
  e.target.value = "";
}

/* ---------------------------------------------------------- sections */
function renderAdminSections(deptId) {
  const dept = ADMIN_DEPT_INDEX[deptId];
  const cards = dept.sections
    .map(
      (s) => `
      <div class="card section-card" data-nav="#/admin/dept/${deptId}/sec/${s.id}">
        <div class="section-card-body">
          <div class="dept-card-title">${esc(s.name)}</div>
          <div class="dept-card-meta">${esc(t("admin.qCount", { n: s.questions.length }))}</div>
        </div>
        <div class="chev">›</div>
      </div>`
    )
    .join("");

  $app().innerHTML = `
    ${topBar({ title: dept.name, backHash: "#/admin" })}
    <main class="container">
      <h2 class="section-title">${esc(t("admin.sectionsTitle"))}</h2>
      ${cards}
    </main>`;
  wireNav();
}

/* --------------------------------------------------------- questions */
function renderAdminQuestions(deptId, sectionId) {
  const dept = ADMIN_DEPT_INDEX[deptId];
  const section = dept.sections.find((s) => s.id === sectionId);

  let lastGroup = null;
  const itemsHtml = section.questions
    .map((q) => {
      let groupHeader = "";
      if (q.group && q.group !== lastGroup) {
        groupHeader = `<div class="group-header">${esc(q.group)}</div>`;
        lastGroup = q.group;
      } else if (!q.group) {
        lastGroup = null;
      }
      return groupHeader + adminQuestionCardHtml(q);
    })
    .join("");

  $app().innerHTML = `
    ${topBar({ title: section.name, backHash: `#/admin/dept/${deptId}` })}
    <main class="container">
      <div class="question-list">${itemsHtml}</div>
      <div id="adminAddFormContainer" class="admin-q-form" style="display:none"></div>
      <button class="btn-primary lg" id="adminAddQBtn">${esc(t("admin.qAdd"))}</button>
    </main>`;
  wireNav();
  wireAdminQuestionCards(deptId, sectionId);
  document.getElementById("adminAddQBtn").addEventListener("click", () => openAdminQuestionForm(deptId, sectionId, null));
}

function adminQuestionCardHtml(q) {
  const overrides = getAdminOverrides();
  const edit = overrides.edits[q.qid];
  const inactive = q.inactive;
  const tags = [
    q.isCustom ? `<span class="tag admin-tag-custom">${esc(t("admin.customTag"))}</span>` : "",
    !q.isCustom && edit && (edit.t || edit.g !== undefined || edit.ref !== undefined) ? `<span class="tag admin-tag-edited">${esc(t("admin.editedTag"))}</span>` : "",
    inactive ? `<span class="tag admin-tag-inactive">${esc(t("admin.inactiveTag"))}</span>` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
  <div class="q-card admin-q-card" id="admin-card-${q.qid}">
    <div class="q-card-head">
      <div class="q-text">${q.ref ? `<span class="q-ref">${esc(q.ref)}</span>` : ""}${tags ? tags + " " : ""}${esc(q.text)}</div>
    </div>
    <div class="admin-q-actions">
      <button type="button" class="btn-ghost sm" data-admin-edit="${q.qid}">${esc(t("admin.qEdit"))}</button>
      ${
        q.isCustom
          ? `<button type="button" class="btn-ghost sm danger" data-admin-delete="${q.qid}">${esc(t("admin.qDelete"))}</button>`
          : `<button type="button" class="btn-ghost sm" data-admin-toggle="${q.qid}">${esc(inactive ? t("admin.qActivate") : t("admin.qDeactivate"))}</button>`
      }
    </div>
    <div class="admin-q-form" id="admin-form-${q.qid}" style="display:none"></div>
  </div>`;
}

function wireAdminQuestionCards(deptId, sectionId) {
  $app()
    .querySelectorAll("[data-admin-edit]")
    .forEach((btn) => btn.addEventListener("click", () => openAdminQuestionForm(deptId, sectionId, btn.dataset.adminEdit)));

  $app()
    .querySelectorAll("[data-admin-toggle]")
    .forEach((btn) =>
      btn.addEventListener("click", () => {
        const qid = btn.dataset.adminToggle;
        const ov = getAdminOverrides();
        if (!ov.edits[qid]) ov.edits[qid] = {};
        ov.edits[qid].active = ov.edits[qid].active === false ? true : false;
        saveAdminOverrides(ov);
        buildIndex();
        renderAdminQuestions(deptId, sectionId);
      })
    );

  $app()
    .querySelectorAll("[data-admin-delete]")
    .forEach((btn) =>
      btn.addEventListener("click", () => {
        if (!confirm(t("admin.qDeleteConfirm"))) return;
        const qid = btn.dataset.adminDelete;
        const ov = getAdminOverrides();
        ov.added = ov.added.filter((cq) => cq.id !== qid);
        delete ov.edits[qid];
        saveAdminOverrides(ov);
        buildIndex();
        renderAdminQuestions(deptId, sectionId);
      })
    );
}

function adminFormHtml(qid, existing) {
  const t4 = (existing && existing.t) || {};
  return `
    <div class="form-card admin-inline-form">
      <label>${esc(t("admin.formTextFr"))}<textarea data-f="fr" required>${esc(t4.fr || "")}</textarea></label>
      <label>${esc(t("admin.formTextEn"))}<textarea data-f="en">${esc(t4.en || "")}</textarea></label>
      <label>${esc(t("admin.formTextNl"))}<textarea data-f="nl">${esc(t4.nl || "")}</textarea></label>
      <label>${esc(t("admin.formTextDe"))}<textarea data-f="de">${esc(t4.de || "")}</textarea></label>
      <label>${esc(t("admin.formRef"))}<input type="text" data-f="ref" value="${esc((existing && existing.ref) || "")}" /></label>
      <label>${esc(t("admin.formGroup"))}<input type="text" data-f="group" value="${esc((existing && existing.g) || "")}" /></label>
      <p class="admin-hint">${esc(t("admin.formHint"))}</p>
      <div class="admin-form-actions">
        <button type="button" class="btn-primary" data-admin-save="1">${esc(t("admin.formSave"))}</button>
        <button type="button" class="btn-ghost" data-admin-cancel="1">${esc(t("admin.formCancel"))}</button>
      </div>
    </div>`;
}

function openAdminQuestionForm(deptId, sectionId, qid) {
  const ov = getAdminOverrides();
  let container;
  let existing = null;

  if (qid) {
    container = document.getElementById(`admin-form-${qid}`);
    const q = ADMIN_FLAT_QUESTIONS.find((x) => x.qid === qid);
    if (q.isCustom) {
      const cq = ov.added.find((c) => c.id === qid);
      existing = { t: cq.t, ref: cq.ref, g: cq.g };
    } else {
      const edit = ov.edits[qid] || {};
      const idx = Number(qid.split("__")[2]);
      const baseQ = AUDIT_DATA.departments.find((d) => d.id === deptId).sections.find((s) => s.id === sectionId).questions[idx];
      existing = {
        t: { fr: (edit.t && edit.t.fr) || baseQ.t, en: edit.t && edit.t.en, nl: edit.t && edit.t.nl, de: edit.t && edit.t.de },
        ref: edit.ref !== undefined ? edit.ref : baseQ.r,
        g: edit.g !== undefined ? edit.g : baseQ.g,
      };
    }
  } else {
    container = document.getElementById("adminAddFormContainer");
  }

  container.innerHTML = adminFormHtml(qid, existing);
  container.style.display = "";
  wireAdminForm(container, deptId, sectionId, qid);
  container.scrollIntoView({ behavior: "smooth", block: "center" });
}

function wireAdminForm(container, deptId, sectionId, qid) {
  container.querySelector("[data-admin-save]").addEventListener("click", () => {
    const get = (f) => container.querySelector(`[data-f="${f}"]`).value.trim();
    const frText = get("fr");
    if (!frText) {
      container.querySelector('[data-f="fr"]').focus();
      return;
    }
    const tBundle = { fr: frText, en: get("en"), nl: get("nl"), de: get("de") };
    const ref = get("ref");
    const group = get("group");
    const ov = getAdminOverrides();

    if (qid) {
      const q = ADMIN_FLAT_QUESTIONS.find((x) => x.qid === qid);
      if (q.isCustom) {
        const cq = ov.added.find((c) => c.id === qid);
        cq.t = tBundle;
        cq.ref = ref || null;
        cq.g = group || null;
      } else {
        if (!ov.edits[qid]) ov.edits[qid] = {};
        ov.edits[qid].t = tBundle;
        ov.edits[qid].ref = ref || null;
        ov.edits[qid].g = group || null;
      }
    } else {
      ov.added.push({ id: adminCustomId(), deptId, sectionId, t: tBundle, ref: ref || null, g: group || null, active: true, createdAt: Date.now() });
    }
    saveAdminOverrides(ov);
    buildIndex();
    renderAdminQuestions(deptId, sectionId);
  });

  container.querySelector("[data-admin-cancel]").addEventListener("click", () => {
    container.style.display = "none";
    container.innerHTML = "";
  });
}
