// resources/js/components/Layout.jsx
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Layout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => router.post('/logout');

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style>{css}</style>

            {/* Navbar */}
            <nav className="nb">
                <div className="nb-inner">
                    <Link href="/dashboard" className="nb-brand">
                        <div className="nb-logo">🚌</div>
                        <span className="nb-name">BusConnect</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="nb-nav">
                        <Link href="/dashboard" className={`nb-link${isActive('/dashboard') ? ' nb-on' : ''}`}>
                            🎫 Réservations
                        </Link>
                        {user?.role === 'staff' && (
                            <Link href="/dashboard?tab=management" className={`nb-link${isActive('/dashboard', 'management') ? ' nb-on' : ''}`}>
                                ⚙️ Gestion
                            </Link>
                        )}
                    </div>

                    <div className="nb-right">
                        <div className="nb-user">
                            <div className="nb-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
                            <div className="nb-info">
                                <span className="nb-uname">{user?.name}</span>
                                <span className="nb-urole">{user?.role === 'staff' ? '👔 Staff' : '🎓 Étudiant'}</span>
                            </div>
                        </div>
                        <button className="nb-logout" onClick={logout} title="Déconnexion">↩</button>
                    </div>
                </div>
            </nav>

            {/* Page */}
            <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '28px 18px 80px' }}>
                {title && (
                    <div style={{ marginBottom: 24 }}>
                        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: '#0d1f15', marginBottom: 4 }}>{title}</h1>
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}

function isActive(path, tab) {
    if (typeof window === 'undefined') return false;
    const url = new URL(window.location.href);
    return url.pathname === path && (!tab || url.searchParams.get('tab') === tab);
}

const css = `
.nb{background:linear-gradient(135deg,#0f4024,#1a6b3a);border-bottom:1px solid rgba(255,255,255,.07);position:sticky;top:0;z-index:100;box-shadow:0 2px 16px rgba(10,30,18,.25)}
.nb-inner{max-width:1100px;margin:0 auto;padding:0 18px;height:60px;display:flex;align-items:center;gap:12px}
.nb-brand{display:flex;align-items:center;gap:9px;text-decoration:none;flex-shrink:0}
.nb-logo{width:34px;height:34px;background:linear-gradient(135deg,#2db554,#1a6b3a);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(26,107,58,.4)}
.nb-name{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:#fff}
.nb-nav{display:flex;gap:2px;margin-left:12px}
.nb-link{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:10px;color:rgba(255,255,255,.55);font-size:13px;font-weight:600;text-decoration:none;transition:all .18s;font-family:'Plus Jakarta Sans',sans-serif}
.nb-link:hover{color:#fff;background:rgba(255,255,255,.09)}
.nb-link.nb-on{color:#4ade80;background:rgba(74,222,128,.13)}
.nb-right{display:flex;align-items:center;gap:8px;margin-left:auto}
.nb-user{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:99px;padding:5px 12px 5px 5px}
.nb-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#2db554,#1a6b3a);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff}
.nb-info{display:flex;flex-direction:column}
.nb-uname{font-size:12px;font-weight:700;color:#fff;line-height:1.3}
.nb-urole{font-size:10px;color:rgba(255,255,255,.45)}
.nb-logout{width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.07);border:none;color:rgba(255,255,255,.5);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;transition:all .18s;flex-shrink:0}
.nb-logout:hover{background:rgba(220,38,38,.2);color:#fca5a5}
@media(max-width:600px){.nb-info{display:none}.nb-name{display:none}}
`;