/* ============================================================================
   COUCHE DE STOCKAGE LOCAL (IndexedDB) — fonctionne 100% hors-ligne
   ========================================================================== */

const DB_NAME = "hsse_audit_db";
const DB_VERSION = 1;
const STORE_AUDITS = "audits";

let _dbPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_AUDITS)) {
        const store = db.createObjectStore(STORE_AUDITS, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
  return _dbPromise;
}

async function dbSaveAudit(audit) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AUDITS, "readwrite");
    tx.objectStore(STORE_AUDITS).put(audit);
    tx.oncomplete = () => resolve(audit);
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function dbGetAudit(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AUDITS, "readonly");
    const req = tx.objectStore(STORE_AUDITS).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function dbGetAllAudits() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AUDITS, "readonly");
    const req = tx.objectStore(STORE_AUDITS).getAll();
    req.onsuccess = () => {
      const all = req.result || [];
      all.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      resolve(all);
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

async function dbDeleteAudit(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AUDITS, "readwrite");
    tx.objectStore(STORE_AUDITS).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

/* Fallback storage (localStorage) si IndexedDB est indisponible
   (certains navigateurs en navigation privée stricte). */
const LS_FALLBACK_KEY = "hsse_audit_fallback_v1";
let _useFallback = false;

function _lsReadAll() {
  try {
    return JSON.parse(localStorage.getItem(LS_FALLBACK_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function _lsWriteAll(obj) {
  localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(obj));
}

async function checkStorageAvailability() {
  try {
    await openDB();
    _useFallback = false;
  } catch (e) {
    console.warn("IndexedDB indisponible, bascule sur localStorage", e);
    _useFallback = true;
  }
}

async function saveAudit(audit) {
  audit.updatedAt = Date.now();
  if (_useFallback) {
    const all = _lsReadAll();
    all[audit.id] = audit;
    _lsWriteAll(all);
    return audit;
  }
  try {
    return await dbSaveAudit(audit);
  } catch (e) {
    _useFallback = true;
    const all = _lsReadAll();
    all[audit.id] = audit;
    _lsWriteAll(all);
    return audit;
  }
}

async function getAudit(id) {
  if (_useFallback) {
    const all = _lsReadAll();
    return all[id] || null;
  }
  try {
    return await dbGetAudit(id);
  } catch (e) {
    _useFallback = true;
    const all = _lsReadAll();
    return all[id] || null;
  }
}

async function getAllAudits() {
  if (_useFallback) {
    const all = _lsReadAll();
    return Object.values(all).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }
  try {
    return await dbGetAllAudits();
  } catch (e) {
    _useFallback = true;
    const all = _lsReadAll();
    return Object.values(all).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }
}

async function deleteAudit(id) {
  if (_useFallback) {
    const all = _lsReadAll();
    delete all[id];
    _lsWriteAll(all);
    return;
  }
  try {
    return await dbDeleteAudit(id);
  } catch (e) {
    _useFallback = true;
    const all = _lsReadAll();
    delete all[id];
    _lsWriteAll(all);
  }
}
