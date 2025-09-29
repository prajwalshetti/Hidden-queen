import { useEffect, useState } from 'react';

export default function FeedbackList() {
  const [items, setItems] = useState([]);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/feedback?pwd=${encodeURIComponent(pwd)}`);
      if (!res.ok) throw new Error('Unauthorized or failed');
      const data = await res.json();
      setItems(data);
      setUnlocked(true);
    } catch (e) {
      setError(e.message);
      setItems([]);
      setUnlocked(false);
    } finally {
      setLoading(false);
    }
  };

  const openCard = async (id) => {
    setActive(null);
    // mark viewed
    try { await fetch(`${import.meta.env.VITE_BASE_URL}/feedback/${id}/view?pwd=${encodeURIComponent(pwd)}`, { method: 'POST' }); } catch {}
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/feedback/${id}?pwd=${encodeURIComponent(pwd)}`);
    if (!res.ok) return;
    const data = await res.json();
    setActive(data);
    // refresh list state to reflect viewed flag
    setItems(prev => prev.map(x => x._id === id ? { ...x, viewed: true } : x));
  }

  const closeModal = () => setActive(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {!unlocked ? (
          <div className="mt-24 bg-gray-900/80 border border-gray-700 rounded-2xl p-8 text-center">
            <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Enter Admin Password</h1>
            <p className="text-gray-400 mb-6">Access the feedback inbox</p>
            <div className="flex items-center justify-center gap-3">
              <input
                type="password"
                placeholder="Admin password"
                value={pwd}
                onChange={(e)=>setPwd(e.target.value)}
                className="px-4 py-2 rounded bg-gray-800 border border-gray-700 w-64"
              />
              <button onClick={load} disabled={loading} className="px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50">{loading? 'Unlocking…' : 'Unlock'}</button>
            </div>
            {error && <div className="text-red-400 mt-4">{error}</div>}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Feedback Inbox</h1>
              <button onClick={load} className="px-3 py-1.5 rounded bg-gray-800 border border-gray-700">Refresh</button>
            </div>
            <div className="space-y-3">
              {items.map((f)=> (
                <button key={f._id} onClick={()=>openCard(f._id)} className="w-full text-left p-4 rounded-xl border border-gray-700 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-900 hover:border-purple-400 transition">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 text-xs rounded border ${!f.viewed ? 'bg-pink-700/50 border-pink-400/40' : 'bg-indigo-700/40 border-indigo-400/40'}`}>{!f.viewed? 'NEW' : 'VIEWED'}</span>
                    <span className="font-bold">{f.name}</span>
                    <span className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleString()}</span>
                  </div>
                </button>
              ))}
              {items.length===0 && <div className="text-gray-500">No feedback yet.</div>}
            </div>
          </>
        )}

        {active && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="max-w-2xl w-full rounded-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
              <div className="bg-gradient-to-r from-purple-700 to-indigo-700 h-2" />
              <div className="bg-gray-900 p-6 border border-gray-700">
                <div className="text-xl font-bold">Feedback Details</div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-gray-200">
                  <div><span className="text-gray-400">name:</span> {active.name}</div>
                  <div><span className="text-gray-400">email:</span> {active.email}</div>
                  <div><span className="text-gray-400">createdAt:</span> {new Date(active.createdAt).toLocaleString()}</div>
                  <div><span className="text-gray-400">problemType:</span> {active.problemType}</div>
                  <div><span className="text-gray-400">rating:</span> {active.rating}</div>
                  <div><span className="text-gray-400">attachScreenshot:</span> {String(active.attachScreenshot)}</div>
                  <div className="mt-2"><span className="text-gray-400">problemDescription:</span><div className="mt-1 whitespace-pre-wrap">{active.problemDescription}</div></div>
                  {active.suggestion && <div className="mt-2"><span className="text-gray-400">suggestion:</span><div className="mt-1 whitespace-pre-wrap">{active.suggestion}</div></div>}
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={closeModal} className="px-4 py-2 rounded bg-gradient-to-r from-pink-600 to-purple-600">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


