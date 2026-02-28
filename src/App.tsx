import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  BookOpen,
  Send,
  Database as DbIcon,
  ChevronRight,
  CheckCircle2,
  Trophy,
  ArrowLeft,
  Loader2,
  Phone,
  MessageCircle,
  Lock,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface Registration {
  id: number;
  name: string;
  email: string;
  course: string;
  phone: string;
  whatsapp: string;
  created_at: string;
}

export default function App() {
  const [view, setView] = useState<'register' | 'admin-login' | 'admin-dashboard'>('register');
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#f7f2e8] pixel-grid flex flex-col">
      {/* Moving Clouds */}
      <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none overflow-hidden">
        <MovingCloud delay={0} duration={30} top="10%" />
        <MovingCloud delay={5} duration={45} top="25%" />
        <MovingCloud delay={15} duration={35} top="15%" />
        <MovingCloud delay={2} duration={50} top="5%" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-32 left-10 md:left-20 opacity-40 select-none pointer-events-none hidden sm:block">
        <Cactus />
      </div>
      <div className="absolute bottom-32 right-10 md:right-40 opacity-40 select-none pointer-events-none hidden md:block">
        <Cactus scale={0.8} />
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-24 md:h-32 bg-[#5a6b8c] border-t-4 border-[#4a5a7c] flex items-end">
        <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '20px 20px' }} />

        {/* Walking Dino */}
        <div className="absolute bottom-full left-0 w-full h-20 pointer-events-none overflow-hidden">
          <WalkingDino />
        </div>
      </div>

      {/* Header / Nav */}
      <header className="relative z-20 w-full p-4 flex justify-between items-center">
        <div></div>
        {view === 'register' ? (
          <button
            onClick={() => setView('admin-login')}
            className="pixel-button px-4 py-2 flex items-center gap-2 text-xs bg-[#5a6b8c] text-white hover:-translate-y-1 transition-transform"
          >
            <DbIcon size={14} /> ADMIN
          </button>
        ) : (
          <button
            onClick={() => setView('register')}
            className="pixel-button px-4 py-2 flex items-center gap-2 text-xs bg-[#535353] text-white hover:-translate-y-1 transition-transform"
          >
            <ArrowLeft size={14} /> BACK TO REGISTRATION
          </button>
        )}
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center flex-grow p-4 md:p-8 pb-32">
        {view === 'register' && <RegistrationForm />}
        {view === 'admin-login' && <AdminLogin setView={setView} setAdminToken={setAdminToken} />}
        {view === 'admin-dashboard' && <AdminDashboard token={adminToken!} setView={setView} setAdminToken={setAdminToken} />}
      </main>
    </div>
  );
}

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    phone: '',
    whatsapp: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', course: '', phone: '', whatsapp: '' });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-lg"
    >
      <div className="text-center mb-6 md:mb-10">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-black text-[#535353] tracking-tighter mb-2 leading-none"
          style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
        >
          PIXEL RUSH 2.0
        </motion.h1>
        <div className="flex items-center justify-center gap-2">
          <div className="h-1 w-8 bg-[#535353]" />
          <p className="text-[#757575] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">Event Registration</p>
          <div className="h-1 w-8 bg-[#535353]" />
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 pixel-border relative">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
              <User size={14} /> Full Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
              <BookOpen size={14} /> Email Address
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="pixel@example.com"
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
              <BookOpen size={14} /> Course / Batch
            </label>
            <input
              required
              type="text"
              value={formData.course}
              onChange={e => setFormData({ ...formData, course: e.target.value })}
              placeholder="e.g. Computer Science 2026"
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
                <Phone size={14} /> Phone Number
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 999999999"
                className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
                <MessageCircle size={14} /> WhatsApp Number
              </label>
              <input
                required
                type="tel"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+91 999999999"
                className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
              />
            </div>
          </div>



          <button
            disabled={isSubmitting}
            className={`w-full mt-4 pixel-button flex items-center justify-center gap-3 group py-4 ${submitted ? 'bg-green-500 shadow-[0_4px_0_#166534]' : ''}`}
          >
            <div className="flex items-center gap-3">
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : submitted ? (
                <CheckCircle2 size={20} />
              ) : (
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
              <span className="tracking-widest font-black text-xs sm:text-sm">
                {submitted ? 'SUCCESSFULLY REGISTERED!' : isSubmitting ? 'PROCESSING...' : 'SUBMIT REGISTRATION'}
              </span>
            </div>
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-[10px] font-bold text-[#535353] uppercase tracking-[0.3em]">
        &copy; 2024 PIXEL RUSH
      </p>
    </motion.div>
  );
}

function AdminLogin({ setView, setAdminToken }: { setView: (v: any) => void, setAdminToken: (t: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto redirect if token exists
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      setView('admin-dashboard');
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        setView('admin-dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-[#535353] tracking-tighter mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
          ADMIN PORTAL
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="h-1 w-6 bg-[#535353]" />
          <Lock size={12} className="text-[#535353]" />
          <div className="h-1 w-6 bg-[#535353]" />
        </div>
      </div>

      <div className="bg-white p-8 pixel-border">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-2 text-xs font-bold text-center uppercase tracking-wide">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#535353] uppercase tracking-wider block">Username</label>
            <input
              required
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 font-bold text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#535353] uppercase tracking-wider block">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 font-bold text-sm"
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full mt-4 pixel-button bg-[#5a6b8c] text-white flex items-center justify-center py-3"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span className="font-black text-sm tracking-widest">ACCESS DATA</span>}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function AdminDashboard({ token, setView, setAdminToken }: { token: string, setView: (v: any) => void, setAdminToken: (t: string | null) => void }) {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/registrations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError('Unauthorized token. Please login again.');
        handleLogout();
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setView('admin-login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <DbIcon size={24} className="text-[#535353]" />
          <h2 className="text-3xl font-black text-[#535353] tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
            DATABASE RECORDS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="pixel-button px-4 py-2 bg-yellow-400 text-[#535353] text-[10px] sm:text-xs flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> REFRESH
          </button>
          <button
            onClick={handleLogout}
            className="pixel-button px-4 py-2 bg-red-500 text-white text-[10px] sm:text-xs flex items-center gap-2"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 pixel-border overflow-hidden">
        {error ? (
          <div className="text-center text-red-500 font-bold p-10 uppercase">{error}</div>
        ) : loading && data.length === 0 ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#535353]" size={32} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#535353] text-white">
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Name</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Email</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Batch</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Phone</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">WhatsApp</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#757575] font-bold border-2 border-[#535353]">No registrations yet.</td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.name}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.email}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.course}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.phone || '-'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.whatsapp || '-'}</td>
                      <td className="p-3 text-xs font-bold border-2 border-t-0 border-[#535353] text-[#757575]">
                        {new Date(row.created_at).toLocaleDateString()} {new Date(row.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MovingCloud({ delay = 0, duration = 20, top = "10%" }) {
  return (
    <motion.div
      initial={{ x: "110vw" }}
      animate={{ x: "-20vw" }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      className="absolute opacity-20"
      style={{ top }}
    >
      <Cloud />
    </motion.div>
  );
}

function Cloud() {
  return (
    <svg width="80" height="32" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="0" width="40" height="10" fill="#535353" />
      <rect x="0" y="10" width="80" height="10" fill="#535353" />
      <rect x="10" y="20" width="90" height="10" fill="#535353" />
      <rect x="40" y="30" width="40" height="10" fill="#535353" />
    </svg>
  );
}

function Cactus({ scale = 1 }) {
  return (
    <div style={{ transform: `scale(${scale})` }}>
      <svg width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="0" width="10" height="80" fill="#535353" />
        <rect x="5" y="20" width="10" height="10" fill="#535353" />
        <rect x="0" y="30" width="10" height="20" fill="#535353" />
        <rect x="25" y="10" width="10" height="10" fill="#535353" />
        <rect x="30" y="20" width="10" height="20" fill="#535353" />
      </svg>
    </div>
  );
}

function WalkingDino() {
  return (
    <motion.div
      initial={{ x: "-20vw" }}
      animate={{ x: "110vw" }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute bottom-0"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          y: { repeat: Infinity, duration: 0.4, ease: "easeInOut" },
        }}
        className="w-12 h-12 md:w-16 md:h-16"
      >
        <img
          src="https://res.cloudinary.com/dkdvmchfi/image/upload/v1772306863/tyrannosaurus-dino-t-rex-t-rex-chrome-vr-jump-trex-runner-lava-jump-dinosaur-7a6d98d6824c2fc08c10e5a6a2d66e74_omkevp.png"
          alt="Walking Dino"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://res.cloudinary.com/dkdvmchfi/image/upload/v1772306863/tyrannosaurus-dino-t-rex-t-rex-chrome-vr-jump-trex-runner-lava-jump-dinosaur-7a6d98d6824c2fc08c10e5a6a2d66e74_omkevp.png";
          }}
        />
      </motion.div>
    </motion.div>
  );
}

