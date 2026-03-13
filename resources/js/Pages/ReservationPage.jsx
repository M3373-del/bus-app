// resources/js/Pages/ReservationPage.jsx
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function ReservationPage() {
    const [trajets, setTrajets] = useState([]);
    const [myRes, setMyRes] = useState([]);
    const [view, setView] = useState('trajets');
    const [selectedTrajet, setSelectedTrajet] = useState(null);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadTrajets = () => {
        fetch('/trajets', { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.json()).then(d => setTrajets(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
    };

    const loadMyRes = () => {
        fetch('/my-reservations', { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.json()).then(d => setMyRes(Array.isArray(d) ? d : []));
    };

    useEffect(() => { loadTrajets(); }, []);
    useEffect(() => { if (view === 'mine') loadMyRes(); }, [view]);

    const showToast = (msg, type = 'ok') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

    const handleReserve = (trajet, heure, arret) => {
        router.post(`/trajets/${trajet.id}/reserve`, { heure, arret }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                showToast('✅ Réservation confirmée !');
                setSelectedTrajet(null);
                setView('mine');
                loadMyRes();
            },
            onError: (errors) => {
                showToast('❌ ' + (Object.values(errors)[0] || 'Erreur'), 'err');
            },
        });
    };

    const handleCancel = (id) => {
        router.delete(`/reservations/${id}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setMyRes(r => r.filter(x => x.id !== id));
                showToast('🗑️ Réservation annulée');
            },
            onError: () => showToast('❌ Erreur', 'err'),
        });
    };

    return (
        <>
            <style>{css}</style>
            <div className="sub-tabs">
                <button className={`stab${view === 'trajets' ? ' on' : ''}`} onClick={() => setView('trajets')}>🗺️ Trajets disponibles</button>
                <button className={`stab${view === 'mine' ? ' on' : ''}`} onClick={() => setView('mine')}>
                    📋 Mes réservations
                    {myRes.length > 0 && <span className="stab-c">{myRes.length}</span>}
                </button>
            </div>

            {view === 'trajets' && (
                loading ? <div className="loading">Chargement des trajets...</div> : (
                    <div className="bus-grid">
                        {trajets.map(t => <TrajetCard key={t.id} trajet={t} onSelect={setSelectedTrajet} />)}
                        {trajets.length === 0 && <div className="empty"><div className="empty-e">🗺️</div><p>Aucun trajet disponible</p></div>}
                    </div>
                )
            )}

            {view === 'mine' && (
                <div className="res-list">
                    {myRes.length === 0 ? (
                        <div className="empty"><div className="empty-e">🎫</div><p>Aucune réservation</p><span>Sélectionnez un trajet pour commencer</span></div>
                    ) : myRes.map(r => (
                        <div key={r.id} className="res-item">
                            <div className="res-icon">🚌</div>
                            <div className="res-info">
                                <div className="res-name">{r.trajet?.bus?.name}</div>
                                <div className="res-meta">
                                    {r.trajet?.chauffeur?.name && <span>🧑‍✈️ {r.trajet.chauffeur.name}</span>}
                                    <span> · 📍 {r.arret}</span>
                                    <span> · ⏱ {r.heure}</span>
                                </div>
                            </div>
                            <span className={`res-badge ${r.status === 'confirmed' ? 'ok' : 'wait'}`}>
                                {r.status === 'confirmed' ? '✓ Confirmé' : '⏳ Attente'}
                            </span>
                            <button className="res-cancel" onClick={() => handleCancel(r.id)}>✕</button>
                        </div>
                    ))}
                </div>
            )}

            {selectedTrajet && (
                <ReservationModal trajet={selectedTrajet} onClose={() => setSelectedTrajet(null)} onConfirm={handleReserve} />
            )}

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </>
    );
}

function TrajetCard({ trajet, onSelect }) {
    const confirmed = trajet.confirmed_count || 0;
    const places    = trajet.bus?.nombre_places || 0;
    const pct       = places ? Math.round((confirmed / places) * 100) : 0;
    const isFull    = confirmed >= places;
    const isLow     = !isFull && pct >= 75;
    const heures    = trajet.heure?.liste_heures || [];
    const arrets    = trajet.arrets || [];

    return (
        <div className="bc">
            <div className="bc-top">
                <div className="bc-head">
                    <div>
                        <div className="bc-name">🚌 {trajet.bus?.name}</div>
                        <div className="bc-driver">🧑‍✈️ {trajet.chauffeur?.name || '—'}</div>
                    </div>
                    <span className={`bc-status ${isFull ? 'full' : isLow ? 'low' : 'ok'}`}>
                        {isFull ? 'Complet' : `${places - confirmed} places`}
                    </span>
                </div>

                <div className="bc-trajet">
                    <span className="t-depart">🏫 UM6P</span>
                    <span className="t-arr">→</span>
                    {arrets.map((a, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="t-pill">📍 {a}</span>
                            {i < arrets.length - 1 && <span className="t-arr">→</span>}
                        </span>
                    ))}
                </div>

                <div className="bc-heures">
                    {heures.map(h => (
                        <span key={h} className="h-chip" onClick={() => onSelect(trajet)}>⏱ {h}</span>
                    ))}
                </div>
            </div>

            <div className="bc-cap">
                <div className="cap-row">
                    <span>{confirmed} / {places} passagers</span>
                    <span style={{ fontWeight: 800, color: isFull ? '#dc2626' : isLow ? '#d97706' : '#1a6b3a' }}>{pct}%</span>
                </div>
                <div className="cap-track">
                    <div className={`cap-fill ${isFull ? 'f-red' : isLow ? 'f-amber' : 'f-green'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
            </div>

            <button className="bc-cta" onClick={() => onSelect(trajet)}>
                {isFull ? '⏳ Liste d\'attente' : '🎫 Réserver une place'}
            </button>
        </div>
    );
}

function ReservationModal({ trajet, onClose, onConfirm }) {
    const [heure, setHeure] = useState(null);
    const [arret, setArret] = useState(null);
    const confirmed = trajet.confirmed_count || 0;
    const places    = trajet.bus?.nombre_places || 0;
    const isFull    = confirmed >= places;
    const heures    = trajet.heure?.liste_heures || [];
    const arrets    = trajet.arrets || [];

    const isHeureDisabled = (h) => {
        const now = new Date();
        const [hh, mm] = h.split(':').map(Number);
        const depart = new Date();
        depart.setHours(hh, mm, 0, 0);
        return (depart - now) < 60 * 60 * 1000;
    };

    const submit = () => {
        if (!heure || !arret) return;
        onConfirm(trajet, heure, arret);
    };

    return (
        <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-handle" />
                <div className="modal-hero">
                    <div className="modal-bus-name">🚌 {trajet.bus?.name}</div>
                    <div className="modal-driver">🧑‍✈️ {trajet.chauffeur?.name || '—'}</div>
                </div>

                <div className="modal-body">
                    <div style={{ marginBottom: 20 }}>
                        <div className="cap-row" style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#6b8072' }}>Occupation</span>
                            <span style={{ fontSize: 12, fontWeight: 800, color: isFull ? '#dc2626' : '#1a6b3a' }}>
                                {confirmed}/{places} places
                            </span>
                        </div>
                        <div className="cap-track">
                            <div className={`cap-fill ${isFull ? 'f-red' : confirmed/places >= .75 ? 'f-amber' : 'f-green'}`}
                                style={{ width: `${Math.min((confirmed/places)*100, 100)}%` }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <div className="sec-title">⏰ Heure de départ</div>
                        <div className="heure-grid">
                            {heures.map(h => {
                                const disabled = isHeureDisabled(h);
                                return (
                                    <button key={h}
                                        className={`heure-btn${heure === h ? ' sel' : ''}${disabled ? ' dis' : ''}`}
                                        onClick={() => !disabled && setHeure(h)}
                                        title={disabled ? 'Moins de 1h avant départ' : ''}>
                                        {h}
                                        {disabled && <span style={{ display: 'block', fontSize: 9, color: '#dc2626' }}>Fermé</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <div className="sec-title">📍 Votre arrêt de descente</div>
                        <div className="arret-list">
                            <div className="arret-depart">
                                <span className="arret-dot depart-dot" />
                                <span className="arret-label depart-label">🏫 UM6P (Départ)</span>
                            </div>
                            {arrets.map((a, i) => (
                                <div key={i} className={`arret-item${arret === a ? ' sel' : ''}`} onClick={() => setArret(a)}>
                                    <span className="arret-dot" />
                                    <span className="arret-label">📍 {a}</span>
                                    {arret === a && <span className="arret-check">✓</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {isFull && <div className="waitlist">⚠️ Bus <strong>complet</strong> — liste d'attente.</div>}

                    <button className={`btn-reserve${isFull ? ' wait' : ''}`} onClick={submit} disabled={!heure || !arret}>
                        {!heure && !arret ? 'Choisissez une heure et un arrêt'
                            : !heure ? 'Choisissez une heure'
                            : !arret ? 'Choisissez votre arrêt'
                            : isFull ? '⏳ Liste d\'attente'
                            : '✅ Confirmer la réservation'}
                    </button>
                    <button className="btn-cancel" onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
}

const css = `
.sub-tabs{display:flex;gap:4px;background:#ebf4ee;border-radius:13px;padding:4px;margin-bottom:22px;width:fit-content}
.stab{padding:8px 16px;border-radius:10px;border:none;background:none;font-size:13px;font-weight:700;cursor:pointer;color:#6b8072;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s;display:flex;align-items:center;gap:6px}
.stab.on{background:#fff;color:#1a6b3a;box-shadow:0 2px 8px rgba(10,40,20,.08)}
.stab-c{background:#1a6b3a;color:#fff;border-radius:99px;font-size:10px;font-weight:800;padding:1px 6px}
.loading{text-align:center;padding:60px;color:#6b8072;font-weight:600}
.bus-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px}
.bc{background:#fff;border-radius:18px;border:2px solid #daeade;overflow:hidden;transition:all .22s;position:relative}
.bc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#1a6b3a,#2db554);opacity:0;transition:opacity .22s}
.bc:hover{border-color:#c8ecd3;box-shadow:0 8px 24px rgba(10,40,20,.11);transform:translateY(-3px)}
.bc:hover::before{opacity:1}
.bc-top{padding:18px 18px 12px}
.bc-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px}
.bc-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#0d1f15}
.bc-driver{font-size:12px;color:#6b8072;margin-top:2px}
.bc-status{flex-shrink:0;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:800}
.bc-status.ok{background:#e8f8ed;color:#1a6b3a}
.bc-status.low{background:#fef3c7;color:#d97706}
.bc-status.full{background:#fee2e2;color:#dc2626}
.bc-trajet{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;align-items:center}
.t-depart{background:linear-gradient(135deg,#1a6b3a,#22913f);color:#fff;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700}
.t-pill{background:#f4f9f5;border:1px solid #daeade;color:#2a3d30;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:600}
.t-arr{color:#9fb8a8;font-size:11px;font-weight:700}
.bc-heures{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px}
.h-chip{padding:4px 9px;border-radius:7px;background:#ebf4ee;border:1.5px solid #daeade;color:#2a3d30;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.h-chip:hover{background:#e8f8ed;border-color:#1a6b3a;color:#1a6b3a}
.bc-cap{padding:0 18px 14px}
.cap-row{display:flex;justify-content:space-between;font-size:11px;color:#6b8072;font-weight:600;margin-bottom:5px}
.cap-track{height:5px;background:#ebf4ee;border-radius:99px;overflow:hidden}
.cap-fill{height:100%;border-radius:99px;transition:width .5s}
.f-green{background:linear-gradient(90deg,#2db554,#1a6b3a)}
.f-amber{background:linear-gradient(90deg,#f59e0b,#d97706)}
.f-red{background:linear-gradient(90deg,#ef4444,#dc2626)}
.bc-cta{margin:0 12px 14px;padding:10px;border-radius:12px;background:#1a6b3a;color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;width:calc(100% - 24px);font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s}
.bc-cta:hover{background:#22913f}
.res-list{display:flex;flex-direction:column;gap:10px}
.res-item{background:#fff;border-radius:15px;border:1px solid #daeade;padding:16px;display:flex;align-items:center;gap:14px}
.res-icon{width:42px;height:42px;border-radius:12px;background:#e8f8ed;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.res-info{flex:1;min-width:0}
.res-name{font-size:14px;font-weight:800;color:#0d1f15}
.res-meta{font-size:12px;color:#6b8072;margin-top:3px}
.res-badge{padding:4px 10px;border-radius:99px;font-size:11px;font-weight:800;flex-shrink:0}
.res-badge.ok{background:#e8f8ed;color:#1a6b3a}
.res-badge.wait{background:#fef3c7;color:#d97706}
.res-cancel{width:28px;height:28px;border-radius:7px;border:none;background:#fee2e2;color:#dc2626;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.res-cancel:hover{background:#fecaca}
.empty{text-align:center;padding:60px 20px;grid-column:1/-1}
.empty-e{font-size:48px;margin-bottom:12px}
.empty p{font-size:15px;font-weight:700;color:#6b8072}
.empty span{font-size:13px;color:#9fb8a8}
.overlay{position:fixed;inset:0;background:rgba(10,30,18,.55);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;z-index:200;animation:ovIn .25s ease}
@media(min-width:600px){.overlay{align-items:center;padding:20px}}
@keyframes ovIn{from{opacity:0}to{opacity:1}}
.modal{background:#fff;border-radius:26px 26px 0 0;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,.25);animation:shUp .35s cubic-bezier(.34,1.2,.64,1) both}
@media(min-width:600px){.modal{border-radius:26px;animation:popIn .3s cubic-bezier(.34,1.4,.64,1) both}}
@keyframes shUp{from{transform:translateY(100%)}to{transform:none}}
@keyframes popIn{from{opacity:0;transform:scale(.93) translateY(16px)}to{opacity:1;transform:none}}
.modal-handle{width:40px;height:4px;background:#daeade;border-radius:99px;margin:14px auto}
@media(min-width:600px){.modal-handle{display:none}}
.modal-hero{background:linear-gradient(135deg,#0f4024,#1a6b3a);padding:22px 24px 20px;position:relative;overflow:hidden}
.modal-hero::after{content:'🚌';position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:56px;opacity:.12}
.modal-bus-name{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fff;margin-bottom:4px}
.modal-driver{font-size:13px;color:rgba(255,255,255,.6)}
.modal-body{padding:22px}
.sec-title{font-size:11px;font-weight:800;color:#6b8072;text-transform:uppercase;letter-spacing:.7px;margin-bottom:10px}
.heure-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:8px;margin-bottom:4px}
.heure-btn{padding:10px 6px;border-radius:10px;background:#f4f9f5;border:2px solid #daeade;color:#0d1f15;font-size:13px;font-weight:700;cursor:pointer;transition:all .18s;text-align:center}
.heure-btn:hover:not(.dis){border-color:#1a6b3a;color:#1a6b3a;background:#e8f8ed}
.heure-btn.sel{background:#1a6b3a;border-color:#1a6b3a;color:#fff;box-shadow:0 4px 10px rgba(26,107,58,.35)}
.heure-btn.dis{opacity:.45;cursor:not-allowed;background:#f9f9f9}
.arret-list{display:flex;flex-direction:column;gap:4px;background:#f4f9f5;border-radius:14px;padding:12px;border:2px solid #daeade}
.arret-depart{display:flex;align-items:center;gap:10px;padding:8px 10px}
.arret-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all .18s;border:2px solid transparent}
.arret-item:hover{background:#e8f8ed;border-color:#c8ecd3}
.arret-item.sel{background:#1a6b3a;border-color:#1a6b3a}
.arret-item.sel .arret-label{color:#fff;font-weight:700}
.arret-dot{width:10px;height:10px;border-radius:50%;background:#daeade;border:2px solid #9fb8a8;flex-shrink:0}
.depart-dot{background:#1a6b3a;border-color:#1a6b3a}
.arret-label{font-size:13px;font-weight:600;color:#2a3d30;flex:1}
.depart-label{color:#1a6b3a;font-weight:800}
.arret-check{color:#fff;font-size:14px;font-weight:800}
.waitlist{background:#fffbeb;border:1px solid #fde68a;border-radius:11px;padding:12px 14px;font-size:13px;color:#78350f;margin-bottom:16px}
.btn-reserve{width:100%;padding:14px;background:linear-gradient(135deg,#1a6b3a,#22913f);color:#fff;border:none;border-radius:13px;font-size:15px;font-weight:800;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 6px 18px rgba(26,107,58,.4);transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-reserve:hover{transform:translateY(-2px)}
.btn-reserve:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
.btn-reserve.wait{background:linear-gradient(135deg,#92400e,#b45309)}
.btn-cancel{display:block;width:100%;text-align:center;background:none;border:none;color:#6b8072;font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;margin-top:10px;padding:8px}
.btn-cancel:hover{color:#dc2626}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0f4024;color:#fff;border-radius:14px;padding:14px 22px;font-size:14px;font-weight:700;box-shadow:0 20px 48px rgba(0,0,0,.2);z-index:300;animation:toastIn .4s cubic-bezier(.34,1.4,.64,1) both;white-space:nowrap}
.toast.err{background:#dc2626}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
`;