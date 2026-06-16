/* ============================================================
   editor.js — Drag-and-drop page editor (advanced)
   ============================================================ */

(() => {

const funnelId = Storage.qp('funnel');
const pageId = Storage.qp('page');
const root = document.getElementById('editorRoot');

if (!funnelId || !pageId) {
    root.innerHTML = `<div style="padding:80px 24px;text-align:center"><h2>Missing funnel or page</h2><a class="btn btn-accent" href="dashboard.html">Back to dashboard</a></div>`;
    return;
}

let funnel = Storage.getFunnel(funnelId);
let page = Storage.getPage(funnelId, pageId);

if (!funnel || !page) {
    root.innerHTML = `<div style="padding:80px 24px;text-align:center"><h2>Page not found</h2><a class="btn btn-accent" href="dashboard.html">Back to dashboard</a></div>`;
    return;
}

let selectedId = null;
let device = 'desktop';
let activeTab = 'content'; // 'content' | 'style' | 'page'
let paletteQuery = '';
let saveTimer = null;
let historyTimer = null;

/* ---------- Undo/redo ---------- */
const HISTORY_MAX = 60;
let history = [];
let historyIdx = -1;

function snapshot() {
    return JSON.parse(JSON.stringify({
        name: page.name,
        type: page.type,
        settings: page.settings,
        blocks: page.blocks
    }));
}

function pushHistory(immediate = false) {
    clearTimeout(historyTimer);
    const doPush = () => {
        // Drop any "redo" branch
        history = history.slice(0, historyIdx + 1);
        history.push(snapshot());
        if (history.length > HISTORY_MAX) history.shift();
        historyIdx = history.length - 1;
        updateUndoRedoState();
    };
    if (immediate) doPush();
    else historyTimer = setTimeout(doPush, 500);
}

function applySnapshot(snap) {
    page.name = snap.name;
    page.type = snap.type;
    page.settings = JSON.parse(JSON.stringify(snap.settings || {}));
    page.blocks = JSON.parse(JSON.stringify(snap.blocks || []));
}

function undo() {
    if (historyIdx <= 0) return;
    historyIdx -= 1;
    applySnapshot(history[historyIdx]);
    Storage.updatePage(funnelId, pageId, page);
    renderShell();
    flashSaved();
    toast('Undone', 'default', 1200);
}

function redo() {
    if (historyIdx >= history.length - 1) return;
    historyIdx += 1;
    applySnapshot(history[historyIdx]);
    Storage.updatePage(funnelId, pageId, page);
    renderShell();
    flashSaved();
    toast('Redone', 'default', 1200);
}

function updateUndoRedoState() {
    const u = document.getElementById('undoBtn');
    const r = document.getElementById('redoBtn');
    if (u) u.disabled = historyIdx <= 0;
    if (r) r.disabled = historyIdx >= history.length - 1;
    if (u) u.classList.toggle('disabled', u.disabled);
    if (r) r.classList.toggle('disabled', r.disabled);
}

/* ---------- Helpers for nested prop paths ---------- */
function setProp(target, path, value) {
    const keys = path.split('.');
    let o = target;
    for (let i = 0; i < keys.length - 1; i++) {
        if (o[keys[i]] == null || typeof o[keys[i]] !== 'object') o[keys[i]] = {};
        o = o[keys[i]];
    }
    o[keys[keys.length - 1]] = value;
}
function getProp(target, path) {
    const keys = path.split('.');
    let o = target;
    for (const k of keys) {
        if (o == null) return undefined;
        o = o[k];
    }
    return o;
}

/* ============================================================
   SHELL
   ============================================================ */
function renderShell() {
    root.innerHTML = `
        <div class="editor-bar">
            <div class="bar-section">
                <a class="bar-back" href="builder.html?funnel=${funnelId}" title="Back to funnel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back
                </a>
                <div class="bar-divider"></div>
                <input class="page-name-input" id="pageNameInput" value="${escapeHtml(page.name)}">
                <div class="save-status" id="saveStatus"><div class="dot"></div><span>Saved</span></div>
            </div>
            <div class="bar-section">
                <button class="bar-icon-btn" id="undoBtn" title="Undo (Ctrl+Z)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6M3 13a9 9 0 109-6"/></svg>
                </button>
                <button class="bar-icon-btn" id="redoBtn" title="Redo (Ctrl+Shift+Z)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6M21 13a9 9 0 11-9-6"/></svg>
                </button>
                <div class="bar-divider"></div>
                <div class="device-toggle" id="deviceToggle">
                    <button data-d="desktop" class="${device === 'desktop' ? 'active' : ''}" title="Desktop">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                    </button>
                    <button data-d="tablet" class="${device === 'tablet' ? 'active' : ''}" title="Tablet">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                    </button>
                    <button data-d="mobile" class="${device === 'mobile' ? 'active' : ''}" title="Mobile">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                    </button>
                </div>
                <div class="bar-divider"></div>
                <button class="btn btn-ghost btn-sm" id="shortcutsBtn" title="Keyboard shortcuts (?)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M7 10h0M11 10h0M15 10h0M7 14h10"/></svg>
                </button>
                <a class="btn btn-ghost btn-sm" href="preview.html?funnel=${funnelId}&page=${pageId}" target="_blank">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Preview
                </a>
                <button class="btn btn-accent btn-sm" id="publishBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Publish
                </button>
            </div>
        </div>
        <div class="editor-main">
            <aside class="palette" id="palette"></aside>
            <div class="canvas-wrap" id="canvasWrap">
                <div class="canvas device-desktop" id="canvas"></div>
            </div>
            <aside class="props" id="props"></aside>
        </div>`;

    renderPalette();
    renderCanvas();
    renderProps();
    attachShellHandlers();
    applyPageStyles();
    updateUndoRedoState();
}

/* ============================================================
   PALETTE (with search)
   ============================================================ */
function renderPalette() {
    const el = document.getElementById('palette');
    const q = paletteQuery.trim().toLowerCase();

    const filtered = BLOCK_CATEGORIES.map(cat => ({
        ...cat,
        blocks: cat.blocks.filter(t => {
            if (!q) return true;
            const b = Blocks[t];
            return b && (b.label.toLowerCase().includes(q) || b.type.toLowerCase().includes(q));
        })
    })).filter(cat => cat.blocks.length > 0);

    const blocksHtml = filtered.length === 0
        ? `<div style="padding:32px 16px;text-align:center;color:var(--text-muted);font-size:13px">No blocks match &ldquo;${escapeHtml(paletteQuery)}&rdquo;</div>`
        : filtered.map(cat => `
            <h4>${cat.label}</h4>
            <div class="palette-grid">
                ${cat.blocks.map(t => {
                    const b = Blocks[t];
                    return `<div class="palette-block" draggable="true" data-add="${t}" title="Drag onto canvas">
                        ${b.icon}
                        <div>${b.label}</div>
                    </div>`;
                }).join('')}
            </div>
        `).join('');

    el.innerHTML = `
        <div class="palette-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input type="text" id="paletteSearch" placeholder="Search blocks..." value="${escapeHtml(paletteQuery)}">
        </div>
        ${blocksHtml}
        <div class="palette-tip">
            <strong>Tips:</strong>
            <div style="margin-top:6px">&middot; Drag a block onto the canvas</div>
            <div>&middot; Click to edit properties</div>
            <div>&middot; <strong>Del</strong> removes, <strong>Ctrl+D</strong> duplicates</div>
            <div>&middot; <strong>Ctrl+Z</strong> undo, <strong>Ctrl+Shift+Z</strong> redo</div>
        </div>`;

    el.querySelectorAll('.palette-block').forEach(b => {
        b.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/ff-add', b.dataset.add);
            b.classList.add('dragging');
        });
        b.addEventListener('dragend', () => b.classList.remove('dragging'));
    });

    const searchInput = document.getElementById('paletteSearch');
    searchInput.addEventListener('input', e => {
        paletteQuery = e.target.value;
        const saved = e.target.selectionStart;
        renderPalette();
        const newInput = document.getElementById('paletteSearch');
        if (newInput) { newInput.focus(); newInput.setSelectionRange(saved, saved); }
    });
}

/* ============================================================
   CANVAS
   ============================================================ */
function renderCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.className = `canvas device-${device}`;
    applyPageStyles();

    if (!page.blocks || page.blocks.length === 0) {
        canvas.innerHTML = `
            <div class="canvas-empty">
                <div class="canvas-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <h3>Drag a block here</h3>
                <p>Pull blocks from the left panel onto this canvas to start designing your page.</p>
            </div>`;
        attachCanvasDropZones(canvas);
        return;
    }

    const parts = ['<div class="drop-zone" data-idx="0"></div>'];
    page.blocks.forEach((block, idx) => {
        const def = Blocks[block.type];
        const isSel = block.id === selectedId;
        parts.push(`
            <div class="block-wrap ${isSel ? 'selected' : ''}" data-id="${block.id}" data-idx="${idx}" draggable="true">
                <div class="block-label">${def?.label || block.type}</div>
                <div class="block-toolbar">
                    <button data-act="up" title="Move up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg></button>
                    <button data-act="down" title="Move down"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
                    <button data-act="dup" title="Duplicate"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
                    <button data-act="del" class="danger" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg></button>
                </div>
                <div class="block-content">${renderBlock(block)}</div>
            </div>`);
        parts.push(`<div class="drop-zone" data-idx="${idx + 1}"></div>`);
    });
    canvas.innerHTML = parts.join('');

    startCountdowns(canvas);
    startAnimations(canvas);
    attachBlockHandlers(canvas);
    attachCanvasDropZones(canvas);
}

function attachBlockHandlers(canvas) {
    canvas.querySelectorAll('.block-wrap').forEach(wrap => {
        const id = wrap.dataset.id;

        wrap.addEventListener('click', e => {
            if (e.target.closest('.block-toolbar')) return;
            e.preventDefault();
            selectBlock(id);
        });

        wrap.addEventListener('dragstart', e => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/ff-move', id);
            wrap.classList.add('dragging');
            e.dataTransfer.setDragImage(wrap, 20, 20);
        });
        wrap.addEventListener('dragend', () => wrap.classList.remove('dragging'));

        wrap.querySelectorAll('.block-toolbar button').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const act = btn.dataset.act;
                const idx = page.blocks.findIndex(b => b.id === id);
                if (idx === -1) return;
                if (act === 'up' && idx > 0) {
                    [page.blocks[idx - 1], page.blocks[idx]] = [page.blocks[idx], page.blocks[idx - 1]];
                    selectedId = id;
                    pushHistory(true);
                    persistAndRender();
                } else if (act === 'down' && idx < page.blocks.length - 1) {
                    [page.blocks[idx + 1], page.blocks[idx]] = [page.blocks[idx], page.blocks[idx + 1]];
                    selectedId = id;
                    pushHistory(true);
                    persistAndRender();
                } else if (act === 'dup') {
                    const orig = page.blocks[idx];
                    const clone = JSON.parse(JSON.stringify(orig));
                    clone.id = Storage.uid('blk');
                    page.blocks.splice(idx + 1, 0, clone);
                    selectedId = clone.id;
                    pushHistory(true);
                    persistAndRender();
                } else if (act === 'del') {
                    page.blocks.splice(idx, 1);
                    if (selectedId === id) selectedId = null;
                    pushHistory(true);
                    persistAndRender();
                }
            });
        });
    });
}

function attachCanvasDropZones(canvas) {
    canvas.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = e.dataTransfer.types.includes('text/ff-add') ? 'copy' : 'move';
            zone.classList.add('active');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('active'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('active');
            const idx = +zone.dataset.idx;

            const addType = e.dataTransfer.getData('text/ff-add');
            const moveId = e.dataTransfer.getData('text/ff-move');

            if (addType) {
                const newBlock = createBlock(addType);
                if (!newBlock) return;
                page.blocks.splice(idx, 0, newBlock);
                selectedId = newBlock.id;
                pushHistory(true);
                persistAndRender();
            } else if (moveId) {
                const fromIdx = page.blocks.findIndex(b => b.id === moveId);
                if (fromIdx === -1) return;
                let to = idx;
                if (fromIdx < to) to -= 1;
                if (fromIdx === to) return;
                const [moved] = page.blocks.splice(fromIdx, 1);
                page.blocks.splice(to, 0, moved);
                selectedId = moveId;
                pushHistory(true);
                persistAndRender();
            }
        });
    });

    canvas.addEventListener('click', e => {
        if (e.target === canvas || e.target.classList.contains('canvas-empty') || e.target.closest('.canvas-empty')) {
            selectedId = null;
            renderCanvas();
            renderProps();
        }
    });
}

/* ============================================================
   PROPERTIES PANEL — 3 tabs: Content / Style / Page
   ============================================================ */
function renderProps() {
    const el = document.getElementById('props');

    if (activeTab === 'page') {
        renderPageProps(el);
        return;
    }

    const block = selectedId ? page.blocks.find(b => b.id === selectedId) : null;

    if (!block) {
        el.innerHTML = `
            ${propsTabs()}
            <div class="props-empty">
                <div class="props-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div>Select a block to edit its properties</div>
                <div style="margin-top:8px;opacity:0.6">Switch to <strong>Page</strong> tab for page-wide settings.</div>
            </div>`;
        attachPropsTabHandlers();
        return;
    }

    const def = Blocks[block.type];
    const fields = activeTab === 'style' ? STYLE_FIELDS : def.fields;
    const sectionLabel = activeTab === 'style' ? 'Advanced styling' : 'Block properties';

    el.innerHTML = `
        ${propsTabs()}
        <div class="props-header">
            <div class="props-header-icon">${def.icon}</div>
            <div>
                <h3>${def.label}</h3>
                <p>${sectionLabel}</p>
            </div>
        </div>
        <div class="props-body" id="propsBody">
            ${activeTab === 'style' ? `<div class="props-help" style="margin-bottom:16px">These styles wrap the entire block. Leave blank to use defaults.</div>` : ''}
            ${fields.map(f => renderField(f, getProp(block.props, f.key))).join('')}
            ${activeTab === 'style' ? `
                <button class="btn btn-ghost btn-sm" id="resetStyleBtn" style="width:100%;margin-top:14px">
                    Reset all styles
                </button>` : ''}
        </div>`;

    attachPropsTabHandlers();
    attachFieldHandlers(block);

    const resetBtn = document.getElementById('resetStyleBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => {
        delete block.props._style;
        pushHistory(true);
        renderProps();
        updateBlockDom(block);
        queueSave();
    });
}

function propsTabs() {
    return `
        <div class="props-tabs">
            <div class="props-tab ${activeTab === 'content' ? 'active' : ''}" data-tab="content">Content</div>
            <div class="props-tab ${activeTab === 'style' ? 'active' : ''}" data-tab="style">Style</div>
            <div class="props-tab ${activeTab === 'page' ? 'active' : ''}" data-tab="page">Page</div>
        </div>`;
}

function attachPropsTabHandlers() {
    document.querySelectorAll('.props-tab').forEach(t => {
        t.addEventListener('click', () => {
            activeTab = t.dataset.tab;
            renderProps();
        });
    });
}

function renderField(field, value) {
    const id = `f_${field.key.replace(/\./g, '_')}`;
    const baseLabel = `<label for="${id}">${escapeHtml(field.label)}</label>`;

    if (field.type === 'text' || field.type === 'url') {
        return `<div class="prop-field">${baseLabel}<input type="${field.type}" id="${id}" data-key="${field.key}" value="${escapeHtml(value ?? '')}" placeholder="${escapeHtml(field.placeholder || '')}"></div>`;
    }
    if (field.type === 'number') {
        return `<div class="prop-field">${baseLabel}<input type="number" id="${id}" data-key="${field.key}" value="${value ?? ''}" min="${field.min ?? ''}" max="${field.max ?? ''}" step="${field.step ?? 'any'}"></div>`;
    }
    if (field.type === 'textarea') {
        return `<div class="prop-field">${baseLabel}<textarea id="${id}" data-key="${field.key}" rows="4">${escapeHtml(value ?? '')}</textarea></div>`;
    }
    if (field.type === 'select') {
        const opts = field.options.map(o =>
            `<option value="${escapeHtml(o.value)}" ${String(o.value) === String(value) ? 'selected' : ''}>${escapeHtml(o.label)}</option>`
        ).join('');
        return `<div class="prop-field">${baseLabel}<select id="${id}" data-key="${field.key}">${opts}</select></div>`;
    }
    if (field.type === 'datetime') {
        return `<div class="prop-field">${baseLabel}<input type="datetime-local" id="${id}" data-key="${field.key}" value="${escapeHtml(value ?? '')}"></div>`;
    }
    if (field.type === 'color') {
        return `<div class="prop-field">${baseLabel}
            <div class="color-row">
                <input type="color" data-key="${field.key}" data-color="hex" value="${escapeHtml(toHex(value))}">
                <input type="text" data-key="${field.key}" value="${escapeHtml(value ?? '')}" placeholder="#aabbcc or rgba(...)">
            </div>
        </div>`;
    }
    if (field.type === 'align') {
        return `<div class="prop-field">${baseLabel}
            <div class="align-control" data-key="${field.key}">
                <button data-v="left" class="${value === 'left' ? 'active' : ''}" title="Left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 10H3M21 6H3M21 14H3M17 18H3"/></svg></button>
                <button data-v="center" class="${value === 'center' ? 'active' : ''}" title="Center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10H6M21 6H3M21 14H3M18 18H6"/></svg></button>
                <button data-v="right" class="${value === 'right' ? 'active' : ''}" title="Right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10H7M21 6H3M21 14H3M21 18H7"/></svg></button>
            </div>
        </div>`;
    }
    if (field.type === 'toggle') {
        return `<div class="prop-field"><div class="toggle-row">
            <label for="${id}">${escapeHtml(field.label)}</label>
            <div class="toggle ${value ? 'on' : ''}" data-key="${field.key}" role="switch" aria-checked="${!!value}"></div>
        </div></div>`;
    }
    return `<div class="prop-field">${baseLabel}<input type="text" data-key="${field.key}" value="${escapeHtml(value ?? '')}"></div>`;
}

function attachFieldHandlers(block) {
    const body = document.getElementById('propsBody');
    if (!body) return;

    body.querySelectorAll('input, select, textarea').forEach(el => {
        const key = el.dataset.key;
        if (!key) return;

        const update = () => {
            let v = el.value;
            if (el.type === 'number') v = v === '' ? '' : Number(v);
            if (el.dataset.color === 'hex') {
                const partner = body.querySelector(`input[type="text"][data-key="${key}"]`);
                if (partner) partner.value = v;
            }
            setProp(block.props, key, v);
            updateBlockDom(block);
            queueSave();
        };

        el.addEventListener('input', update);
        el.addEventListener('change', update);
    });

    body.querySelectorAll('.align-control').forEach(ctrl => {
        const key = ctrl.dataset.key;
        ctrl.querySelectorAll('button').forEach(b => {
            b.addEventListener('click', () => {
                ctrl.querySelectorAll('button').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                setProp(block.props, key, b.dataset.v);
                updateBlockDom(block);
                queueSave();
            });
        });
    });

    body.querySelectorAll('.toggle').forEach(t => {
        const key = t.dataset.key;
        t.addEventListener('click', () => {
            const next = !getProp(block.props, key);
            setProp(block.props, key, next);
            t.classList.toggle('on', next);
            updateBlockDom(block);
            queueSave();
        });
    });
}

function toHex(c) {
    if (!c) return '#000000';
    if (typeof c === 'string' && c.startsWith('#') && c.length === 7) return c;
    if (typeof c !== 'string') return '#000000';
    const tmp = document.createElement('div');
    tmp.style.color = c;
    document.body.appendChild(tmp);
    const rgb = getComputedStyle(tmp).color.match(/\d+/g);
    document.body.removeChild(tmp);
    if (!rgb) return '#000000';
    const toHexPart = n => Number(n).toString(16).padStart(2, '0');
    return '#' + toHexPart(rgb[0]) + toHexPart(rgb[1]) + toHexPart(rgb[2]);
}

/* ============================================================
   PAGE PROPERTIES (settings tab — expanded)
   ============================================================ */
const FONT_OPTIONS = [
    { value: '', label: 'System default (San Francisco / Segoe)' },
    { value: 'Inter, system-ui, sans-serif', label: 'Inter (clean modern)' },
    { value: '"Helvetica Neue", Arial, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, "Times New Roman", serif', label: 'Georgia (serif)' },
    { value: '"Playfair Display", Georgia, serif', label: 'Playfair (display serif)' },
    { value: '"JetBrains Mono", "SF Mono", Menlo, monospace', label: 'JetBrains Mono' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: '"Courier New", monospace', label: 'Courier New' }
];

function renderPageProps(el) {
    const s = page.settings || {};
    el.innerHTML = `
        ${propsTabs()}
        <div class="page-settings">
            <h4>Page</h4>
            <div class="prop-field">
                <label>Page name</label>
                <input type="text" id="pgName" value="${escapeHtml(page.name)}">
            </div>
            <div class="prop-field">
                <label>Page type</label>
                <select id="pgType">
                    <option value="landing" ${page.type === 'landing' ? 'selected' : ''}>Landing</option>
                    <option value="opt-in" ${page.type === 'opt-in' ? 'selected' : ''}>Opt-in</option>
                    <option value="sales" ${page.type === 'sales' ? 'selected' : ''}>Sales</option>
                    <option value="checkout" ${page.type === 'checkout' ? 'selected' : ''}>Checkout</option>
                    <option value="upsell" ${page.type === 'upsell' ? 'selected' : ''}>Upsell</option>
                    <option value="thank-you" ${page.type === 'thank-you' ? 'selected' : ''}>Thank you</option>
                    <option value="webinar" ${page.type === 'webinar' ? 'selected' : ''}>Webinar</option>
                    <option value="custom" ${page.type === 'custom' ? 'selected' : ''}>Custom</option>
                </select>
            </div>

            <h4 style="margin-top:24px">Appearance</h4>
            <div class="prop-field">
                <label>Background</label>
                <div class="color-row">
                    <input type="color" data-color="hex" data-page-key="bg" value="${escapeHtml(toHex(s.bg || '#0a0a0c'))}">
                    <input type="text" data-page-key="bg" value="${escapeHtml(s.bg || '#0a0a0c')}" placeholder="#000 or linear-gradient(...)">
                </div>
            </div>
            <div class="prop-field">
                <label>Text color</label>
                <div class="color-row">
                    <input type="color" data-color="hex" data-page-key="textColor" value="${escapeHtml(toHex(s.textColor || '#f5f5f7'))}">
                    <input type="text" data-page-key="textColor" value="${escapeHtml(s.textColor || '#f5f5f7')}">
                </div>
            </div>
            <div class="prop-field">
                <label>Font family</label>
                <select data-page-key="fontFamily">
                    ${FONT_OPTIONS.map(o => `<option value="${escapeHtml(o.value)}" ${(s.fontFamily || '') === o.value ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}
                </select>
            </div>
            <div class="prop-field">
                <label>Content max width (px)</label>
                <input type="number" data-page-key="maxWidth" value="${s.maxWidth || 720}" min="320" max="1400">
            </div>
            <div class="prop-field">
                <label>Page padding top (px)</label>
                <input type="number" data-page-key="paddingTop" value="${s.paddingTop ?? 60}" min="0" max="400">
            </div>
            <div class="prop-field">
                <label>Page padding bottom (px)</label>
                <input type="number" data-page-key="paddingBottom" value="${s.paddingBottom ?? 60}" min="0" max="400">
            </div>

            <h4 style="margin-top:24px">SEO &amp; metadata</h4>
            <div class="prop-field">
                <label>SEO title</label>
                <input type="text" data-page-key="seoTitle" value="${escapeHtml(s.seoTitle || '')}" placeholder="Defaults to page name">
            </div>
            <div class="prop-field">
                <label>Meta description</label>
                <textarea data-page-key="seoDesc" rows="2" placeholder="Shown in search results and social previews">${escapeHtml(s.seoDesc || '')}</textarea>
            </div>
            <div class="prop-field">
                <label>Social preview image URL</label>
                <input type="url" data-page-key="seoImage" value="${escapeHtml(s.seoImage || '')}" placeholder="https://...">
            </div>
            <div class="prop-field">
                <label>Favicon URL</label>
                <input type="url" data-page-key="favicon" value="${escapeHtml(s.favicon || '')}" placeholder="https://...">
            </div>

            <h4 style="margin-top:24px">Advanced</h4>
            <div class="prop-field">
                <label>Custom CSS (injected into &lt;style&gt;)</label>
                <textarea data-page-key="customCSS" rows="5" placeholder="/* your CSS here */" style="font-family:var(--font-mono);font-size:12px">${escapeHtml(s.customCSS || '')}</textarea>
                <div class="props-help">Applies to this page only. Affects both preview and export.</div>
            </div>
            <div class="prop-field">
                <label>Custom &lt;head&gt; HTML (analytics, fonts, etc.)</label>
                <textarea data-page-key="customHead" rows="4" placeholder="&lt;script&gt;...&lt;/script&gt;" style="font-family:var(--font-mono);font-size:12px">${escapeHtml(s.customHead || '')}</textarea>
                <div class="props-help">Injected into &lt;head&gt; of the exported page.</div>
            </div>

            <h4 style="margin-top:24px">Danger zone</h4>
            <button class="btn btn-danger btn-sm" id="clearBtn" style="width:100%">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
                Clear all blocks
            </button>
        </div>`;

    attachPropsTabHandlers();

    document.getElementById('pgName').addEventListener('input', e => {
        page.name = e.target.value;
        const top = document.getElementById('pageNameInput');
        if (top) top.value = e.target.value;
        queueSave();
    });
    document.getElementById('pgType').addEventListener('change', e => {
        page.type = e.target.value;
        queueSave();
    });
    el.querySelectorAll('[data-page-key]').forEach(input => {
        const key = input.dataset.pageKey;
        input.addEventListener('input', () => {
            if (!page.settings) page.settings = {};
            let v = input.value;
            if (input.type === 'number') v = v === '' ? '' : Number(v);
            page.settings[key] = v;
            if (input.dataset.color === 'hex') {
                const partner = el.querySelector(`input[type="text"][data-page-key="${key}"]`);
                if (partner) partner.value = v;
            } else if (input.type === 'text' && el.querySelector(`input[type="color"][data-page-key="${key}"]`)) {
                const partner = el.querySelector(`input[type="color"][data-page-key="${key}"]`);
                if (partner && typeof v === 'string' && v.startsWith('#')) partner.value = toHex(v);
            }
            applyPageStyles();
            queueSave();
        });
    });

    document.getElementById('clearBtn').addEventListener('click', async () => {
        const ok = await modalConfirm({
            title: 'Clear all blocks?',
            body: 'This removes every block from this page. The page itself stays.',
            confirmText: 'Clear',
            danger: true
        });
        if (ok) {
            page.blocks = [];
            selectedId = null;
            pushHistory(true);
            persistAndRender();
            toast('Blocks cleared', 'success');
        }
    });
}

function applyPageStyles() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const s = page.settings || {};
    canvas.style.background = s.bg || '';
    canvas.style.color = s.textColor || '';
    canvas.style.fontFamily = s.fontFamily || '';
    canvas.style.paddingTop = (s.paddingTop ?? 60) + 'px';
    canvas.style.paddingBottom = (s.paddingBottom ?? 60) + 'px';

    // Apply custom CSS via a <style> tag scoped to the canvas
    let styleTag = document.getElementById('pageCustomStyle');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'pageCustomStyle';
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = s.customCSS ? `#canvas { ${s.customCSS.replace(/\}/g, '} #canvas ')} }`.replace(/#canvas \{ \}/g, '') : '';
    // Simpler: just inject as-is, scoped via parent
    styleTag.textContent = s.customCSS || '';
}

/* ============================================================
   SHELL HANDLERS
   ============================================================ */
function attachShellHandlers() {
    const nameInput = document.getElementById('pageNameInput');
    nameInput.addEventListener('input', () => {
        page.name = nameInput.value;
        if (activeTab === 'page') {
            const pgName = document.getElementById('pgName');
            if (pgName) pgName.value = nameInput.value;
        }
        queueSave();
    });

    document.getElementById('deviceToggle').querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#deviceToggle button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            device = btn.dataset.d;
            document.getElementById('canvas').className = `canvas device-${device}`;
        });
    });

    document.getElementById('publishBtn').addEventListener('click', publishPage);
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);
    document.getElementById('shortcutsBtn').addEventListener('click', showShortcuts);

    document.addEventListener('keydown', e => {
        const tag = (e.target.tagName || '').toLowerCase();
        const inField = ['input', 'textarea', 'select'].includes(tag) || e.target.isContentEditable;

        // Ctrl/Cmd+Z / Shift+Z
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
            e.preventDefault();
            undo();
            return;
        }
        if ((e.ctrlKey || e.metaKey) && (e.shiftKey && (e.key === 'z' || e.key === 'Z') || e.key === 'y')) {
            e.preventDefault();
            redo();
            return;
        }

        if (inField) return;

        if (selectedId && (e.key === 'Delete' || e.key === 'Backspace')) {
            const idx = page.blocks.findIndex(b => b.id === selectedId);
            if (idx !== -1) {
                page.blocks.splice(idx, 1);
                selectedId = null;
                pushHistory(true);
                persistAndRender();
                e.preventDefault();
            }
        }
        if (selectedId && (e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            const idx = page.blocks.findIndex(b => b.id === selectedId);
            if (idx !== -1) {
                const clone = JSON.parse(JSON.stringify(page.blocks[idx]));
                clone.id = Storage.uid('blk');
                page.blocks.splice(idx + 1, 0, clone);
                selectedId = clone.id;
                pushHistory(true);
                persistAndRender();
            }
        }
        if (e.key === 'Escape') {
            selectedId = null;
            renderCanvas();
            renderProps();
        }
        if (e.key === '?' && !inField) {
            showShortcuts();
        }
    });
}

function showShortcuts() {
    const html = `
        <div class="modal" style="max-width:520px">
            <h3>Keyboard shortcuts</h3>
            <p>Move faster with the keyboard.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px">
                ${[
                    ['Ctrl + Z', 'Undo'],
                    ['Ctrl + Shift + Z', 'Redo'],
                    ['Ctrl + D', 'Duplicate selected block'],
                    ['Delete / Backspace', 'Remove selected block'],
                    ['Esc', 'Deselect'],
                    ['?', 'Show this dialog']
                ].map(([k, v]) => `
                    <div style="padding:10px 14px;background:var(--bg-surface);border:1px solid var(--border);border-radius:8px;font-family:var(--font-mono);font-size:12px;color:var(--text)">${k}</div>
                    <div style="padding:10px 14px;color:var(--text-dim);font-size:13px;display:flex;align-items:center">${v}</div>
                `).join('')}
            </div>
            <div class="modal-actions">
                <button class="btn btn-accent btn-sm" data-close>Got it</button>
            </div>
        </div>`;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = html;
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('active'));
    const close = () => {
        backdrop.classList.remove('active');
        setTimeout(() => backdrop.remove(), 260);
    };
    backdrop.querySelector('[data-close]').onclick = close;
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
}

/* ============================================================
   SELECT / SAVE
   ============================================================ */
function selectBlock(id) {
    selectedId = id;
    if (activeTab === 'page') activeTab = 'content';
    document.querySelectorAll('.block-wrap').forEach(w => w.classList.toggle('selected', w.dataset.id === id));
    renderProps();
}

function updateBlockDom(block) {
    const wrap = document.querySelector(`.block-wrap[data-id="${block.id}"]`);
    if (!wrap) return;
    const content = wrap.querySelector('.block-content');
    if (content) {
        content.innerHTML = renderBlock(block);
        startCountdowns(content);
        startAnimations(content);
    }
}

function persistAndRender() {
    Storage.updatePage(funnelId, pageId, page);
    renderCanvas();
    renderProps();
    applyPageStyles();
    flashSaved();
    updateUndoRedoState();
}

function queueSave() {
    setSaveStatus('saving');
    pushHistory(); // debounced
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        Storage.updatePage(funnelId, pageId, page);
        flashSaved();
    }, 350);
}

function flashSaved() { setSaveStatus('saved'); }
function setSaveStatus(state) {
    const el = document.getElementById('saveStatus');
    if (!el) return;
    if (state === 'saving') {
        el.classList.add('saving');
        el.querySelector('span').textContent = 'Saving...';
    } else {
        el.classList.remove('saving');
        el.querySelector('span').textContent = 'Saved';
    }
}

/* ============================================================
   PUBLISH (single-page export)
   ============================================================ */
function publishPage() {
    const html = buildPageExport(page);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = page.name.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
    a.href = url;
    a.download = `${safeName}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Page exported', 'success');
}

function buildPageExport(p) {
    const s = p.settings || {};
    const bg = s.bg || '#0a0a0c';
    const fg = s.textColor || '#f5f5f7';
    const maxW = s.maxWidth || 720;
    const font = s.fontFamily || `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', system-ui, sans-serif`;
    const pT = s.paddingTop ?? 60;
    const pB = s.paddingBottom ?? 60;
    const seoTitle = s.seoTitle || p.name;
    const seoDesc = s.seoDesc || '';
    const seoImg = s.seoImage || '';
    const favicon = s.favicon || '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(seoTitle)}</title>
${seoDesc ? `<meta name="description" content="${esc(seoDesc)}">` : ''}
${seoTitle ? `<meta property="og:title" content="${esc(seoTitle)}">` : ''}
${seoDesc ? `<meta property="og:description" content="${esc(seoDesc)}">` : ''}
${seoImg ? `<meta property="og:image" content="${esc(seoImg)}"><meta name="twitter:card" content="summary_large_image">` : ''}
${favicon ? `<link rel="icon" href="${esc(favicon)}">` : ''}
${s.customHead || ''}
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:${font};background:${bg};color:${fg};-webkit-font-smoothing:antialiased;line-height:1.5;letter-spacing:-0.01em;min-height:100vh}
img{max-width:100%;display:block}
input:focus{outline:none;border-color:rgba(255,255,255,0.3)!important}
.ff-wrap{max-width:${maxW}px;margin:0 auto;padding:${pT}px 24px ${pB}px}
[data-ff-anim]{opacity:0;transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
[data-ff-anim="fade-up"]{transform:translateY(24px)}
[data-ff-anim="slide-left"]{transform:translateX(-30px)}
[data-ff-anim="slide-right"]{transform:translateX(30px)}
[data-ff-anim="zoom"]{transform:scale(.95)}
[data-ff-anim].ff-anim-in{opacity:1;transform:none}
${s.customCSS || ''}
</style>
</head>
<body>
<div class="ff-wrap">${renderPageInner(p)}</div>
<script>
(function(){
  document.querySelectorAll('[data-ff-countdown]').forEach(function(el){
    var target=+el.getAttribute('data-ff-countdown');
    var urgentColor=el.getAttribute('data-urgent-color')||'';
    var urgentBelow=+el.getAttribute('data-urgent-below')||0;
    var base=el.style.color;
    function tick(){
      var ms=target-Date.now();var c=function(n){return Math.max(0,n)};
      var d=c(Math.floor(ms/86400000)),h=c(Math.floor(ms/3600000)%24),m=c(Math.floor(ms/60000)%60),s=c(Math.floor(ms/1000)%60);
      var set=function(u,v){var n=el.querySelector('[data-u="'+u+'"]');if(n)n.textContent=String(v).padStart(2,'0')};
      set('days',d);set('hours',h);set('mins',m);set('secs',s);
      if(urgentColor&&urgentBelow>0&&ms<urgentBelow*60000&&ms>0)el.style.color=urgentColor;else if(base)el.style.color=base;
    }
    tick();setInterval(tick,1000);
  });
  if('IntersectionObserver' in window){
    var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('ff-anim-in');o.unobserve(e.target);}});},{threshold:0.1});
    document.querySelectorAll('[data-ff-anim]').forEach(function(el){o.observe(el);});
  }
})();
<\/script>
</body>
</html>`;
}

/* ============================================================
   BOOT
   ============================================================ */
renderShell();
pushHistory(true); // initial snapshot

})();
