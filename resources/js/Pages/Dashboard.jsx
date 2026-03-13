// resources/js/Pages/Dashboard.jsx
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../components/Layout';
import ReservationPage from './ReservationPage';
import ManagementPage from './ManagementPage';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [tab, setTab] = useState('reservations');

    return (
        <Layout>
            <style>{css}</style>

            {/* Tab strip */}
            <div className="tab-strip">
                <button className={`tab${tab === 'reservations' ? ' on' : ''}`} onClick={() => setTab('reservations')}>
                    🎫 Réservations
                </button>
                {user?.role === 'staff' && (
                    <button className={`tab${tab === 'management' ? ' on' : ''}`} onClick={() => setTab('management')}>
                        ⚙️ Gestion des Bus
                    </button>
                )}
            </div>

            {tab === 'reservations' && <ReservationPage />}
            {tab === 'management' && user?.role === 'staff' && <ManagementPage />}
        </Layout>
    );
}

const css = `
.tab-strip{display:flex;gap:4px;background:#ebf4ee;border-radius:13px;padding:4px;width:fit-content;margin-bottom:26px}
.tab{padding:9px 18px;border-radius:10px;border:none;background:none;font-size:13px;font-weight:700;cursor:pointer;color:#6b8072;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s;display:flex;align-items:center;gap:6px;white-space:nowrap}
.tab:hover{color:#1a6b3a}
.tab.on{background:#fff;color:#1a6b3a;box-shadow:0 2px 8px rgba(10,40,20,.08)}
`;