// resources/js/Pages/Welcome.jsx
import { Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <div style={S.page}>
            <style>{css}</style>

            {/* Déco background */}
            <div style={S.deco}>
                <div style={S.grid} />
                {circles.map((c, i) => (
                    <div key={i} style={{ ...S.circle, width: c.s, height: c.s, left: c.x, top: c.y, animationDelay: `${i * 1.4}s` }} />
                ))}
            </div>

            {/* Left */}
            <div style={S.left}>
                <div className="w-badge">
                    <span className="w-dot" /> Système de Transport Officiel
                </div>
                <h1 className="w-title">
                    Réservez votre<br />
                    <span className="w-accent">place en bus</span>
                </h1>
                <p className="w-desc">
                    Plateforme officielle de réservation de transport pour le personnel et les étudiants.
                    Rapide, fiable et simple d'utilisation.
                </p>
                <div className="w-stats">
                    {[{ n: '4+', l: 'Lignes actives' }, { n: '200+', l: 'Utilisateurs' }, { n: '98%', l: 'Ponctualité' }].map(s => (
                        <div key={s.l} className="w-stat">
                            <span className="w-stat-n">{s.n}</span>
                            <span className="w-stat-l">{s.l}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right — Card */}
            <div style={S.right}>
                <div className="w-card">
                    <div className="w-icon">🚌</div>
                    <h2 className="w-card-title">Bienvenue</h2>
                    <p className="w-card-sub">Connectez-vous pour accéder à votre espace</p>

                    {auth?.user ? (
                        <Link href="/dashboard" className="btn-main">
                            Accéder au tableau de bord →
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="btn-main">Se connecter →</Link>
                            <Link href="/register" className="btn-outline">Créer un compte →</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const circles = [
    { s: 320, x: -80, y: 80 }, { s: 200, x: '68%', y: -50 },
    { s: 140, x: '82%', y: '62%' }, { s: 90, x: '18%', y: '72%' },
];

const S = {
    page: { minHeight: '100vh', display: 'flex', background: 'linear-gradient(150deg,#0c3520 0%,#1a6b3a 50%,#22913f 100%)', position: 'relative', overflow: 'hidden' },
    deco: { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' },
    grid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize: '52px 52px' },
    circle: { position: 'absolute', borderRadius: '50%', background: 'rgba(255,255,255,.05)', animation: 'wFloat 8s ease-in-out infinite' },
    left: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(32px,5vw,64px)', position: 'relative', zIndex: 2 },
    right: { width: 'clamp(320px,36vw,440px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative', zIndex: 2 },
};

const css = `
@keyframes wFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(6px,-14px) scale(1.04)} }
@keyframes cardIn { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
.w-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:#a7f3c0;border-radius:99px;padding:6px 16px;font-size:12px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;margin-bottom:24px;width:fit-content}
.w-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;animation:pulse 1.5s ease infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
.w-title{font-family:'Syne',sans-serif;font-size:clamp(34px,4.5vw,60px);font-weight:800;color:#fff;line-height:1.07;margin-bottom:18px;letter-spacing:-1px}
.w-accent{color:#4ade80}
.w-desc{font-size:16px;color:rgba(255,255,255,.58);line-height:1.75;max-width:400px;margin-bottom:40px}
.w-stats{display:flex;gap:36px}
.w-stat{display:flex;flex-direction:column}
.w-stat-n{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;color:#fff}
.w-stat-l{font-size:12px;color:rgba(255,255,255,.45);margin-top:2px}
.w-card{background:#fff;border-radius:24px;padding:40px 36px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,.25);animation:cardIn .6s cubic-bezier(.34,1.3,.64,1) both}
.w-icon{width:62px;height:62px;background:linear-gradient(135deg,#1a6b3a,#2db554);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:22px;box-shadow:0 8px 20px rgba(26,107,58,.4)}
.w-card-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#0d1f15;margin-bottom:6px}
.w-card-sub{font-size:14px;color:#6b8072;margin-bottom:30px}
.btn-main{display:flex;align-items:center;justify-content:center;width:100%;padding:14px;background:linear-gradient(135deg,#1a6b3a,#22913f);color:#fff;border:none;border-radius:13px;font-size:15px;font-weight:700;cursor:pointer;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 4px 16px rgba(26,107,58,.4);transition:all .2s;margin-bottom:10px}
.btn-main:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,107,58,.5)}
.btn-outline{display:flex;align-items:center;justify-content:center;width:100%;padding:14px;background:transparent;color:#1a6b3a;border:2px solid #c0d9c6;border-radius:13px;font-size:15px;font-weight:700;cursor:pointer;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s}
.btn-outline:hover{border-color:#1a6b3a;background:#e8f8ed}
@media(max-width:768px){.w-stats{gap:20px}.w-card{padding:28px 22px}}
`;