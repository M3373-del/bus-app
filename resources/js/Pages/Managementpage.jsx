// resources/js/Pages/ManagementPage.jsx
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function ManagementPage() {
    const [tab, setTab] = useState('trajets');
    const [buses, setBuses] = useState([]);
    const [chauffeurs, setChauffeurs] = useState([]);
    const [trajets, setTrajets] = useState([]);
    const [heures, setHeures] = useState([]);
    const [modal, setModal] = useState(null);
    const [del, setDel] = useState(null);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const load = async () => {
        setLoading(true);
        try {
            const [b, c, t, h] = await Promise.all([
                fetch('/buses', { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }).then(r => r.json()),
                fetch('/chauffeurs', { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }).then(r => r.json()),
                fetch('/trajets/all', { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }).then(r => r.json()),
                fetch('/heures', { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }).then(r => r.json()),
            ]);
            setBuses(Array.isArray(b) ? b : []);
            setChauffeurs(Array.isArray(c) ? c : []);
            setTrajets(Array.isArray(t) ? t : []);
            setHeures(Array.isArray(h) ? h : []);
        } catch (e) { showToast('❌ Erreur de chargement'); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleSave = (type, data, id) => {
        const url = id ? `/${type}/${id}` : `/${type}`;
        const method = id ? 'put' : 'post';
        router[method](url, data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => { load(); setModal(null); showToast(id ? '✅ Modifié' : '✅ Ajouté'); },
            onError: (errors) => { showToast('❌ ' + (Object.values(errors)[0] || 'Erreur')); },
        });
    };

    const handleDelete = (type, id) => {
        router.delete(`/${type}/${id}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => { load(); setDel(null); showToast('🗑️ Supprimé'); },
            onError: () => showToast('❌ Erreur suppression'),
        });
    };

    const tabs = [
        { key: 'trajets', label: '🗺️ Trajets' },
        { key: 'buses', label: '🚌 Bus' },
        { key: 'chauffeurs', label: '🧑‍✈️ Chauffeurs' },
        { key: 'heures', label: '⏰ Horaires' },
    ];

    return (
        <>
            <style>{css}</style>
            <div className="mgmt-tabs">
                {tabs.map(t => (
                    <button key={t.key} className={`mtab${tab === t.key ? ' on' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
                ))}
            </div>

            {loading && <div className="loading">Chargement...</div>}

            {!loading && tab === 'trajets' && (
                <Section title="Gestion des Trajets" count={trajets.length} onAdd={() => setModal({ type: 'trajets', item: null })}>
                    <div className="cards">
                        {trajets.map(t => (
                            <div key={t.id} className="mgmt-card">
                                <div className="mc-head">
                                    <div>
                                        <div className="mc-name">🚌 {t.bus?.name}</div>
                                        <div className="mc-sub">🧑‍✈️ {t.chauffeur?.name || '—'} · ⏰ {t.heure?.label || '—'}</div>
                                    </div>
                                    <div className="mc-actions">
                                        <button className="btn-e" onClick={() => setModal({ type: 'trajets', item: t })}>✏️</button>
                                        <button className="btn-d" onClick={() => setDel({ type: 'trajets', id: t.id, name: t.bus?.name + ' #' + t.id })}>🗑️</button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', marginTop: 8 }}>
                                    <span className="t-depart">🏫 UM6P</span>
                                    <span className="t-arr">→</span>
                                    {t.arrets?.map((a, i) => (
                                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span className="t-pill">📍 {a}</span>
                                            {i < t.arrets.length - 1 && <span className="t-arr">→</span>}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                                    {t.heure?.liste_heures?.map(h => <span key={h} className="h-tag">{h}</span>)}
                                </div>
                            </div>
                        ))}
                        {trajets.length === 0 && <Empty />}
                    </div>
                </Section>
            )}

            {!loading && tab === 'buses' && (
                <Section title="Gestion des Bus" count={buses.length} onAdd={() => setModal({ type: 'buses', item: null })}>
                    <div className="cards">
                        {buses.map(b => (
                            <div key={b.id} className="mgmt-card">
                                <div className="mc-head">
                                    <div>
                                        <div className="mc-name">🚌 {b.name}</div>
                                        <div className="mc-sub">{b.nombre_places} places</div>
                                    </div>
                                    <div className="mc-actions">
                                        <button className="btn-e" onClick={() => setModal({ type: 'buses', item: b })}>✏️</button>
                                        <button className="btn-d" onClick={() => setDel({ type: 'buses', id: b.id, name: b.name })}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {buses.length === 0 && <Empty />}
                    </div>
                </Section>
            )}

            {!loading && tab === 'chauffeurs' && (
                <Section title="Gestion des Chauffeurs" count={chauffeurs.length} onAdd={() => setModal({ type: 'chauffeurs', item: null })}>
                    <div className="cards">
                        {chauffeurs.map(c => (
                            <div key={c.id} className="mgmt-card">
                                <div className="mc-head">
                                    <div><div className="mc-name">🧑‍✈️ {c.name}</div><div className="mc-sub">{c.phone || '—'} · CIN: {c.cin || '—'}</div></div>
                                    <div className="mc-actions">
                                        <button className="btn-e" onClick={() => setModal({ type: 'chauffeurs', item: c })}>✏️</button>
                                        <button className="btn-d" onClick={() => setDel({ type: 'chauffeurs', id: c.id, name: c.name })}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {chauffeurs.length === 0 && <Empty />}
                    </div>
                </Section>
            )}

            {!loading && tab === 'heures' && (
                <Section title="Gestion des Horaires" count={heures.length} onAdd={() => setModal({ type: 'heures', item: null })}>
                    <div className="cards">
                        {heures.map(h => (
                            <div key={h.id} className="mgmt-card">
                                <div className="mc-head">
                                    <div><div className="mc-name">⏰ {h.label || 'Horaire #' + h.id}</div><div className="mc-sub">{h.liste_heures?.length} départs</div></div>
                                    <div className="mc-actions">
                                        <button className="btn-e" onClick={() => setModal({ type: 'heures', item: h })}>✏️</button>
                                        <button className="btn-d" onClick={() => setDel({ type: 'heures', id: h.id, name: h.label || '#' + h.id })}>🗑️</button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                                    {h.liste_heures?.map(t => <span key={t} className="h-tag">{t}</span>)}
                                </div>
                            </div>
                        ))}
                        {heures.length === 0 && <Empty />}
                    </div>
                </Section>
            )}

            {modal && (
                <FormModal type={modal.type} item={modal.item}
                    buses={buses} chauffeurs={chauffeurs} heures={heures}
                    onClose={() => setModal(null)}
                    onSave={(data) => handleSave(modal.type, data, modal.item?.id)} />
            )}

            {del && (
                <div className="overlay" onClick={e => e.target === e.currentTarget && setDel(null)}>
                    <div className="del-modal">
                        <div style={{ fontSize: 44, marginBottom: 14 }}>🗑️</div>
                        <div className="del-title">Supprimer "{del.name}" ?</div>
                        <div className="del-sub">Cette action est irréversible.</div>
                        <button className="btn-danger" onClick={() => handleDelete(del.type, del.id)}>Supprimer définitivement</button>
                        <button className="btn-cancel2" onClick={() => setDel(null)}>Annuler</button>
                    </div>
                </div>
            )}

            {toast && <div className="toast">{toast}</div>}
        </>
    );
}

function Section({ title, count, onAdd, children }) {
    return (
        <div>
            <div className="sec-header">
                <div><h2 className="sec-title">{title}</h2><span className="sec-count">{count} enregistrements</span></div>
                <button className="btn-add" onClick={onAdd}>＋ Ajouter</button>
            </div>
            {children}
        </div>
    );
}

function TagInput({ value, onChange, placeholder }) {
    const [inp, setInp] = useState('');
    const add = (v) => { const t = v.trim(); if (t && !value.includes(t)) onChange([...value, t]); setInp(''); };
    return (
        <div className="tag-wrap">
            {value.map(t => (
                <span key={t} className="tag-chip">{t}
                    <button type="button" className="tag-x" onClick={() => onChange(value.filter(x => x !== t))}>×</button>
                </span>
            ))}
            <input className="tag-field" value={inp} placeholder={value.length === 0 ? placeholder : ''}
                onChange={e => setInp(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(inp); } if (e.key === 'Backspace' && !inp) onChange(value.slice(0, -1)); }}
                onBlur={() => { if (inp.trim()) add(inp); }} />
        </div>
    );
}

function FormModal({ type, item, buses, chauffeurs, heures, onClose, onSave }) {
    const [form, setForm] = useState(() => {
        if (item) return { ...item };
        if (type === 'trajets') return { bus_id: '', chauffeur_id: '', heure_id: '', arrets: [] };
        if (type === 'buses') return { name: '', nombre_places: '' };
        if (type === 'chauffeurs') return { name: '', phone: '', cin: '' };
        if (type === 'heures') return { label: '', liste_heures: [] };
    });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const titles = { trajets: '🗺️ Trajet', buses: '🚌 Bus', chauffeurs: '🧑‍✈️ Chauffeur', heures: '⏰ Horaire' };

    return (
        <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="form-modal">
                <div className="fm-handle" />
                <h3 className="fm-title">{item ? 'Modifier' : 'Ajouter'} {titles[type]}</h3>

                {type === 'trajets' && (
                    <div className="fm-grid">
                        <div className="field">
                            <label className="lbl">Bus</label>
                            <select className="sel" value={form.bus_id} onChange={e => set('bus_id', e.target.value)}>
                                <option value="">Choisir...</option>
                                {buses.map(b => <option key={b.id} value={b.id}>{b.name} ({b.nombre_places} places)</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label className="lbl">Chauffeur</label>
                            <select className="sel" value={form.chauffeur_id} onChange={e => set('chauffeur_id', e.target.value)}>
                                <option value="">Choisir...</option>
                                {chauffeurs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                            <label className="lbl">Horaire</label>
                            <select className="sel" value={form.heure_id} onChange={e => set('heure_id', e.target.value)}>
                                <option value="">Choisir...</option>
                                {heures.map(h => <option key={h.id} value={h.id}>{h.label} ({h.liste_heures?.join(', ')})</option>)}
                            </select>
                        </div>
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                            <label className="lbl">Arrêts (Entrée pour ajouter)</label>
                            <TagInput value={form.arrets || []} onChange={v => set('arrets', v)} placeholder="Ex: OCP6, NAKHIL..." />
                        </div>
                    </div>
                )}

                {type === 'buses' && (
                    <div className="fm-grid">
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                            <label className="lbl">Nom du Bus</label>
                            <input className="inp" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: BUS1" />
                        </div>
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                            <label className="lbl">Nombre de Places</label>
                            <input className="inp" type="number" min="1" value={form.nombre_places} onChange={e => set('nombre_places', e.target.value)} />
                        </div>
                    </div>
                )}

                {type === 'chauffeurs' && (
                    <div className="fm-grid">
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                            <label className="lbl">Nom complet</label>
                            <input className="inp" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Mohammed Alami" />
                        </div>
                        <div className="field">
                            <label className="lbl">Téléphone</label>
                            <input className="inp" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="06xxxxxxxx" />
                        </div>
                        <div className="field">
                            <label className="lbl">CIN</label>
                            <input className="inp" value={form.cin || ''} onChange={e => set('cin', e.target.value)} placeholder="AB123456" />
                        </div>
                    </div>
                )}

                {type === 'heures' && (
                    <div className="fm-grid">
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                            <label className="lbl">Label</label>
                            <input className="inp" value={form.label || ''} onChange={e => set('label', e.target.value)} placeholder="Ex: Horaire Matin" />
                        </div>
                        <div className="field" style={{ gridColumn: '1/-1' }}>
                            <label className="lbl">Heures (HH:MM, Entrée pour ajouter)</label>
                            <TagInput value={form.liste_heures || []} onChange={v => set('liste_heures', v)} placeholder="Ex: 07:00" />
                        </div>
                    </div>
                )}

                <button className="btn-save" onClick={() => onSave(form)}>
                    {item ? '💾 Enregistrer' : '✅ Créer'}
                </button>
                <button className="btn-cancel2" onClick={onClose}>Annuler</button>
            </div>
        </div>
    );
}

function Empty() {
    return <div className="empty" style={{ gridColumn: '1/-1' }}><div style={{ fontSize: 40 }}>📭</div><p>Aucun enregistrement</p></div>;
}

const css = `
.loading{text-align:center;padding:60px;color:#6b8072;font-weight:600}
.mgmt-tabs{display:flex;gap:4px;background:#ebf4ee;border-radius:13px;padding:4px;margin-bottom:24px;flex-wrap:wrap}
.mtab{padding:8px 16px;border-radius:10px;border:none;background:none;font-size:13px;font-weight:700;cursor:pointer;color:#6b8072;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s;white-space:nowrap}
.mtab.on{background:#fff;color:#1a6b3a;box-shadow:0 2px 8px rgba(10,40,20,.08)}
.sec-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:10px}
.sec-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#0d1f15}
.sec-count{font-size:12px;color:#6b8072;font-weight:600}
.btn-add{background:linear-gradient(135deg,#1a6b3a,#22913f);color:#fff;border:none;padding:10px 18px;border-radius:11px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 4px 12px rgba(26,107,58,.3);transition:all .2s}
.btn-add:hover{transform:translateY(-1px)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.mgmt-card{background:#fff;border-radius:16px;border:1px solid #daeade;padding:18px;transition:box-shadow .18s}
.mgmt-card:hover{box-shadow:0 8px 24px rgba(10,40,20,.11)}
.mc-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.mc-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#0d1f15}
.mc-sub{font-size:12px;color:#6b8072;margin-top:3px}
.mc-actions{display:flex;gap:6px;flex-shrink:0}
.btn-e,.btn-d{padding:6px 10px;border-radius:8px;border:none;cursor:pointer;font-size:13px;transition:all .15s}
.btn-e{background:#e8f8ed;color:#1a6b3a}.btn-e:hover{background:#c8ecd3}
.btn-d{background:#fee2e2;color:#dc2626}.btn-d:hover{background:#fecaca}
.h-tag{background:#ebf4ee;border:1.5px solid #daeade;color:#2a3d30;border-radius:7px;padding:3px 9px;font-size:12px;font-weight:700}
.t-depart{background:linear-gradient(135deg,#1a6b3a,#22913f);color:#fff;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700}
.t-pill{background:#f4f9f5;border:1px solid #daeade;color:#2a3d30;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:600}
.t-arr{color:#9fb8a8;font-size:11px;font-weight:700}
.cap-row{display:flex;justify-content:space-between;font-size:11px;color:#6b8072;font-weight:600;margin-bottom:5px}
.cap-track{height:5px;background:#ebf4ee;border-radius:99px;overflow:hidden}
.cap-fill{height:100%;border-radius:99px;transition:width .5s}
.f-green{background:linear-gradient(90deg,#2db554,#1a6b3a)}
.empty{text-align:center;padding:50px 20px}
.empty p{font-size:14px;font-weight:700;color:#6b8072;margin-top:10px}
.overlay{position:fixed;inset:0;background:rgba(10,30,18,.55);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;z-index:200;animation:ovIn .25s ease}
@media(min-width:600px){.overlay{align-items:center;padding:20px}}
@keyframes ovIn{from{opacity:0}to{opacity:1}}
.form-modal{background:#fff;border-radius:26px 26px 0 0;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,.25);padding:12px 28px 36px;animation:shUp .35s cubic-bezier(.34,1.2,.64,1) both}
@media(min-width:600px){.form-modal{border-radius:26px;animation:popIn .3s cubic-bezier(.34,1.4,.64,1) both}}
@keyframes shUp{from{transform:translateY(100%)}to{transform:none}}
@keyframes popIn{from{opacity:0;transform:scale(.93) translateY(16px)}to{opacity:1;transform:none}}
.fm-handle{width:40px;height:4px;background:#daeade;border-radius:99px;margin:0 auto 22px}
@media(min-width:600px){.fm-handle{display:none}}
.fm-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#0d1f15;margin-bottom:22px}
.fm-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px}
@media(max-width:480px){.fm-grid{grid-template-columns:1fr}}
.field{margin-bottom:4px}
.lbl{display:block;font-size:11px;font-weight:800;color:#2a3d30;text-transform:uppercase;letter-spacing:.3px;margin-bottom:6px}
.inp{width:100%;padding:11px 13px;border:2px solid #daeade;border-radius:11px;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;background:#f4f9f5;outline:none;color:#0d1f15;transition:all .2s;box-sizing:border-box}
.inp:focus{border-color:#1a6b3a;background:#fff;box-shadow:0 0 0 4px rgba(26,107,58,.1)}
.sel{width:100%;padding:11px 13px;border:2px solid #daeade;border-radius:11px;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;background:#f4f9f5;outline:none;color:#0d1f15;cursor:pointer;transition:all .2s;box-sizing:border-box}
.sel:focus{border-color:#1a6b3a;box-shadow:0 0 0 4px rgba(26,107,58,.1)}
.tag-wrap{min-height:44px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px 10px;border:2px solid #daeade;border-radius:11px;background:#f4f9f5;cursor:text;transition:all .2s}
.tag-wrap:focus-within{border-color:#1a6b3a;background:#fff;box-shadow:0 0 0 4px rgba(26,107,58,.1)}
.tag-chip{display:flex;align-items:center;gap:4px;background:#e8f8ed;color:#1a6b3a;border:1px solid #c8ecd3;border-radius:7px;padding:3px 4px 3px 9px;font-size:12px;font-weight:700}
.tag-x{width:18px;height:18px;border-radius:5px;background:rgba(26,107,58,.15);border:none;cursor:pointer;color:#1a6b3a;font-size:14px;display:flex;align-items:center;justify-content:center;font-weight:800}
.tag-x:hover{background:rgba(26,107,58,.3)}
.tag-field{border:none;outline:none;background:transparent;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:#0d1f15;min-width:100px;flex:1}
.btn-save{width:100%;padding:13px;background:linear-gradient(135deg,#1a6b3a,#22913f);color:#fff;border:none;border-radius:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 4px 14px rgba(26,107,58,.4);transition:all .2s;margin-top:18px;display:flex;align-items:center;justify-content:center}
.btn-save:hover{transform:translateY(-1px)}
.btn-cancel2{display:block;width:100%;text-align:center;background:none;border:none;color:#6b8072;font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;margin-top:10px;padding:8px}
.btn-cancel2:hover{color:#dc2626}
.del-modal{background:#fff;border-radius:26px 26px 0 0;width:100%;max-width:380px;padding:32px 28px;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,.25);animation:shUp .35s cubic-bezier(.34,1.2,.64,1) both}
@media(min-width:600px){.del-modal{border-radius:26px;animation:popIn .3s cubic-bezier(.34,1.4,.64,1) both}}
.del-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#0d1f15;margin-bottom:8px}
.del-sub{font-size:14px;color:#6b8072;margin-bottom:22px}
.btn-danger{width:100%;padding:13px;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 4px 12px rgba(220,38,38,.4);transition:all .2s}
.btn-danger:hover{transform:translateY(-1px)}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0f4024;color:#fff;border-radius:14px;padding:14px 22px;font-size:14px;font-weight:700;box-shadow:0 20px 48px rgba(0,0,0,.2);z-index:300;animation:toastIn .4s cubic-bezier(.34,1.4,.64,1) both;white-space:nowrap}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
`;