/* ============================================================
   blocks.js — Block type registry for FunnelForge
   Each block defines: type, label, icon, defaultProps, fields, render
   ============================================================ */

const ICON = {
    headline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5v14M14 5v14M4 12h10M19 9v10M17 14l2-2 2 2"/></svg>',
    paragraph: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
    button: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="8" rx="4"/><path d="M9 12h6"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5L5 21"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg>',
    form: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 10h10M7 14h6"/></svg>',
    divider: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"/></svg>',
    spacer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16M8 7l4-3 4 3M8 17l4 3 4-3"/></svg>',
    countdown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 3h6"/></svg>',
    testimonial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 8c-2 0-3 1.5-3 3.5S5 15 7 15v-3H5c0-1 .5-2 2-2zM17 8c-2 0-3 1.5-3 3.5s1 3.5 3 3.5v-3h-2c0-1 .5-2 2-2z"/></svg>',
    pricing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M16 7H10a3 3 0 000 6h4a3 3 0 010 6H7"/></svg>',
    logos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>',
    hero: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 11h18M8 15h8"/></svg>',
    featureGrid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18M7 14l3-3 4 4 5-5"/></svg>',
    faq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    twoCol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/></svg>',
    bulletList: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="4" cy="6" r="1.2" fill="currentColor"/><circle cx="4" cy="12" r="1.2" fill="currentColor"/><circle cx="4" cy="18" r="1.2" fill="currentColor"/><path d="M9 6h12M9 12h12M9 18h10"/></svg>',
    socialIcons: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="12" r="3"/><circle cx="12" cy="6" r="3"/><circle cx="18" cy="12" r="3"/><circle cx="12" cy="18" r="3"/></svg>',
    htmlEmbed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4l-6 8 6 8M16 4l6 8-6 8M14 4l-4 16"/></svg>',
    quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c0-6 3-9 9-9M21 21c0-6 -3-9-9-9M3 8c0 2 1 4 3 4M21 8c0-2-1 4-3 4"/></svg>',
    steps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="7" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="17" r="2"/><path d="M7 8l3 3M14 13l3 3"/></svg>',
    tabs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h7v12H3zM10 5h7v16h-7zM17 9h4v12h-4z"/></svg>',
    accordion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/></svg>'
};

/* ============================================================
   Helpers
   ============================================================ */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const alignStyle = (a) => `text-align:${a || 'left'}`;

function parseVideoUrl(url) {
    if (!url) return null;
    let m;
    m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
    if (m) return { provider: 'youtube', id: m[1] };
    m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return { provider: 'vimeo', id: m[1] };
    return null;
}

/* Parse multiline pipe-separated rows: "A||B||C\nD||E||F" -> [[A,B,C],[D,E,F]] */
function parseRows(text, minCols = 1) {
    if (!text) return [];
    return text.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
        const parts = line.split('||').map(p => p.trim());
        while (parts.length < minCols) parts.push('');
        return parts;
    });
}

/* Build wrapper style from optional _style sub-object */
function buildWrapStyle(s) {
    if (!s) return '';
    const css = [];
    if (s.paddingTop != null && s.paddingTop !== '') css.push(`padding-top:${+s.paddingTop}px`);
    if (s.paddingBottom != null && s.paddingBottom !== '') css.push(`padding-bottom:${+s.paddingBottom}px`);
    if (s.paddingX != null && s.paddingX !== '') css.push(`padding-left:${+s.paddingX}px;padding-right:${+s.paddingX}px`);
    if (s.marginTop != null && s.marginTop !== '') css.push(`margin-top:${+s.marginTop}px`);
    if (s.marginBottom != null && s.marginBottom !== '') css.push(`margin-bottom:${+s.marginBottom}px`);
    if (s.bg) css.push(`background:${s.bg}`);
    if (s.borderRadius != null && s.borderRadius !== '') css.push(`border-radius:${+s.borderRadius}px`);
    if (s.borderWidth && s.borderColor) css.push(`border:${+s.borderWidth}px solid ${s.borderColor}`);
    if (s.shadow === 'sm') css.push('box-shadow:0 2px 8px rgba(0,0,0,0.15)');
    if (s.shadow === 'md') css.push('box-shadow:0 8px 32px rgba(0,0,0,0.3)');
    if (s.shadow === 'lg') css.push('box-shadow:0 20px 60px rgba(0,0,0,0.4)');
    if (s.shadow === 'glow') css.push('box-shadow:0 0 50px rgba(139,92,246,0.4)');
    if (s.maxWidth) css.push(`max-width:${+s.maxWidth}px;margin-left:auto;margin-right:auto`);
    if (s.opacity != null && s.opacity !== '' && s.opacity !== 1) css.push(`opacity:${s.opacity}`);
    return css.join(';');
}

/* Animation class lookup. The actual CSS lives in main.css. */
function animAttr(s) {
    if (!s || !s.anim || s.anim === 'none') return '';
    return ` data-ff-anim="${s.anim}"`;
}

/* Common style fields injected into every block's properties panel as "Style" tab. */
const STYLE_FIELDS = [
    { key: '_style.paddingTop', label: 'Padding top (px)', type: 'number', min: 0, max: 200 },
    { key: '_style.paddingBottom', label: 'Padding bottom (px)', type: 'number', min: 0, max: 200 },
    { key: '_style.paddingX', label: 'Padding horizontal (px)', type: 'number', min: 0, max: 200 },
    { key: '_style.marginTop', label: 'Margin top (px)', type: 'number', min: 0, max: 200 },
    { key: '_style.marginBottom', label: 'Margin bottom (px)', type: 'number', min: 0, max: 200 },
    { key: '_style.bg', label: 'Background (color or gradient)', type: 'text', placeholder: '#000 or linear-gradient(...)' },
    { key: '_style.borderRadius', label: 'Border radius (px)', type: 'number', min: 0, max: 80 },
    { key: '_style.borderWidth', label: 'Border width (px)', type: 'number', min: 0, max: 10 },
    { key: '_style.borderColor', label: 'Border color', type: 'color' },
    { key: '_style.shadow', label: 'Shadow', type: 'select', options: [
        { value: '', label: 'None' },
        { value: 'sm', label: 'Subtle' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'glow', label: 'Glow' }
    ]},
    { key: '_style.maxWidth', label: 'Max width (px)', type: 'number', min: 0, max: 1600 },
    { key: '_style.anim', label: 'Entrance animation', type: 'select', options: [
        { value: 'none', label: 'None' },
        { value: 'fade-up', label: 'Fade up' },
        { value: 'fade-in', label: 'Fade in' },
        { value: 'slide-left', label: 'Slide from left' },
        { value: 'slide-right', label: 'Slide from right' },
        { value: 'zoom', label: 'Zoom in' }
    ]}
];

/* ============================================================
   BLOCK REGISTRY
   ============================================================ */
const Blocks = {

    /* ----------- TEXT ----------- */

    headline: {
        type: 'headline',
        label: 'Headline',
        category: 'text',
        icon: ICON.headline,
        defaultProps: {
            text: 'Your Compelling Headline Here',
            level: 'h1',
            align: 'center',
            color: '#f5f5f7',
            size: 56,
            weight: 700
        },
        fields: [
            { key: 'text', label: 'Text', type: 'textarea' },
            { key: 'level', label: 'Heading level', type: 'select', options: [
                { value: 'h1', label: 'H1' }, { value: 'h2', label: 'H2' }, { value: 'h3', label: 'H3' }
            ]},
            { key: 'align', label: 'Alignment', type: 'align' },
            { key: 'size', label: 'Font size (px)', type: 'number', min: 16, max: 140 },
            { key: 'weight', label: 'Weight', type: 'select', options: [
                { value: 400, label: 'Regular' }, { value: 600, label: 'Semibold' }, { value: 700, label: 'Bold' }, { value: 800, label: 'Extrabold' }
            ]},
            { key: 'color', label: 'Color', type: 'color' }
        ],
        render(p) {
            const tag = ['h1', 'h2', 'h3'].includes(p.level) ? p.level : 'h1';
            const style = `${alignStyle(p.align)};color:${p.color || '#f5f5f7'};font-size:${p.size || 56}px;font-weight:${p.weight || 700};line-height:1.1;letter-spacing:-0.03em;margin:0 0 16px`;
            return `<${tag} style="${style}">${esc(p.text)}</${tag}>`;
        }
    },

    paragraph: {
        type: 'paragraph',
        label: 'Paragraph',
        category: 'text',
        icon: ICON.paragraph,
        defaultProps: {
            text: 'Write something compelling here. Explain the value, address an objection, or describe what happens next.',
            align: 'center',
            color: '#a1a1a6',
            size: 18,
            maxWidth: 640
        },
        fields: [
            { key: 'text', label: 'Text', type: 'textarea' },
            { key: 'align', label: 'Alignment', type: 'align' },
            { key: 'size', label: 'Font size (px)', type: 'number', min: 12, max: 36 },
            { key: 'maxWidth', label: 'Max width (px)', type: 'number', min: 200, max: 1200 },
            { key: 'color', label: 'Color', type: 'color' }
        ],
        render(p) {
            const center = p.align === 'center';
            const style = `${alignStyle(p.align)};color:${p.color || '#a1a1a6'};font-size:${p.size || 18}px;line-height:1.55;margin:0 0 20px;max-width:${p.maxWidth || 640}px;${center ? 'margin-left:auto;margin-right:auto' : ''}`;
            return `<p style="${style}">${esc(p.text)}</p>`;
        }
    },

    quote: {
        type: 'quote',
        label: 'Pull Quote',
        category: 'text',
        icon: ICON.quote,
        defaultProps: {
            text: 'A bold, memorable line worth standing out from the surrounding copy.',
            attribution: '',
            align: 'center',
            color: '#f5f5f7',
            accentColor: '#a855f7'
        },
        fields: [
            { key: 'text', label: 'Quote', type: 'textarea' },
            { key: 'attribution', label: 'Attribution (optional)', type: 'text' },
            { key: 'align', label: 'Alignment', type: 'align' },
            { key: 'color', label: 'Text color', type: 'color' },
            { key: 'accentColor', label: 'Accent bar color', type: 'color' }
        ],
        render(p) {
            return `<blockquote style="${alignStyle(p.align)};max-width:700px;margin:32px auto;padding:0 24px;border-left:4px solid ${p.accentColor || '#a855f7'};font-size:28px;line-height:1.35;color:${p.color || '#f5f5f7'};letter-spacing:-0.02em;font-weight:500">
                <div style="margin-bottom:${p.attribution ? '14px' : '0'}">&ldquo;${esc(p.text)}&rdquo;</div>
                ${p.attribution ? `<div style="font-size:14px;color:#a1a1a6;font-weight:500">&mdash; ${esc(p.attribution)}</div>` : ''}
            </blockquote>`;
        }
    },

    bulletList: {
        type: 'bulletList',
        label: 'Bullet List',
        category: 'text',
        icon: ICON.bulletList,
        defaultProps: {
            items: 'Fast to set up\nNo coding required\nCancel anytime\nFree updates for life',
            style: 'check',
            color: '#a1a1a6',
            accentColor: '#30d158',
            size: 16,
            align: 'left'
        },
        fields: [
            { key: 'items', label: 'Items (one per line)', type: 'textarea' },
            { key: 'style', label: 'Marker', type: 'select', options: [
                { value: 'check', label: 'Checkmark' },
                { value: 'dot', label: 'Dot' },
                { value: 'arrow', label: 'Arrow' },
                { value: 'star', label: 'Star' },
                { value: 'number', label: 'Numbered' }
            ]},
            { key: 'align', label: 'Alignment', type: 'align' },
            { key: 'size', label: 'Font size (px)', type: 'number', min: 12, max: 24 },
            { key: 'color', label: 'Text color', type: 'color' },
            { key: 'accentColor', label: 'Marker color', type: 'color' }
        ],
        render(p) {
            const items = (p.items || '').split('\n').filter(s => s.trim());
            const markerSvg = {
                check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:18px;height:18px;flex-shrink:0;margin-top:2px"><path d="M5 12l5 5L20 7"/></svg>',
                dot: '<span style="width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0;margin-top:9px"></span>',
                arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;flex-shrink:0;margin-top:3px"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
                star: '<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;flex-shrink:0;margin-top:3px"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6L8 14l-6-4.6h7.6z"/></svg>'
            };
            const wrapStyle = `list-style:none;padding:0;margin:18px auto;max-width:600px;color:${p.color || '#a1a1a6'};font-size:${p.size || 16}px;line-height:1.55;${alignStyle(p.align)}`;
            const lis = items.map((item, i) => {
                const marker = p.style === 'number'
                    ? `<span style="font-weight:700;color:${p.accentColor || '#30d158'};min-width:24px">${i + 1}.</span>`
                    : `<span style="color:${p.accentColor || '#30d158'};display:inline-flex">${markerSvg[p.style] || markerSvg.check}</span>`;
                return `<li style="display:flex;align-items:flex-start;gap:12px;padding:7px 0;${p.align === 'center' ? 'justify-content:center;text-align:left' : ''}">${marker}<span>${esc(item)}</span></li>`;
            }).join('');
            return `<ul style="${wrapStyle}">${lis}</ul>`;
        }
    },

    /* ----------- ACTION ----------- */

    button: {
        type: 'button',
        label: 'Button',
        category: 'action',
        icon: ICON.button,
        defaultProps: {
            text: 'Get Started',
            url: '#',
            style: 'accent',
            size: 'lg',
            align: 'center',
            fullWidth: false,
            icon: 'none'
        },
        fields: [
            { key: 'text', label: 'Button text', type: 'text' },
            { key: 'url', label: 'URL', type: 'url', placeholder: 'https://...' },
            { key: 'style', label: 'Style', type: 'select', options: [
                { value: 'accent', label: 'Accent (gradient)' },
                { value: 'primary', label: 'Primary (white)' },
                { value: 'ghost', label: 'Ghost (outline)' },
                { value: 'dark', label: 'Dark' },
                { value: 'success', label: 'Success' },
                { value: 'danger', label: 'Danger' }
            ]},
            { key: 'size', label: 'Size', type: 'select', options: [
                { value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }, { value: 'xl', label: 'Extra Large' }
            ]},
            { key: 'align', label: 'Alignment', type: 'align' },
            { key: 'icon', label: 'Icon', type: 'select', options: [
                { value: 'none', label: 'None' },
                { value: 'arrow', label: 'Arrow right' },
                { value: 'check', label: 'Checkmark' },
                { value: 'download', label: 'Download' },
                { value: 'play', label: 'Play' },
                { value: 'lock', label: 'Lock' }
            ]},
            { key: 'fullWidth', label: 'Full width', type: 'toggle' }
        ],
        render(p) {
            const sizes = { sm: '10px 18px;font-size:13px', md: '14px 24px;font-size:15px', lg: '18px 36px;font-size:17px', xl: '22px 44px;font-size:19px' };
            const styles = {
                accent: 'background:linear-gradient(135deg,#a855f7 0%,#6366f1 100%);color:#fff;box-shadow:0 6px 24px rgba(139,92,246,0.45)',
                primary: 'background:#fff;color:#000',
                ghost: 'background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,0.3)',
                dark: 'background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.1)',
                success: 'background:#30d158;color:#fff;box-shadow:0 6px 24px rgba(48,209,88,0.4)',
                danger: 'background:#ff453a;color:#fff;box-shadow:0 6px 24px rgba(255,69,58,0.4)'
            };
            const icons = {
                none: '',
                arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:1em;height:1em;margin-left:8px"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
                check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:1em;height:1em;margin-right:8px"><path d="M5 12l5 5L20 7"/></svg>',
                download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:1em;height:1em;margin-right:8px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
                play: '<svg viewBox="0 0 24 24" fill="currentColor" style="width:1em;height:1em;margin-right:8px"><path d="M8 5v14l11-7z"/></svg>',
                lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:1em;height:1em;margin-right:8px"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>'
            };
            const sz = sizes[p.size] || sizes.lg;
            const st = styles[p.style] || styles.accent;
            const fw = p.fullWidth ? 'width:100%;' : '';
            const iconHtml = icons[p.icon] || '';
            const isLeading = ['check', 'download', 'play', 'lock'].includes(p.icon);
            const wrap = `text-align:${p.align || 'center'};margin:8px 0`;
            const inner = isLeading ? `${iconHtml}${esc(p.text)}` : `${esc(p.text)}${iconHtml}`;
            return `<div style="${wrap}"><a href="${esc(p.url || '#')}" style="display:inline-flex;align-items:center;justify-content:center;padding:${sz};${st};${fw}font-weight:600;letter-spacing:-0.01em;border-radius:980px;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s">${inner}</a></div>`;
        }
    },

    form: {
        type: 'form',
        label: 'Opt-in Form',
        category: 'action',
        icon: ICON.form,
        defaultProps: {
            heading: 'Get instant access',
            namePlaceholder: 'Your name',
            emailPlaceholder: 'Your email',
            buttonText: 'Send it to me',
            collectName: true,
            collectPhone: false,
            phonePlaceholder: 'Your phone',
            successMessage: "You're in! Check your email.",
            buttonStyle: 'accent'
        },
        fields: [
            { key: 'heading', label: 'Form heading', type: 'text' },
            { key: 'collectName', label: 'Collect name?', type: 'toggle' },
            { key: 'collectPhone', label: 'Collect phone?', type: 'toggle' },
            { key: 'namePlaceholder', label: 'Name placeholder', type: 'text' },
            { key: 'emailPlaceholder', label: 'Email placeholder', type: 'text' },
            { key: 'phonePlaceholder', label: 'Phone placeholder', type: 'text' },
            { key: 'buttonText', label: 'Button text', type: 'text' },
            { key: 'buttonStyle', label: 'Button style', type: 'select', options: [
                { value: 'accent', label: 'Accent (gradient)' },
                { value: 'primary', label: 'White' },
                { value: 'success', label: 'Green' }
            ]},
            { key: 'successMessage', label: 'Success message', type: 'textarea' }
        ],
        render(p) {
            const btnBg = {
                accent: 'linear-gradient(135deg,#a855f7,#6366f1)',
                primary: '#fff',
                success: '#30d158'
            }[p.buttonStyle] || 'linear-gradient(135deg,#a855f7,#6366f1)';
            const btnColor = p.buttonStyle === 'primary' ? '#000' : '#fff';
            const inputStyle = "height:50px;padding:0 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:12px;color:#fff;font-size:15px;outline:none;font-family:inherit";
            const safeSuccess = String(p.successMessage || '').replace(/'/g, '&#39;');
            return `<form data-ff-form style="display:flex;flex-direction:column;gap:10px;max-width:420px;margin:24px auto;padding:24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px" onsubmit="event.preventDefault();this.innerHTML='<div style=&quot;padding:24px;text-align:center;color:#30d158;font-size:15px&quot;>${safeSuccess}</div>'">
                ${p.heading ? `<div style="text-align:center;font-size:17px;font-weight:600;margin-bottom:6px;color:#fff">${esc(p.heading)}</div>` : ''}
                ${p.collectName ? `<input type="text" placeholder="${esc(p.namePlaceholder)}" style="${inputStyle}">` : ''}
                <input type="email" required placeholder="${esc(p.emailPlaceholder)}" style="${inputStyle}">
                ${p.collectPhone ? `<input type="tel" placeholder="${esc(p.phonePlaceholder)}" style="${inputStyle}">` : ''}
                <button type="submit" style="height:50px;padding:0 24px;background:${btnBg};color:${btnColor};border:none;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer;letter-spacing:-0.01em;font-family:inherit">${esc(p.buttonText)}</button>
            </form>`;
        }
    },

    pricing: {
        type: 'pricing',
        label: 'Pricing Card',
        category: 'action',
        icon: ICON.pricing,
        defaultProps: {
            name: 'Pro',
            price: '49',
            currency: '$',
            period: '/month',
            features: 'Everything in Free\nUnlimited funnels\nCustom domain\nPriority support',
            buttonText: 'Start free trial',
            buttonUrl: '#',
            featured: true,
            badge: 'Most Popular'
        },
        fields: [
            { key: 'name', label: 'Plan name', type: 'text' },
            { key: 'currency', label: 'Currency symbol', type: 'text' },
            { key: 'price', label: 'Price', type: 'text' },
            { key: 'period', label: 'Period (e.g. /month)', type: 'text' },
            { key: 'features', label: 'Features (one per line)', type: 'textarea' },
            { key: 'buttonText', label: 'Button text', type: 'text' },
            { key: 'buttonUrl', label: 'Button URL', type: 'url' },
            { key: 'badge', label: 'Badge text (when featured)', type: 'text' },
            { key: 'featured', label: 'Featured (highlighted)', type: 'toggle' }
        ],
        render(p) {
            const features = (p.features || '').split('\n').filter(Boolean).map(f =>
                `<li style="display:flex;align-items:flex-start;gap:10px;padding:7px 0;color:#a1a1a6;font-size:15px"><span style="color:#30d158;flex-shrink:0;margin-top:3px">&#x2713;</span>${esc(f)}</li>`
            ).join('');
            const featuredStyle = p.featured
                ? 'background:linear-gradient(135deg,rgba(168,85,247,0.12),rgba(99,102,241,0.06));border:1px solid rgba(139,92,246,0.3);box-shadow:0 12px 48px rgba(139,92,246,0.18)'
                : 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08)';
            const btnStyle = p.featured
                ? 'background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff'
                : 'background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.12)';
            return `<div style="max-width:380px;margin:24px auto;padding:32px;${featuredStyle};border-radius:20px">
                ${p.featured && p.badge ? `<div style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:rgba(139,92,246,0.2);color:#c4b5fd;border-radius:980px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px">${esc(p.badge)}</div>` : ''}
                <div style="font-size:14px;font-weight:600;color:#a1a1a6;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px">${esc(p.name)}</div>
                <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:24px">
                    <span style="font-size:24px;color:#a1a1a6;font-weight:500">${esc(p.currency)}</span>
                    <span style="font-size:56px;font-weight:700;letter-spacing:-0.03em;color:#f5f5f7;line-height:1">${esc(p.price)}</span>
                    <span style="font-size:16px;color:#a1a1a6;margin-left:4px">${esc(p.period)}</span>
                </div>
                <ul style="list-style:none;padding:0;margin:0 0 28px">${features}</ul>
                <a href="${esc(p.buttonUrl || '#')}" style="display:flex;align-items:center;justify-content:center;width:100%;height:50px;${btnStyle};border-radius:12px;font-weight:600;font-size:15px;text-decoration:none">${esc(p.buttonText)}</a>
            </div>`;
        }
    },

    countdown: {
        type: 'countdown',
        label: 'Countdown',
        category: 'action',
        icon: ICON.countdown,
        defaultProps: {
            target: new Date(Date.now() + 86400_000 * 3).toISOString().slice(0, 16),
            label: 'Offer ends in',
            color: '#f5f5f7',
            urgentColor: '#ff453a',
            urgentBelow: 0
        },
        fields: [
            { key: 'target', label: 'Target date/time', type: 'datetime' },
            { key: 'label', label: 'Label above timer', type: 'text' },
            { key: 'color', label: 'Color', type: 'color' },
            { key: 'urgentColor', label: 'Urgent color (final hour)', type: 'color' },
            { key: 'urgentBelow', label: 'Switch to urgent below (minutes, 0 = off)', type: 'number', min: 0, max: 1440 }
        ],
        render(p) {
            const target = new Date(p.target).getTime() || Date.now() + 86400_000;
            return `<div style="text-align:center;margin:24px 0">
                ${p.label ? `<div style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:${p.color || '#f5f5f7'};opacity:0.7;margin-bottom:12px">${esc(p.label)}</div>` : ''}
                <div data-ff-countdown="${target}" data-urgent-color="${esc(p.urgentColor || '')}" data-urgent-below="${+p.urgentBelow || 0}" style="display:inline-flex;gap:12px;color:${p.color || '#f5f5f7'};font-variant-numeric:tabular-nums">
                    ${['days', 'hours', 'mins', 'secs'].map(u => `
                        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 18px;min-width:78px">
                            <div data-u="${u}" style="font-size:32px;font-weight:700;letter-spacing:-0.02em;line-height:1">--</div>
                            <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.55;margin-top:6px">${u}</div>
                        </div>`).join('')}
                </div>
            </div>`;
        }
    },

    /* ----------- MEDIA ----------- */

    image: {
        type: 'image',
        label: 'Image',
        category: 'media',
        icon: ICON.image,
        defaultProps: {
            src: '',
            alt: '',
            maxWidth: 720,
            align: 'center',
            radius: 12,
            shadow: false
        },
        fields: [
            { key: 'src', label: 'Image URL', type: 'url', placeholder: 'https://...' },
            { key: 'alt', label: 'Alt text', type: 'text' },
            { key: 'maxWidth', label: 'Max width (px)', type: 'number', min: 80, max: 1400 },
            { key: 'radius', label: 'Corner radius (px)', type: 'number', min: 0, max: 60 },
            { key: 'align', label: 'Alignment', type: 'align' },
            { key: 'shadow', label: 'Drop shadow', type: 'toggle' }
        ],
        render(p) {
            const shadowCss = p.shadow ? 'box-shadow:0 20px 60px rgba(0,0,0,0.4)' : '';
            const placeholder = `<div style="display:flex;align-items:center;justify-content:center;width:100%;max-width:${p.maxWidth || 720}px;aspect-ratio:16/9;background:rgba(255,255,255,0.04);border:1.5px dashed rgba(255,255,255,0.15);border-radius:${p.radius || 12}px;color:#6e6e73;font-size:13px">Add an image URL</div>`;
            const img = p.src
                ? `<img src="${esc(p.src)}" alt="${esc(p.alt)}" style="max-width:${p.maxWidth || 720}px;width:100%;height:auto;border-radius:${p.radius || 12}px;display:block;${shadowCss}">`
                : placeholder;
            const wrap = `display:flex;justify-content:${p.align === 'left' ? 'flex-start' : p.align === 'right' ? 'flex-end' : 'center'};margin:16px 0`;
            return `<div style="${wrap}">${img}</div>`;
        }
    },

    video: {
        type: 'video',
        label: 'Video',
        category: 'media',
        icon: ICON.video,
        defaultProps: { url: '', maxWidth: 800 },
        fields: [
            { key: 'url', label: 'YouTube or Vimeo URL', type: 'url', placeholder: 'https://youtube.com/watch?v=...' },
            { key: 'maxWidth', label: 'Max width (px)', type: 'number', min: 200, max: 1400 }
        ],
        render(p) {
            const v = parseVideoUrl(p.url);
            const embed = v
                ? (v.provider === 'youtube'
                    ? `<iframe src="https://www.youtube.com/embed/${v.id}" allowfullscreen style="width:100%;height:100%;border:0;border-radius:12px"></iframe>`
                    : `<iframe src="https://player.vimeo.com/video/${v.id}" allowfullscreen style="width:100%;height:100%;border:0;border-radius:12px"></iframe>`)
                : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:rgba(255,255,255,0.04);border:1.5px dashed rgba(255,255,255,0.15);border-radius:12px;color:#6e6e73;font-size:13px">Paste a YouTube or Vimeo URL</div>`;
            return `<div style="margin:16px auto;max-width:${p.maxWidth || 800}px"><div style="position:relative;width:100%;aspect-ratio:16/9">${embed}</div></div>`;
        }
    },

    htmlEmbed: {
        type: 'htmlEmbed',
        label: 'HTML / Embed',
        category: 'media',
        icon: ICON.htmlEmbed,
        defaultProps: {
            html: '<!-- Paste embed code here (Stripe, Calendly, Spotify, etc.) -->',
            maxWidth: 800
        },
        fields: [
            { key: 'html', label: 'HTML / Embed code', type: 'textarea' },
            { key: 'maxWidth', label: 'Max width (px)', type: 'number', min: 200, max: 1400 }
        ],
        render(p) {
            return `<div style="margin:16px auto;max-width:${p.maxWidth || 800}px">${p.html || ''}</div>`;
        }
    },

    /* ----------- LAYOUT / HERO ----------- */

    hero: {
        type: 'hero',
        label: 'Hero Section',
        category: 'hero',
        icon: ICON.hero,
        defaultProps: {
            eyebrow: 'NEW',
            headline: 'A bold promise that stops the scroll',
            subheadline: 'A clear, single-sentence explanation of what this is and why it matters.',
            buttonText: 'Get started',
            buttonUrl: '#',
            secondaryButtonText: '',
            secondaryButtonUrl: '#',
            bgStyle: 'gradient',
            bgColor: '#0a0a0c',
            bgImage: '',
            bgOverlay: 0.4,
            minHeight: 480,
            align: 'center',
            color: '#f5f5f7'
        },
        fields: [
            { key: 'eyebrow', label: 'Eyebrow text (small text above headline)', type: 'text' },
            { key: 'headline', label: 'Headline', type: 'textarea' },
            { key: 'subheadline', label: 'Sub-headline', type: 'textarea' },
            { key: 'buttonText', label: 'Primary button text', type: 'text' },
            { key: 'buttonUrl', label: 'Primary button URL', type: 'url' },
            { key: 'secondaryButtonText', label: 'Secondary button text (optional)', type: 'text' },
            { key: 'secondaryButtonUrl', label: 'Secondary button URL', type: 'url' },
            { key: 'bgStyle', label: 'Background style', type: 'select', options: [
                { value: 'gradient', label: 'Gradient (purple)' },
                { value: 'solid', label: 'Solid color' },
                { value: 'image', label: 'Image' },
                { value: 'mesh', label: 'Mesh gradient' }
            ]},
            { key: 'bgColor', label: 'Background color (solid)', type: 'color' },
            { key: 'bgImage', label: 'Background image URL', type: 'url' },
            { key: 'bgOverlay', label: 'Image overlay opacity (0-1)', type: 'number', min: 0, max: 1 },
            { key: 'minHeight', label: 'Min height (px)', type: 'number', min: 200, max: 1000 },
            { key: 'align', label: 'Content alignment', type: 'align' },
            { key: 'color', label: 'Text color', type: 'color' }
        ],
        render(p) {
            const bgs = {
                gradient: 'background:radial-gradient(circle at 30% 20%, rgba(168,85,247,0.25), transparent 50%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.2), transparent 50%), #0a0a0c',
                solid: `background:${p.bgColor || '#0a0a0c'}`,
                image: p.bgImage
                    ? `background-image:linear-gradient(rgba(0,0,0,${p.bgOverlay ?? 0.4}),rgba(0,0,0,${p.bgOverlay ?? 0.4})),url('${esc(p.bgImage)}');background-size:cover;background-position:center`
                    : 'background:#1a1a1c',
                mesh: 'background:linear-gradient(135deg,#1a0033 0%,#000428 50%,#001830 100%)'
            };
            const bg = bgs[p.bgStyle] || bgs.gradient;
            const flex = `display:flex;flex-direction:column;align-items:${p.align === 'left' ? 'flex-start' : p.align === 'right' ? 'flex-end' : 'center'};justify-content:center;${alignStyle(p.align)}`;
            const c = p.color || '#f5f5f7';
            const btn1 = `display:inline-flex;align-items:center;justify-content:center;padding:18px 36px;background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;border-radius:980px;font-weight:600;font-size:17px;text-decoration:none;box-shadow:0 8px 32px rgba(139,92,246,0.4)`;
            const btn2 = `display:inline-flex;align-items:center;justify-content:center;padding:18px 36px;background:rgba(255,255,255,0.06);color:#fff;border-radius:980px;font-weight:600;font-size:17px;text-decoration:none;border:1px solid rgba(255,255,255,0.18)`;
            return `<div style="${bg};min-height:${p.minHeight || 480}px;border-radius:20px;padding:60px 32px;margin:24px 0;${flex}">
                ${p.eyebrow ? `<div style="display:inline-block;padding:5px 14px;background:rgba(255,255,255,0.08);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.15);border-radius:980px;font-size:12px;font-weight:600;letter-spacing:0.1em;color:${c};margin-bottom:20px">${esc(p.eyebrow)}</div>` : ''}
                <h1 style="font-size:clamp(40px,6vw,72px);font-weight:700;letter-spacing:-0.035em;line-height:1.05;color:${c};margin:0 0 18px;max-width:900px">${esc(p.headline)}</h1>
                ${p.subheadline ? `<p style="font-size:19px;line-height:1.55;color:${c};opacity:0.7;margin:0 0 32px;max-width:600px">${esc(p.subheadline)}</p>` : ''}
                <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:${p.align === 'left' ? 'flex-start' : p.align === 'right' ? 'flex-end' : 'center'}">
                    ${p.buttonText ? `<a href="${esc(p.buttonUrl || '#')}" style="${btn1}">${esc(p.buttonText)}</a>` : ''}
                    ${p.secondaryButtonText ? `<a href="${esc(p.secondaryButtonUrl || '#')}" style="${btn2}">${esc(p.secondaryButtonText)}</a>` : ''}
                </div>
            </div>`;
        }
    },

    featureGrid: {
        type: 'featureGrid',
        label: 'Feature Grid',
        category: 'layout',
        icon: ICON.featureGrid,
        defaultProps: {
            heading: 'Why people love us',
            items: 'Lightning fast||Instant page loads, smooth interactions, zero lag.\nSimple as breathing||No manual to read. You\'ll figure it out in 60 seconds.\nWorks everywhere||Phones, tablets, desktops &mdash; we sweat the responsive details.',
            columns: 3,
            color: '#f5f5f7',
            descColor: '#a1a1a6',
            iconColor: '#a855f7'
        },
        fields: [
            { key: 'heading', label: 'Section heading (optional)', type: 'text' },
            { key: 'items', label: 'Items (Title||Description, one per line)', type: 'textarea' },
            { key: 'columns', label: 'Columns', type: 'select', options: [
                { value: 2, label: '2 columns' }, { value: 3, label: '3 columns' }, { value: 4, label: '4 columns' }
            ]},
            { key: 'color', label: 'Title color', type: 'color' },
            { key: 'descColor', label: 'Description color', type: 'color' },
            { key: 'iconColor', label: 'Icon accent color', type: 'color' }
        ],
        render(p) {
            const rows = parseRows(p.items, 2);
            const cols = +p.columns || 3;
            const items = rows.map((r, i) => `
                <div style="padding:24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px">
                    <div style="width:40px;height:40px;border-radius:10px;background:${p.iconColor || '#a855f7'}22;display:flex;align-items:center;justify-content:center;margin-bottom:14px;color:${p.iconColor || '#a855f7'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
                    </div>
                    <h3 style="font-size:18px;font-weight:600;color:${p.color || '#f5f5f7'};margin:0 0 8px;letter-spacing:-0.01em">${esc(r[0])}</h3>
                    <p style="font-size:14px;line-height:1.55;color:${p.descColor || '#a1a1a6'};margin:0">${esc(r[1])}</p>
                </div>`).join('');
            return `<div style="margin:32px auto;max-width:1100px">
                ${p.heading ? `<h2 style="font-size:36px;font-weight:700;letter-spacing:-0.03em;color:${p.color || '#f5f5f7'};margin:0 0 28px;text-align:center">${esc(p.heading)}</h2>` : ''}
                <div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:14px">${items}</div>
            </div>`;
        }
    },

    stats: {
        type: 'stats',
        label: 'Stats Row',
        category: 'social',
        icon: ICON.stats,
        defaultProps: {
            items: '10k+||Active users\n4.9 / 5||Average rating\n99.9%||Uptime\n45+||Countries',
            color: '#f5f5f7',
            labelColor: '#a1a1a6'
        },
        fields: [
            { key: 'items', label: 'Items (Number||Label, one per line)', type: 'textarea' },
            { key: 'color', label: 'Number color', type: 'color' },
            { key: 'labelColor', label: 'Label color', type: 'color' }
        ],
        render(p) {
            const rows = parseRows(p.items, 2);
            const items = rows.map(r => `
                <div style="text-align:center">
                    <div style="font-size:48px;font-weight:700;letter-spacing:-0.03em;line-height:1;color:${p.color || '#f5f5f7'};margin-bottom:8px">${esc(r[0])}</div>
                    <div style="font-size:13px;letter-spacing:0.04em;color:${p.labelColor || '#a1a1a6'};text-transform:uppercase;font-weight:600">${esc(r[1])}</div>
                </div>`).join('');
            return `<div style="display:grid;grid-template-columns:repeat(${Math.min(rows.length, 4)},minmax(0,1fr));gap:24px;max-width:1000px;margin:32px auto;padding:32px 24px">${items}</div>`;
        }
    },

    faq: {
        type: 'faq',
        label: 'FAQ',
        category: 'social',
        icon: ICON.faq,
        defaultProps: {
            heading: 'Frequently asked questions',
            items: 'How does the free plan work?||The free plan is genuinely free forever. No credit card. No expiry. Upgrade only when you outgrow it.\nCan I export my data?||Yes. Hit Publish on any funnel and you get a standalone HTML file you own.\nIs there a money-back guarantee?||30 days, no questions. Email us and we refund within 24 hours.',
            color: '#f5f5f7',
            answerColor: '#a1a1a6'
        },
        fields: [
            { key: 'heading', label: 'Heading', type: 'text' },
            { key: 'items', label: 'Items (Question||Answer, one per line)', type: 'textarea' },
            { key: 'color', label: 'Question color', type: 'color' },
            { key: 'answerColor', label: 'Answer color', type: 'color' }
        ],
        render(p) {
            const rows = parseRows(p.items, 2);
            const items = rows.map((r, i) => `
                <details style="border-bottom:1px solid rgba(255,255,255,0.08);padding:18px 0" ${i === 0 ? 'open' : ''}>
                    <summary style="cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;font-size:17px;font-weight:600;color:${p.color || '#f5f5f7'};letter-spacing:-0.01em">
                        <span>${esc(r[0])}</span>
                        <span style="color:${p.answerColor || '#a1a1a6'};font-weight:400;transition:transform 0.2s;font-size:24px;line-height:1">+</span>
                    </summary>
                    <div style="padding-top:12px;font-size:15px;line-height:1.6;color:${p.answerColor || '#a1a1a6'}">${esc(r[1])}</div>
                </details>`).join('');
            return `<div style="max-width:760px;margin:32px auto">
                ${p.heading ? `<h2 style="font-size:36px;font-weight:700;letter-spacing:-0.03em;text-align:center;color:${p.color || '#f5f5f7'};margin:0 0 32px">${esc(p.heading)}</h2>` : ''}
                <div>${items}</div>
            </div>`;
        }
    },

    twoColumn: {
        type: 'twoColumn',
        label: 'Two Columns',
        category: 'layout',
        icon: ICON.twoCol,
        defaultProps: {
            leftType: 'image',
            leftImage: '',
            leftText: 'Left column content. You can write HTML or plain text here.',
            rightType: 'text',
            rightImage: '',
            rightText: '<h2 style="font-size:36px;font-weight:700;letter-spacing:-0.03em;margin-bottom:14px">Right side heading</h2><p style="color:#a1a1a6;line-height:1.55;font-size:16px">A short paragraph explaining the value of whatever&apos;s on the left.</p>',
            ratio: '50-50',
            gap: 32,
            alignItems: 'center'
        },
        fields: [
            { key: 'leftType', label: 'Left column type', type: 'select', options: [
                { value: 'text', label: 'Text/HTML' },
                { value: 'image', label: 'Image' }
            ]},
            { key: 'leftImage', label: 'Left image URL (if image)', type: 'url' },
            { key: 'leftText', label: 'Left content (if text)', type: 'textarea' },
            { key: 'rightType', label: 'Right column type', type: 'select', options: [
                { value: 'text', label: 'Text/HTML' },
                { value: 'image', label: 'Image' }
            ]},
            { key: 'rightImage', label: 'Right image URL (if image)', type: 'url' },
            { key: 'rightText', label: 'Right content (if text)', type: 'textarea' },
            { key: 'ratio', label: 'Column ratio', type: 'select', options: [
                { value: '50-50', label: '50 / 50' },
                { value: '60-40', label: '60 / 40' },
                { value: '40-60', label: '40 / 60' },
                { value: '33-67', label: '33 / 67' },
                { value: '67-33', label: '67 / 33' }
            ]},
            { key: 'gap', label: 'Gap between columns (px)', type: 'number', min: 0, max: 96 },
            { key: 'alignItems', label: 'Vertical alignment', type: 'select', options: [
                { value: 'start', label: 'Top' },
                { value: 'center', label: 'Center' },
                { value: 'end', label: 'Bottom' }
            ]}
        ],
        render(p) {
            const ratios = { '50-50': '1fr 1fr', '60-40': '3fr 2fr', '40-60': '2fr 3fr', '33-67': '1fr 2fr', '67-33': '2fr 1fr' };
            const cols = ratios[p.ratio] || '1fr 1fr';
            const colHtml = (type, image, text) => {
                if (type === 'image') {
                    return image
                        ? `<img src="${esc(image)}" alt="" style="width:100%;height:auto;border-radius:14px;display:block">`
                        : `<div style="aspect-ratio:4/3;background:rgba(255,255,255,0.04);border:1.5px dashed rgba(255,255,255,0.15);border-radius:14px;display:flex;align-items:center;justify-content:center;color:#6e6e73;font-size:13px">Add image URL</div>`;
                }
                return `<div>${text || ''}</div>`;
            };
            return `<div style="display:grid;grid-template-columns:${cols};gap:${+p.gap || 32}px;align-items:${p.alignItems || 'center'};max-width:1100px;margin:32px auto;padding:0 8px">
                <div>${colHtml(p.leftType, p.leftImage, p.leftText)}</div>
                <div>${colHtml(p.rightType, p.rightImage, p.rightText)}</div>
            </div>`;
        }
    },

    steps: {
        type: 'steps',
        label: 'Steps / Process',
        category: 'layout',
        icon: ICON.steps,
        defaultProps: {
            heading: 'How it works',
            items: 'Sign up||Create your account in 30 seconds &mdash; no credit card needed.\nBuild||Drag blocks onto the canvas. Customize colors, copy, and layouts.\nLaunch||Publish your funnel and share the link. Track conversions in real time.',
            style: 'vertical',
            accentColor: '#a855f7',
            color: '#f5f5f7',
            descColor: '#a1a1a6'
        },
        fields: [
            { key: 'heading', label: 'Heading (optional)', type: 'text' },
            { key: 'items', label: 'Steps (Title||Description, one per line)', type: 'textarea' },
            { key: 'style', label: 'Layout', type: 'select', options: [
                { value: 'vertical', label: 'Vertical (stacked)' },
                { value: 'horizontal', label: 'Horizontal (side by side)' }
            ]},
            { key: 'accentColor', label: 'Step number color', type: 'color' },
            { key: 'color', label: 'Title color', type: 'color' },
            { key: 'descColor', label: 'Description color', type: 'color' }
        ],
        render(p) {
            const rows = parseRows(p.items, 2);
            const horizontal = p.style === 'horizontal';
            const stepNum = (n) => `<div style="width:36px;height:36px;border-radius:50%;background:${p.accentColor || '#a855f7'}22;color:${p.accentColor || '#a855f7'};display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;border:1.5px solid ${p.accentColor || '#a855f7'}55">${n}</div>`;
            const items = rows.map((r, i) => horizontal
                ? `<div style="text-align:center;padding:16px">
                    <div style="display:flex;justify-content:center;margin-bottom:14px">${stepNum(i + 1)}</div>
                    <h3 style="font-size:18px;font-weight:600;color:${p.color || '#f5f5f7'};margin:0 0 8px;letter-spacing:-0.01em">${esc(r[0])}</h3>
                    <p style="font-size:14px;line-height:1.55;color:${p.descColor || '#a1a1a6'};margin:0">${esc(r[1])}</p>
                </div>`
                : `<div style="display:flex;gap:18px;padding:18px 0;${i < rows.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,0.06)' : ''}">
                    ${stepNum(i + 1)}
                    <div>
                        <h3 style="font-size:19px;font-weight:600;color:${p.color || '#f5f5f7'};margin:6px 0 6px;letter-spacing:-0.01em">${esc(r[0])}</h3>
                        <p style="font-size:15px;line-height:1.55;color:${p.descColor || '#a1a1a6'};margin:0">${esc(r[1])}</p>
                    </div>
                </div>`).join('');
            return `<div style="max-width:${horizontal ? 1100 : 760}px;margin:32px auto">
                ${p.heading ? `<h2 style="font-size:36px;font-weight:700;letter-spacing:-0.03em;text-align:center;color:${p.color || '#f5f5f7'};margin:0 0 32px">${esc(p.heading)}</h2>` : ''}
                <div style="${horizontal ? `display:grid;grid-template-columns:repeat(${rows.length},minmax(0,1fr));gap:18px` : ''}">${items}</div>
            </div>`;
        }
    },

    tabs: {
        type: 'tabs',
        label: 'Tabs',
        category: 'layout',
        icon: ICON.tabs,
        defaultProps: {
            items: 'Overview||A short paragraph for the overview tab. You can use HTML here for more control.\nFeatures||List the main features in this tab. Different content shows depending on which tab is active.\nFAQ||Answers to common questions go here.',
            accentColor: '#a855f7',
            color: '#f5f5f7'
        },
        fields: [
            { key: 'items', label: 'Tabs (Title||Content, one per line)', type: 'textarea' },
            { key: 'accentColor', label: 'Accent color', type: 'color' },
            { key: 'color', label: 'Text color', type: 'color' }
        ],
        render(p) {
            const rows = parseRows(p.items, 2);
            const titles = rows.map((r, i) => `<button data-tab="${i}" style="padding:12px 20px;background:transparent;color:${i === 0 ? p.color : '#a1a1a6'};border:none;border-bottom:2px solid ${i === 0 ? (p.accentColor || '#a855f7') : 'transparent'};font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.15s">${esc(r[0])}</button>`).join('');
            const panels = rows.map((r, i) => `<div data-panel="${i}" style="display:${i === 0 ? 'block' : 'none'};padding:24px 0;color:${p.color || '#f5f5f7'};font-size:15px;line-height:1.6">${r[1]}</div>`).join('');
            const tabId = 'tabs_' + Math.random().toString(36).slice(2, 8);
            return `<div data-ff-tabs="${tabId}" style="max-width:760px;margin:32px auto">
                <div style="display:flex;gap:4px;border-bottom:1px solid rgba(255,255,255,0.08);overflow-x:auto">${titles}</div>
                <div>${panels}</div>
                <script>
                (function(){var r=document.querySelector('[data-ff-tabs="${tabId}"]');if(!r)return;r.querySelectorAll('[data-tab]').forEach(function(b){b.onclick=function(){r.querySelectorAll('[data-tab]').forEach(function(x,i){x.style.color=x===b?'${p.color||'#f5f5f7'}':'#a1a1a6';x.style.borderBottomColor=x===b?'${p.accentColor||'#a855f7'}':'transparent';});var idx=b.getAttribute('data-tab');r.querySelectorAll('[data-panel]').forEach(function(p){p.style.display=p.getAttribute('data-panel')===idx?'block':'none';});};});})();
                <\/script>
            </div>`;
        }
    },

    accordion: {
        type: 'accordion',
        label: 'Accordion',
        category: 'layout',
        icon: ICON.accordion,
        defaultProps: {
            items: 'Section one||Content for section one. Supports HTML.\nSection two||Content for section two.\nSection three||Content for section three.',
            color: '#f5f5f7',
            contentColor: '#a1a1a6',
            allowMultiple: false
        },
        fields: [
            { key: 'items', label: 'Items (Title||Content, one per line)', type: 'textarea' },
            { key: 'color', label: 'Title color', type: 'color' },
            { key: 'contentColor', label: 'Content color', type: 'color' },
            { key: 'allowMultiple', label: 'Allow multiple open at once', type: 'toggle' }
        ],
        render(p) {
            const rows = parseRows(p.items, 2);
            const items = rows.map((r, i) => `
                <details ${p.allowMultiple ? '' : `name="acc_${Math.random().toString(36).slice(2, 8)}"`} style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;margin-bottom:8px">
                    <summary style="cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:600;color:${p.color || '#f5f5f7'}">
                        <span>${esc(r[0])}</span>
                        <span style="color:${p.contentColor || '#a1a1a6'};font-size:22px;line-height:1;font-weight:300">+</span>
                    </summary>
                    <div style="padding:12px 0 0;font-size:14px;line-height:1.6;color:${p.contentColor || '#a1a1a6'}">${r[1]}</div>
                </details>`).join('');
            return `<div style="max-width:760px;margin:24px auto">${items}</div>`;
        }
    },

    /* ----------- SOCIAL ----------- */

    testimonial: {
        type: 'testimonial',
        label: 'Testimonial',
        category: 'social',
        icon: ICON.testimonial,
        defaultProps: {
            quote: 'This completely transformed how I think about my work. Worth every penny.',
            author: 'Alex Rivera',
            role: 'Founder, Acme Co',
            avatar: '',
            rating: 5
        },
        fields: [
            { key: 'quote', label: 'Quote', type: 'textarea' },
            { key: 'author', label: 'Author name', type: 'text' },
            { key: 'role', label: 'Author role/company', type: 'text' },
            { key: 'avatar', label: 'Avatar URL (optional)', type: 'url' },
            { key: 'rating', label: 'Star rating (0-5)', type: 'number', min: 0, max: 5 }
        ],
        render(p) {
            const avatar = p.avatar
                ? `<img src="${esc(p.avatar)}" alt="" style="width:48px;height:48px;border-radius:50%;object-fit:cover">`
                : `<div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#6366f1);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px">${esc((p.author || '?')[0])}</div>`;
            const stars = p.rating ? `<div style="margin-bottom:14px;color:#fbbf24;font-size:16px;letter-spacing:2px">${'★'.repeat(+p.rating)}${'☆'.repeat(5 - +p.rating)}</div>` : '';
            return `<div style="max-width:600px;margin:24px auto;padding:28px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px">
                ${stars}
                <div style="font-size:18px;line-height:1.55;color:#f5f5f7;margin-bottom:18px;font-style:italic">&ldquo;${esc(p.quote)}&rdquo;</div>
                <div style="display:flex;align-items:center;gap:12px">
                    ${avatar}
                    <div>
                        <div style="font-weight:600;color:#f5f5f7;font-size:14px">${esc(p.author)}</div>
                        <div style="color:#a1a1a6;font-size:13px">${esc(p.role)}</div>
                    </div>
                </div>
            </div>`;
        }
    },

    logos: {
        type: 'logos',
        label: 'Logo Strip',
        category: 'social',
        icon: ICON.logos,
        defaultProps: {
            label: 'Trusted by teams at',
            logos: ''
        },
        fields: [
            { key: 'label', label: 'Label above logos', type: 'text' },
            { key: 'logos', label: 'Logo URLs (one per line)', type: 'textarea' }
        ],
        render(p) {
            const urls = (p.logos || '').split('\n').map(s => s.trim()).filter(Boolean);
            const items = urls.length
                ? urls.map(u => `<img src="${esc(u)}" alt="" style="height:32px;opacity:0.6;filter:grayscale(1) brightness(2)">`).join('')
                : '<div style="color:#6e6e73;font-size:13px">Add logo URLs in properties &rarr;</div>';
            return `<div style="text-align:center;margin:24px 0">
                ${p.label ? `<div style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#6e6e73;margin-bottom:18px">${esc(p.label)}</div>` : ''}
                <div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:36px">${items}</div>
            </div>`;
        }
    },

    socialIcons: {
        type: 'socialIcons',
        label: 'Social Icons',
        category: 'social',
        icon: ICON.socialIcons,
        defaultProps: {
            twitter: '',
            instagram: '',
            youtube: '',
            tiktok: '',
            linkedin: '',
            github: '',
            email: '',
            size: 22,
            color: '#a1a1a6',
            hoverColor: '#f5f5f7',
            align: 'center'
        },
        fields: [
            { key: 'twitter', label: 'Twitter / X URL', type: 'url' },
            { key: 'instagram', label: 'Instagram URL', type: 'url' },
            { key: 'youtube', label: 'YouTube URL', type: 'url' },
            { key: 'tiktok', label: 'TikTok URL', type: 'url' },
            { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
            { key: 'github', label: 'GitHub URL', type: 'url' },
            { key: 'email', label: 'Email (mailto link)', type: 'text' },
            { key: 'align', label: 'Alignment', type: 'align' },
            { key: 'size', label: 'Icon size (px)', type: 'number', min: 14, max: 48 },
            { key: 'color', label: 'Color', type: 'color' }
        ],
        render(p) {
            const sz = +p.size || 22;
            const icons = {
                twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.97 6.817H1.674l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
                instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
                youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
                tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.16a8.16 8.16 0 003.77.92V5.66a4.83 4.83 0 01-.84-.05z"/></svg>',
                linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
                email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>'
            };
            const links = Object.keys(icons).map(key => {
                const url = key === 'email' ? (p[key] ? `mailto:${p[key]}` : '') : p[key];
                if (!url) return '';
                return `<a href="${esc(url)}" target="_blank" rel="noopener" style="width:${sz + 14}px;height:${sz + 14}px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:${p.color || '#a1a1a6'};transition:all 0.2s"><span style="width:${sz}px;height:${sz}px;display:inline-block">${icons[key]}</span></a>`;
            }).filter(Boolean).join('');
            return `<div style="display:flex;justify-content:${p.align === 'left' ? 'flex-start' : p.align === 'right' ? 'flex-end' : 'center'};gap:10px;margin:18px 0">${links || '<div style="color:#6e6e73;font-size:13px">Add at least one social URL in properties</div>'}</div>`;
        }
    },

    /* ----------- LAYOUT (basic) ----------- */

    divider: {
        type: 'divider',
        label: 'Divider',
        category: 'layout',
        icon: ICON.divider,
        defaultProps: { color: 'rgba(255,255,255,0.12)', thickness: 1, style: 'solid', maxWidth: 0 },
        fields: [
            { key: 'color', label: 'Color', type: 'color' },
            { key: 'thickness', label: 'Thickness (px)', type: 'number', min: 1, max: 10 },
            { key: 'style', label: 'Style', type: 'select', options: [
                { value: 'solid', label: 'Solid' },
                { value: 'dashed', label: 'Dashed' },
                { value: 'dotted', label: 'Dotted' }
            ]},
            { key: 'maxWidth', label: 'Max width (px, 0 = full)', type: 'number', min: 0, max: 1400 }
        ],
        render(p) {
            const w = +p.maxWidth ? `max-width:${p.maxWidth}px;margin-left:auto;margin-right:auto;` : '';
            return `<hr style="border:none;border-top:${p.thickness || 1}px ${p.style || 'solid'} ${p.color || 'rgba(255,255,255,0.12)'};margin:24px 0;${w}">`;
        }
    },

    spacer: {
        type: 'spacer',
        label: 'Spacer',
        category: 'layout',
        icon: ICON.spacer,
        defaultProps: { height: 48 },
        fields: [
            { key: 'height', label: 'Height (px)', type: 'number', min: 4, max: 400 }
        ],
        render(p) {
            return `<div style="height:${p.height || 48}px"></div>`;
        }
    }
};

/* ============================================================
   Block creation, rendering, helpers
   ============================================================ */

function createBlock(type) {
    const def = Blocks[type];
    if (!def) return null;
    return {
        id: `blk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        type,
        props: JSON.parse(JSON.stringify(def.defaultProps))
    };
}

/* Render a single block — wraps the block-specific output with the optional style wrapper */
function renderBlock(block) {
    const def = Blocks[block.type];
    if (!def) return `<div style="padding:16px;color:#ff453a">Unknown block: ${esc(block.type)}</div>`;
    const inner = def.render(block.props || {});
    const styleProps = (block.props && block.props._style) || null;
    if (!styleProps) return inner;
    const wrapStyles = buildWrapStyle(styleProps);
    if (!wrapStyles && (!styleProps.anim || styleProps.anim === 'none')) return inner;
    return `<div${wrapStyles ? ` style="${wrapStyles}"` : ''}${animAttr(styleProps)}>${inner}</div>`;
}

function renderPageInner(page) {
    if (!page || !page.blocks || page.blocks.length === 0) {
        return '<div style="padding:80px 24px;text-align:center;color:#6e6e73">Empty page &mdash; add some blocks!</div>';
    }
    return page.blocks.map(b => renderBlock(b)).join('');
}

const BLOCK_CATEGORIES = [
    { id: 'hero', label: 'Hero', blocks: ['hero'] },
    { id: 'text', label: 'Text', blocks: ['headline', 'paragraph', 'quote', 'bulletList'] },
    { id: 'action', label: 'Action', blocks: ['button', 'form', 'pricing', 'countdown'] },
    { id: 'media', label: 'Media', blocks: ['image', 'video', 'htmlEmbed'] },
    { id: 'layout', label: 'Layout', blocks: ['featureGrid', 'twoColumn', 'steps', 'tabs', 'accordion', 'divider', 'spacer'] },
    { id: 'social', label: 'Social Proof', blocks: ['testimonial', 'stats', 'logos', 'socialIcons', 'faq'] }
];

/* Countdown ticker — supports urgent color switch */
function startCountdowns(root = document) {
    const els = root.querySelectorAll('[data-ff-countdown]');
    els.forEach(el => {
        if (el._tickId) clearInterval(el._tickId);
        const target = +el.getAttribute('data-ff-countdown');
        const urgentColor = el.getAttribute('data-urgent-color') || '';
        const urgentBelowMin = +el.getAttribute('data-urgent-below') || 0;
        const baseColor = el.style.color;
        const tick = () => {
            const ms = target - Date.now();
            const clamp = (n) => Math.max(0, n);
            const days = clamp(Math.floor(ms / 86400_000));
            const hours = clamp(Math.floor(ms / 3600_000) % 24);
            const mins = clamp(Math.floor(ms / 60_000) % 60);
            const secs = clamp(Math.floor(ms / 1000) % 60);
            const set = (u, v) => {
                const node = el.querySelector(`[data-u="${u}"]`);
                if (node) node.textContent = String(v).padStart(2, '0');
            };
            set('days', days); set('hours', hours); set('mins', mins); set('secs', secs);
            if (urgentColor && urgentBelowMin > 0 && ms < urgentBelowMin * 60_000 && ms > 0) {
                el.style.color = urgentColor;
            } else if (baseColor) {
                el.style.color = baseColor;
            }
        };
        tick();
        el._tickId = setInterval(tick, 1000);
    });
}

/* IntersectionObserver-based scroll animations for [data-ff-anim] */
function startAnimations(root = document) {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('ff-anim-in');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    root.querySelectorAll('[data-ff-anim]').forEach(el => obs.observe(el));
}
