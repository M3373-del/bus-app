// resources/js/Pages/Auth/Register.jsx
import { useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '', role: 'student',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div style={S.page}>
            <style>{css}</style>
            <div style={S.deco}>
                <div style={S.grid} />
                {[{ s:300,x:-80,y:100 },{ s:200,x:'70%',y:-60 },{ s:150,x:'82%',y:'62%' }].map((c,i)=>(
                    <div key={i} style={{...S.circle, width:c.s, height:c.s, left:c.x, top:c.y, animationDelay:`${i*1.5}s`}} />
                ))}
            </div>

            <div style={S.left}>
                <div className="w-badge"><span className="w-dot" /> Système de Transport Officiel</div>
                <h1 className="w-title">Créez votre<br /><span className="w-accent">compte</span></h1>
                <p className="w-desc">Rejoignez la plateforme officielle de réservation de transport.</p>
            </div>

            <div style={S.right}>
                <div className="auth-card">
                    <div className="auth-icon">🚌</div>
                    <h2 className="auth-title">Inscription</h2>
                    <p className="auth-sub">Remplissez vos informations</p>

                    <form onSubmit={submit}>
                        <div className="field">
                            <label className="lbl">Nom complet</label>
                            <input className={`inp${errors.name?' err':''}`} value={data.name}
                                onChange={e => setData('name', e.target.value)} placeholder="Votre prénom et nom" />
                            {errors.name && <span className="err-msg">{errors.name}</span>}
                        </div>

                        <div className="field">
                            <label className="lbl">Adresse Email</label>
                            <input className={`inp${errors.email?' err':''}`} type="email" value={data.email}
                                onChange={e => setData('email', e.target.value)} placeholder="exemple@institution.ma" />
                            {errors.email && <span className="err-msg">{errors.email}</span>}
                        </div>

                        <div className="field">
                            <label className="lbl">Mot de passe</label>
                            <input className={`inp${errors.password?' err':''}`} type="password" value={data.password}
                                onChange={e => setData('password', e.target.value)} placeholder="8 caractères minimum" />
                            {errors.password && <span className="err-msg">{errors.password}</span>}
                        </div>

                        <div className="field">
                            <label className="lbl">Confirmer le mot de passe</label>
                            <input className="inp" type="password" value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)} placeholder="Répéter le mot de passe" />
                        </div>

                        <div className="field">
                            <label className="lbl">Rôle</label>
                            <div className="role-group">
                                <button type="button"
                                    className={`role-btn${data.role==='student'?' role-on':''}`}
                                    onClick={() => setData('role', 'student')}>
                                    🎓 Étudiant
                                </button>
                                <button type="button"
                                    className={`role-btn${data.role==='staff'?' role-on':''}`}
                                    onClick={() => setData('role', 'staff')}>
                                    👔 Staff
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={processing}>
                            {processing ? <span className="spin" /> : 'Créer mon compte →'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Déjà inscrit ? <Link href="/login" className="auth-link">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const S = {
    page:   { minHeight:'100vh', display:'flex', background:'linear-gradient(150deg,#0c3520 0%,#1a6b3a 50%,#22913f 100%)', position:'relative', overflow:'hidden' },
    deco:   { position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' },
    grid:   { position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize:'52px 52px' },
    circle: { position:'absolute', borderRadius:'50%', background:'rgba(255,255,255,.05)', animation:'wFloat 8s ease-in-out infinite' },
    left:   { flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'clamp(32px,5vw,64px)', position:'relative', zIndex:2 },
    right:  { width:'clamp(340px,38vw,460px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px', position:'relative', zIndex:2 },
};

const css = `
@keyframes wFloat{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6px,-14px) scale(1.04)}}
@keyframes popIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
@keyframes sp{to{transform:rotate(360deg)}}
.w-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:#a7f3c0;border-radius:99px;padding:6px 16px;font-size:12px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;margin-bottom:24px;width:fit-content}
.w-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;animation:pulse 1.5s ease infinite;display:inline-block}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.w-title{font-family:'Syne',sans-serif;font-size:clamp(34px,4vw,56px);font-weight:800;color:#fff;line-height:1.07;margin-bottom:18px;letter-spacing:-1px}
.w-accent{color:#4ade80}
.w-desc{font-size:16px;color:rgba(255,255,255,.58);line-height:1.75;max-width:380px}
.auth-card{background:#fff;border-radius:24px;padding:36px 32px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,.25);animation:popIn .6s cubic-bezier(.34,1.3,.64,1) both;max-height:90vh;overflow-y:auto}
.auth-icon{width:56px;height:56px;background:linear-gradient(135deg,#1a6b3a,#2db554);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:18px;box-shadow:0 6px 16px rgba(26,107,58,.4)}
.auth-title{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#0d1f15;margin-bottom:4px}
.auth-sub{font-size:13px;color:#6b8072;margin-bottom:22px}
.field{margin-bottom:14px}
.lbl{display:block;font-size:11px;font-weight:800;color:#2a3d30;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px}
.inp{width:100%;padding:11px 13px;border:2px solid #daeade;border-radius:11px;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;background:#f4f9f5;outline:none;color:#0d1f15;transition:all .2s}
.inp:focus{border-color:#1a6b3a;background:#fff;box-shadow:0 0 0 4px rgba(26,107,58,.1)}
.inp.err{border-color:#dc2626;background:#fff8f8}
.err-msg{font-size:12px;color:#dc2626;margin-top:4px;display:block}
.role-group{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.role-btn{padding:10px;border-radius:10px;border:2px solid #daeade;background:#f4f9f5;color:#6b8072;font-size:13px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s}
.role-btn:hover{border-color:#1a6b3a;color:#1a6b3a}
.role-btn.role-on{background:#1a6b3a;border-color:#1a6b3a;color:#fff;box-shadow:0 4px 12px rgba(26,107,58,.35)}
.btn-submit{width:100%;padding:13px;background:linear-gradient(135deg,#1a6b3a,#22913f);color:#fff;border:none;border-radius:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 4px 14px rgba(26,107,58,.4);transition:all .2s;margin-top:6px;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-submit:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(26,107,58,.5)}
.btn-submit:disabled{opacity:.55;cursor:not-allowed;transform:none}
.spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp .6s linear infinite}
.auth-footer{text-align:center;margin-top:16px;font-size:13px;color:#6b8072}
.auth-link{color:#1a6b3a;font-weight:700;text-decoration:underline;text-underline-offset:3px}
@media(max-width:768px){.w-title{font-size:32px}}
`;