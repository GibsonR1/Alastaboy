/* ============================================================
   storage.js — localStorage data layer for FunnelForge
   Schema:
     funnelforge.funnels = [Funnel]
     funnelforge.settings = { ... }
   ============================================================ */

const STORE_KEY = 'funnelforge.funnels';
const SETTINGS_KEY = 'funnelforge.settings';

const Storage = {

    /* ---------- low-level ---------- */
    _read() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Storage read failed:', e);
            return [];
        }
    },
    _write(funnels) {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(funnels));
            return true;
        } catch (e) {
            console.error('Storage write failed:', e);
            return false;
        }
    },

    /* ---------- ids ---------- */
    uid(prefix = 'id') {
        return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    },

    /* ---------- funnels ---------- */
    listFunnels() {
        return this._read().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    },

    getFunnel(id) {
        return this._read().find(f => f.id === id) || null;
    },

    createFunnel(name = 'Untitled Funnel', initialPages = null) {
        const funnels = this._read();
        const now = Date.now();
        const funnel = {
            id: this.uid('fnl'),
            name,
            createdAt: now,
            updatedAt: now,
            pages: initialPages || [this._defaultPage('Landing', 'landing')]
        };
        funnels.push(funnel);
        this._write(funnels);
        return funnel;
    },

    updateFunnel(id, patch) {
        const funnels = this._read();
        const idx = funnels.findIndex(f => f.id === id);
        if (idx === -1) return null;
        funnels[idx] = { ...funnels[idx], ...patch, updatedAt: Date.now() };
        this._write(funnels);
        return funnels[idx];
    },

    deleteFunnel(id) {
        const funnels = this._read().filter(f => f.id !== id);
        this._write(funnels);
    },

    duplicateFunnel(id) {
        const f = this.getFunnel(id);
        if (!f) return null;
        const clone = JSON.parse(JSON.stringify(f));
        clone.id = this.uid('fnl');
        clone.name = f.name + ' (Copy)';
        clone.createdAt = Date.now();
        clone.updatedAt = Date.now();
        clone.pages = clone.pages.map(p => ({
            ...p,
            id: this.uid('pg'),
            blocks: p.blocks.map(b => ({ ...b, id: this.uid('blk') }))
        }));
        const funnels = this._read();
        funnels.push(clone);
        this._write(funnels);
        return clone;
    },

    /* ---------- pages ---------- */
    _defaultPage(name, type) {
        return {
            id: this.uid('pg'),
            name,
            type,
            settings: { bg: '#0a0a0c', textColor: '#f5f5f7', maxWidth: 720 },
            blocks: []
        };
    },

    addPage(funnelId, name = 'New Page', type = 'landing') {
        const f = this.getFunnel(funnelId);
        if (!f) return null;
        const page = this._defaultPage(name, type);
        f.pages.push(page);
        this.updateFunnel(funnelId, { pages: f.pages });
        return page;
    },

    getPage(funnelId, pageId) {
        const f = this.getFunnel(funnelId);
        return f ? f.pages.find(p => p.id === pageId) || null : null;
    },

    updatePage(funnelId, pageId, patch) {
        const f = this.getFunnel(funnelId);
        if (!f) return null;
        const idx = f.pages.findIndex(p => p.id === pageId);
        if (idx === -1) return null;
        f.pages[idx] = { ...f.pages[idx], ...patch };
        this.updateFunnel(funnelId, { pages: f.pages });
        return f.pages[idx];
    },

    deletePage(funnelId, pageId) {
        const f = this.getFunnel(funnelId);
        if (!f) return;
        f.pages = f.pages.filter(p => p.id !== pageId);
        this.updateFunnel(funnelId, { pages: f.pages });
    },

    reorderPages(funnelId, fromIdx, toIdx) {
        const f = this.getFunnel(funnelId);
        if (!f) return;
        const [moved] = f.pages.splice(fromIdx, 1);
        f.pages.splice(toIdx, 0, moved);
        this.updateFunnel(funnelId, { pages: f.pages });
    },

    /* ---------- query params helper ---------- */
    qp(name) {
        return new URLSearchParams(location.search).get(name);
    },

    /* ---------- export / import ---------- */
    exportAll() {
        return JSON.stringify({
            version: 1,
            funnels: this._read(),
            exportedAt: new Date().toISOString()
        }, null, 2);
    },

    importAll(json) {
        try {
            const data = JSON.parse(json);
            if (!data.funnels || !Array.isArray(data.funnels)) throw new Error('Invalid format');
            this._write(data.funnels);
            return true;
        } catch (e) {
            console.error('Import failed:', e);
            return false;
        }
    },

    clearAll() {
        localStorage.removeItem(STORE_KEY);
    }
};

/* ============================================================
   Toast utility (used app-wide)
   ============================================================ */
function toast(message, type = 'default', duration = 2600) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
        el.classList.add('removing');
        setTimeout(() => el.remove(), 260);
    }, duration);
}

/* ============================================================
   Simple modal helper
     modal({ title, body, confirmText, cancelText }).then(ok => ...)
   ============================================================ */
function modalPrompt({ title, body, placeholder = '', defaultValue = '', confirmText = 'OK', cancelText = 'Cancel', type = 'text' }) {
    return new Promise(resolve => {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="modal" role="dialog">
                <h3>${escapeHtml(title)}</h3>
                ${body ? `<p>${escapeHtml(body)}</p>` : ''}
                ${type === 'text' ? `<input class="input" id="modalInput" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(defaultValue)}">` : ''}
                <div class="modal-actions">
                    <button class="btn btn-ghost btn-sm" data-action="cancel">${escapeHtml(cancelText)}</button>
                    <button class="btn btn-accent btn-sm" data-action="confirm">${escapeHtml(confirmText)}</button>
                </div>
            </div>`;
        document.body.appendChild(backdrop);
        requestAnimationFrame(() => backdrop.classList.add('active'));

        const input = backdrop.querySelector('#modalInput');
        if (input) { input.focus(); input.select(); }

        const close = (result) => {
            backdrop.classList.remove('active');
            setTimeout(() => backdrop.remove(), 260);
            resolve(result);
        };

        backdrop.querySelector('[data-action="cancel"]').onclick = () => close(null);
        backdrop.querySelector('[data-action="confirm"]').onclick = () => close(input ? input.value : true);
        backdrop.addEventListener('click', e => { if (e.target === backdrop) close(null); });
        backdrop.addEventListener('keydown', e => {
            if (e.key === 'Enter') close(input ? input.value : true);
            if (e.key === 'Escape') close(null);
        });
    });
}

function modalConfirm({ title, body, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) {
    return new Promise(resolve => {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="modal" role="dialog">
                <h3>${escapeHtml(title)}</h3>
                ${body ? `<p>${escapeHtml(body)}</p>` : ''}
                <div class="modal-actions">
                    <button class="btn btn-ghost btn-sm" data-action="cancel">${escapeHtml(cancelText)}</button>
                    <button class="btn ${danger ? 'btn-danger' : 'btn-accent'} btn-sm" data-action="confirm">${escapeHtml(confirmText)}</button>
                </div>
            </div>`;
        document.body.appendChild(backdrop);
        requestAnimationFrame(() => backdrop.classList.add('active'));

        const close = (result) => {
            backdrop.classList.remove('active');
            setTimeout(() => backdrop.remove(), 260);
            resolve(result);
        };
        backdrop.querySelector('[data-action="cancel"]').onclick = () => close(false);
        backdrop.querySelector('[data-action="confirm"]').onclick = () => close(true);
        backdrop.addEventListener('click', e => { if (e.target === backdrop) close(false); });
        document.addEventListener('keydown', function onKey(e) {
            if (e.key === 'Escape') { close(false); document.removeEventListener('keydown', onKey); }
        });
    });
}

function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function fmtDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60_000) return 'just now';
    if (diff < 3600_000) return Math.floor(diff / 60_000) + 'm ago';
    if (diff < 86400_000) return Math.floor(diff / 3600_000) + 'h ago';
    if (diff < 604800_000) return Math.floor(diff / 86400_000) + 'd ago';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
