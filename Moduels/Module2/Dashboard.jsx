import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import ChartWrapper from '../components/ChartWrapper';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Function to generate a hash for string
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Function to get a unique color for each category
function getColorForCategory(category) {
  const hue = Math.abs(hashString(category)) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [active, setActive] = useState('overview');
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [subs, setSubs] = useState([]);

  const [budgetForm, setBudgetForm] = useState({ month: '', income: '', expenses: '' });
  const [goalForm, setGoalForm] = useState({ title: '', targetAmount: '', savedAmount: '' });
  const [txForm, setTxForm] = useState({ name: '', amount: '', category: '', mode: 'cash', date: '' });
  const [subForm, setSubForm] = useState({ name: '', amount: '', repeat: 'Monthly', date: '' });

  async function loadAll() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const [bRes, gRes] = await Promise.all([
        api.get('/budgets', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/goals', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setBudgets(bRes.data || []);
      setGoals(gRes.data || []);
    } catch (err) {
      console.error('loadAll failed', err);
      setBudgets([]);
      setGoals([]);
    }
  }

  useEffect(() => {
    loadAll().catch(() => {});
  }, []);

  async function reloadWallet() {
    const token = localStorage.getItem('token');
    if (!token) { setWallet([]); return; }
    try {
      const res = await api.get('/transactions', { headers: { Authorization: `Bearer ${token}` } });
      const items = res.data || [];
      // Ensure amounts are numbers
      const processedItems = items.map(item => ({
        ...item,
        amount: typeof item.amount === 'string' ? Number(item.amount) : (item.amount || 0)
      }));
      // ensure newest first (backend also returns ordered list, but sort again client-side)
      processedItems.sort((a,b)=> (b.id || 0) - (a.id || 0));
      setWallet(processedItems);
    } catch (err) {
      console.error('reloadWallet failed', err);
      setWallet([]);
    }
  }
  async function reloadSubs() {
    const token = localStorage.getItem('token');
    if (!token) { setSubs([]); return; }
    try {
      const res = await api.get('/subscriptions', { headers: { Authorization: `Bearer ${token}` } });
      const items = res.data || [];
      // Ensure amounts are numbers
      const processedItems = items.map(item => ({
        ...item,
        amount: typeof item.amount === 'string' ? Number(item.amount) : (item.amount || 0)
      }));
      setSubs(processedItems);
    } catch (err) {
      console.error('reloadSubs failed', err);
      setSubs([]);
    }
  }
  useEffect(() => { if (localStorage.getItem('token')) { reloadWallet().catch(()=>{}); reloadSubs().catch(()=>{}); } }, []);

  async function submitBudget(e) {
    e.preventDefault();
    await api.post('/budgets', {
      month: budgetForm.month,
      income: Number(budgetForm.income || 0),
      expenses: Number(budgetForm.expenses || 0),
    });
    setBudgetForm({ month: '', income: '', expenses: '' });
    await loadAll();
  }

  async function submitGoal(e) {
    e.preventDefault();
    await api.post('/goals', {
      title: goalForm.title,
      targetAmount: Number(goalForm.targetAmount || 0),
      savedAmount: Number(goalForm.savedAmount || 0),
    });
    setGoalForm({ title: '', targetAmount: '', savedAmount: '' });
    await loadAll();
  }

  async function addTransaction(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = { ...txForm, amount: Number(txForm.amount || 0) };
      if (!payload.date) delete payload.date;
      const { data } = await api.post('/transactions', payload, { headers: { Authorization: `Bearer ${token}` } });
      // prepend the newly created transaction so UI shows it immediately
      setWallet((w) => [data, ...w]);
      setTxForm({ name: '', amount: '', category: '', mode: 'cash', date: '' });
    } catch (err) {
      console.error('addTransaction failed', err);
      alert(err?.response?.data || err?.message || 'Failed to add transaction');
    }
  }

  async function deleteTransaction(id) { await api.delete(`/transactions/${id}`); await reloadWallet(); }

  async function addSub(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = { ...subForm, amount: Number(subForm.amount || 0) };
      if (!payload.date) delete payload.date;
      const subRes = await api.post('/subscriptions', payload, { headers: { Authorization: `Bearer ${token}` } });
      // also add a transaction so subscription shows in expenses
      try {
        const txPayload = { name: `Sub: ${payload.name}`, amount: Number(payload.amount || 0), category: 'Subscription', mode: 'recurring' };
        if (payload.date) txPayload.date = payload.date;
        await api.post('/transactions', txPayload, { headers: { Authorization: `Bearer ${token}` } });
      } catch (txErr) {
        console.error('failed to add subscription transaction', txErr);
      }
      setSubForm({ name: '', amount: '', repeat: 'Monthly', date: '' });
      await reloadSubs();
      await reloadWallet();
    } catch (err) {
      console.error('Add subscription failed', err);
      // give user feedback
      alert(err?.response?.data || err?.message || 'Failed to add subscription');
    }
  }

  async function deleteSub(id) {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/subscriptions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await reloadSubs();
    } catch (err) {
      console.error('Delete subscription failed', err);
      alert(err?.response?.data || err?.message || 'Failed to delete subscription');
    }
  }

  const chartData = useMemo(() => {
    if (goals.length === 0) return null;
    const labels = goals.map((g) => g.title);
    const saved = goals.map((g) => g.savedAmount);
    const remaining = goals.map((g) => Math.max(0, (g.targetAmount || 0) - (g.savedAmount || 0)));
    return {
      labels,
      datasets: [
        { label: 'Saved', data: saved, backgroundColor: '#22c55e' },
        { label: 'Remaining', data: remaining, backgroundColor: '#ef4444' },
      ],
    };
  }, [goals]);

  const pieData = useMemo(() => {
    if (wallet.length === 0) return null;
    const byCat = wallet.reduce((acc, t) => { acc[t.category || 'Others'] = (acc[t.category || 'Others'] || 0) + (t.amount || 0); return acc; }, {});
    const labels = Object.keys(byCat);
    const values = Object.values(byCat);
    const backgroundColor = labels.map(cat => getColorForCategory(cat));
    return { labels, datasets: [{ data: values, backgroundColor }] };
  }, [wallet]);

  

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  // allow user to set monthly income from profile
  async function setMonthlyIncome(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const form = e.currentTarget;
    const income = Number(form.elements.income?.value || 0);
    if (income <= 0) return alert('Enter a valid income');
    try {
      // set month to current yyyy-mm
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
      await api.post('/budgets', { month, income, expenses: 0 }, { headers: { Authorization: `Bearer ${token}` } });
      await loadAll();
      alert('Monthly income saved');
      form.reset();
    } catch (err) {
      console.error('setMonthlyIncome failed', err);
      alert(err?.response?.data || err?.message || 'Failed to save income');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-4">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 rounded-xl bg-slate-900/60 border border-slate-800 p-3 h-fit">
          <div className="px-2 py-2 text-sm text-slate-400">Account</div>
          <div className="px-2 pb-2 text-white font-bold">{user.name}</div>
          {[
            ['overview','Overview'],
            ['wallet','Manage Wallet'],
            ['subs','Manage Subs'],
            ['goals','Goals'],
            ['profile','User Profile'],
          ].map(([key,label]) => (
            <button key={key} onClick={() => setActive(key)} className={`w-full text-left px-3 py-2 rounded-md mt-1 ${active===key? 'bg-emerald-500 text-black font-semibold':'hover:bg-slate-800 text-slate-200'}`}>{label}</button>
          ))}
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded-md mt-3 border border-slate-800">Logout</button>
        </aside>

        {/* Content */}
        <section className="flex-1 grid gap-4">
          {active === 'overview' && (
            <div className="grid gap-4">
              <div className="grid md:grid-cols-4 gap-3">
                <Card title="Total Spent" value={`₹ ${wallet.reduce((s,t)=>s+(t.amount||0),0)}`} />
                <Card title="Monthly Income" value={`₹ ${budgets.slice(-1)[0]?.income||0}`} />
                <Card title="# Transactions" value={`${wallet.length}`} />
                <Card title="Recurring Subs" value={`${subs.length}`} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                  <h3 className="text-lg font-semibold">Expense Categories</h3>
                  <div className="mt-3">
                    {pieData ? <ChartWrapper type="pie" data={pieData} options={{ responsive: true, plugins: { legend: { labels: { color: '#cbd5e1' } } } }} key={JSON.stringify(pieData)} /> : <p className="text-slate-500">Add transactions to see distribution.</p>}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                  <h3 className="text-lg font-semibold">Savings Progress</h3>
                  <div className="mt-3">
                      {chartData ? (
                      <ChartWrapper type="bar" data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top', labels: { color: '#cbd5e1' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } } }} key={JSON.stringify(chartData)} />
                    ) : (
                      <p className="text-slate-500">No goals yet. Create one to see progress.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <ul className="mt-3 grid gap-2 text-sm">
                  {wallet.slice(0,6).map((t)=> (
                    <li key={t.id} className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2">
                      <div>
                        <div className="font-semibold">{t.name} · ₹{t.amount}</div>
                        <div className="text-slate-400">{t.category || 'Others'} · {t.mode} · {t.date || '—'}</div>
                      </div>
                      <button onClick={()=>deleteTransaction(t.id)} className="text-slate-400 hover:text-red-400">Delete</button>
                    </li>
                  ))}
                  {wallet.length===0 && <li className="text-slate-500">No transactions yet.</li>}
                </ul>
              </div>
            </div>
          )}

          {active === 'wallet' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                <h3 className="text-lg font-semibold">Manage Wallet</h3>
                <form onSubmit={addTransaction} className="mt-3 grid gap-3">
                  <label className="text-sm">Name<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" value={txForm.name} onChange={(e)=>setTxForm(f=>({...f,name:e.target.value}))} required /></label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm">Amount<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" type="number" value={txForm.amount} onChange={(e)=>setTxForm(f=>({...f,amount:e.target.value}))} required /></label>
                    <label className="text-sm">Category<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" value={txForm.category} onChange={(e)=>setTxForm(f=>({...f,category:e.target.value}))} placeholder="Household" /></label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm">Mode<select className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" value={txForm.mode} onChange={(e)=>setTxForm(f=>({...f,mode:e.target.value}))}><option>cash</option><option>debit card</option><option>credit card</option><option>upi</option><option>bitcoin</option></select></label>
                    <label className="text-sm">Date<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" type="date" value={txForm.date} onChange={(e)=>setTxForm(f=>({...f,date:e.target.value}))} /></label>
                  </div>
                  <button className="px-4 py-2 rounded-md bg-emerald-500 text-black font-bold">Add</button>
                </form>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                <h3 className="text-lg font-semibold">All Transactions</h3>
                <ul className="mt-3 grid gap-2 text-sm">
                  {wallet.map((t, index)=> (
                    <li key={t.id || `tx-${index}`} className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2">
                      <div>
                        <div className="font-semibold">{t.name} · ₹{t.amount}</div>
                        <div className="text-slate-400">{t.category || 'Others'} · {t.mode} · {t.date || '—'}</div>
                      </div>
                      <button onClick={()=>deleteTransaction(t.id)} className="text-slate-400 hover:text-red-400">Delete</button>
                    </li>
                  ))}
                  {wallet.length===0 && <li className="text-slate-500">No transactions yet.</li>}
                </ul>
              </div>
            </div>
          )}

          {active === 'subs' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                <h3 className="text-lg font-semibold">Add Subscription</h3>
                <form onSubmit={addSub} className="mt-3 grid gap-3">
                  <label className="text-sm">Name<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" value={subForm.name} onChange={(e)=>setSubForm(f=>({...f,name:e.target.value}))} required /></label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm">Amount<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" type="number" value={subForm.amount} onChange={(e)=>setSubForm(f=>({...f,amount:e.target.value}))} required /></label>
                    <label className="text-sm">Repeat<select className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" value={subForm.repeat} onChange={(e)=>setSubForm(f=>({...f,repeat:e.target.value}))}><option>Monthly</option><option>Yearly</option></select></label>
                  </div>
                  <label className="text-sm">Date<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" type="date" value={subForm.date} onChange={(e)=>setSubForm(f=>({...f,date:e.target.value}))} /></label>
                  <button className="px-4 py-2 rounded-md bg-emerald-500 text-black font-bold">Add</button>
                </form>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                <h3 className="text-lg font-semibold">Your Subscriptions</h3>
                <ul className="mt-3 grid gap-2 text-sm">
                  {subs.map((s)=> (
                    <li key={s.id} className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2">
                      <div>
                        <div className="font-semibold">{s.name} · ₹{s.amount}</div>
                        <div className="text-slate-400">{s.repeat} · {s.date || '—'}</div>
                      </div>
                      <button onClick={()=>deleteSub(s.id)} className="text-slate-400 hover:text-red-400">Delete</button>
                    </li>
                  ))}
                  {subs.length===0 && <li className="text-slate-500">No subscriptions yet.</li>}
                </ul>
              </div>
            </div>
          )}

          {active === 'goals' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                <h3 className="text-lg font-semibold">Create Saving Goal</h3>
                <form onSubmit={submitGoal} className="mt-3 grid gap-3">
                  <label className="text-sm">Title<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" value={goalForm.title} onChange={(e) => setGoalForm((f) => ({ ...f, title: e.target.value }))} placeholder="Car" required /></label>
                  <label className="text-sm">Target Amount<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" type="number" value={goalForm.targetAmount} onChange={(e) => setGoalForm((f) => ({ ...f, targetAmount: e.target.value }))} min="0" step="0.01" required /></label>
                  <label className="text-sm">Saved Amount<input className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2" type="number" value={goalForm.savedAmount} onChange={(e) => setGoalForm((f) => ({ ...f, savedAmount: e.target.value }))} min="0" step="0.01" required /></label>
                  <button className="px-4 py-2 rounded-md bg-emerald-500 text-black font-bold">Save Goal</button>
                </form>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
                <h3 className="text-lg font-semibold">Goals</h3>
                <ul className="mt-3 grid gap-2 text-sm">
                  {goals.map((g) => (
                    <li key={g.id} className="rounded-md border border-slate-800 px-3 py-2">
                      <div className="font-semibold">{g.title}</div>
                      <div className="text-slate-400">Saved ₹{g.savedAmount} / ₹{g.targetAmount}</div>
                      <form className="mt-2 flex items-center gap-2" onSubmit={async (e)=>{ e.preventDefault(); const amount = Number(e.currentTarget.elements.amount.value||0); if (amount>0){ await api.patch(`/goals/${g.id}/add`, null, { params: { amount } }); await loadAll(); e.currentTarget.reset(); } }}>
                        <input name="amount" type="number" min="0" step="0.01" placeholder="Add amount" className="w-40 rounded-md bg-slate-950 border border-slate-800 px-2 py-1" />
                        <button className="px-3 py-1 rounded-md bg-emerald-500 text-black text-sm">Add Money</button>
                      </form>
                    </li>
                  ))}
                  {goals.length === 0 && <li className="text-slate-500">No goals yet.</li>}
                </ul>
              </div>
            </div>
          )}

          {active === 'profile' && (
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
              <h3 className="text-lg font-semibold">User Profile</h3>
              <div className="mt-3 grid md:grid-cols-2 gap-4">
                <div className="grid gap-2 text-sm">
                  <div className="rounded-md border border-slate-800 px-3 py-2">
                    <div className="text-slate-400">Name</div>
                    <div className="font-semibold">{user.name}</div>
                  </div>
                  <div className="rounded-md border border-slate-800 px-3 py-2">
                    <div className="text-slate-400">Email</div>
                    <div className="font-semibold">{user.email}</div>
                  </div>
                  <div className="rounded-md border border-slate-800 px-3 py-2">
                    <div className="text-slate-400">Set Monthly Income</div>
                    <form onSubmit={setMonthlyIncome} className="mt-2 flex items-center gap-2">
                      <input name="income" type="number" min="0" step="0.01" placeholder="Monthly income" className="w-40 rounded-md bg-slate-950 border border-slate-800 px-2 py-1" />
                      <button className="px-3 py-1 rounded-md bg-emerald-500 text-black text-sm">Save</button>
                    </form>
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  For profile edits, we can enable updates later. Currently your account is secured with JWT authentication.
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

//new code 



// import { useEffect, useState, useCallback } from 'react';
// import api from '../api/client';
// import ChartWrapper from '../components/ChartWrapper';

// export default function Dashboard() {
//   const [transactions, setTransactions] = useState([]);
//   const [budgets, setBudgets] = useState([]);
//   const [totalSpent, setTotalSpent] = useState(0);
//   const [totalIncome, setTotalIncome] = useState(0);
//   const [chartData, setChartData] = useState({});
//   const [goals, setGoals] = useState([]);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [wallets, setWallets] = useState([]);

//   // ✅ Fetch all data (transactions, budgets, etc.)
//   const fetchData = useCallback(async () => {
//     try {
//       const [txRes, budgetRes] = await Promise.all([
//         api.get('/transactions'),
//         api.get('/budgets'),
//       ]);

//       const txData = txRes.data;
//       const budgetData = budgetRes.data;

//       setTransactions(txData);
//       setBudgets(budgetData);

//       // Calculate totals
//       const total = txData.reduce((sum, tx) => sum + tx.amount, 0);
//       setTotalSpent(total);

//       const totalInc = budgetData.reduce((sum, b) => sum + b.income, 0);
//       setTotalIncome(totalInc);

//       // Prepare data for Pie Chart
//       const categoryMap = {};
//       txData.forEach((tx) => {
//         if (!categoryMap[tx.category]) categoryMap[tx.category] = 0;
//         categoryMap[tx.category] += tx.amount;
//       });

//       setChartData({
//         labels: Object.keys(categoryMap),
//         datasets: [
//           {
//             data: Object.values(categoryMap),
//             backgroundColor: [
//               '#FF6384',
//               '#36A2EB',
//               '#FFCE56',
//               '#4BC0C0',
//               '#9966FF',
//               '#FF9F40',
//             ],
//           },
//         ],
//       });
//     } catch (err) {
//       console.error('Error loading dashboard data', err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // ✅ Handle Add Transaction
//   const handleAddTransaction = async (newTx) => {
//     try {
//       await api.post('/transactions', newTx);
//       await fetchData(); // refresh everything after adding
//     } catch (err) {
//       console.error('Failed to add transaction', err);
//     }
//   };

//   // ✅ Example Add Goal (if your backend has it)
//   const handleAddGoal = (goal) => {
//     setGoals((prev) => [...prev, goal]);
//   };

//   // ✅ Example Add Wallet (if you have wallet logic)
//   const handleAddWallet = (wallet) => {
//     setWallets((prev) => [...prev, wallet]);
//   };

//   // ✅ Example Add Subscription (for Manage Subs)
//   const handleAddSubscription = (sub) => {
//     setSubscriptions((prev) => [...prev, sub]);
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
//       {/* Dashboard Header */}
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <div className="text-lg font-semibold text-gray-700">
//           Total Income: ₹{totalIncome} | Total Spent: ₹{totalSpent}
//         </div>
//       </header>

//       {/* Overview Section */}
//       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="p-4 bg-white rounded-2xl shadow">
//           <h2 className="font-semibold text-lg mb-2">Manage Wallet</h2>
//           <button
//             onClick={() =>
//               handleAddWallet({ name: 'New Wallet', balance: 5000 })
//             }
//             className="bg-blue-500 text-white px-3 py-1 rounded"
//           >
//             + Add Wallet
//           </button>
//           <ul className="mt-2 text-sm text-gray-700">
//             {wallets.map((w, i) => (
//               <li key={i}>
//                 {w.name}: ₹{w.balance}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="p-4 bg-white rounded-2xl shadow">
//           <h2 className="font-semibold text-lg mb-2">Manage Subs</h2>
//           <button
//             onClick={() =>
//               handleAddSubscription({ name: 'Netflix', cost: 499 })
//             }
//             className="bg-green-500 text-white px-3 py-1 rounded"
//           >
//             + Add Subscription
//           </button>
//           <ul className="mt-2 text-sm text-gray-700">
//             {subscriptions.map((s, i) => (
//               <li key={i}>
//                 {s.name}: ₹{s.cost}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="p-4 bg-white rounded-2xl shadow">
//           <h2 className="font-semibold text-lg mb-2">Goals</h2>
//           <button
//             onClick={() => handleAddGoal({ name: 'Buy Laptop', target: 70000 })}
//             className="bg-purple-500 text-white px-3 py-1 rounded"
//           >
//             + Add Goal
//           </button>
//           <ul className="mt-2 text-sm text-gray-700">
//             {goals.map((g, i) => (
//               <li key={i}>
//                 {g.name}: ₹{g.target}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* Pie Chart Section */}
//       <section className="p-4 bg-white rounded-2xl shadow">
//         <h2 className="font-semibold text-lg mb-3">Expense Breakdown</h2>
//         {chartData.labels && chartData.labels.length > 0 ? (
//           <ChartWrapper type="pie" data={chartData} />
//         ) : (
//           <p className="text-gray-500 text-sm">No transactions yet.</p>
//         )}
//       </section>

//       {/* Transactions List */}
//       <section className="p-4 bg-white rounded-2xl shadow">
//         <div className="flex justify-between items-center mb-3">
//           <h2 className="font-semibold text-lg">Transactions</h2>
//           <button
//             onClick={() =>
//               handleAddTransaction({
//                 name: 'Food Expense',
//                 category: 'Food',
//                 amount: 500,
//                 mode: 'Cash',
//                 date: new Date().toISOString(),
//               })
//             }
//             className="bg-indigo-500 text-white px-3 py-1 rounded"
//           >
//             + Add Transaction
//           </button>
//         </div>

//         <ul className="divide-y text-sm text-gray-700">
//           {transactions.length > 0 ? (
//             transactions.map((tx) => (
//               <li key={tx.id} className="py-2 flex justify-between">
//                 <span>
//                   {tx.name} ({tx.category})
//                 </span>
//                 <span>₹{tx.amount}</span>
//               </li>
//             ))
//           ) : (
//             <li className="py-2 text-gray-500">No transactions yet.</li>
//           )}
//         </ul>
//       </section>
//     </div>
//   );
// }

