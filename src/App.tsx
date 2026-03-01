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

interface Participant {
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber: string;
  batch: string;
  degree: string;
  course: string;
  instituteName: string;
}

interface Registration {
  id: string;
  teamName: string;
  participationType: 'solo' | 'duo';
  sameClass: boolean;
  participant1: Participant;
  participant2?: Participant;
  present: boolean;
  created_at: string;
}

export default function App() {
  const [view, setView] = useState<'register' | 'admin-login' | 'admin-dashboard'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/meow')) {
      return 'admin-login';
    }
    return 'register';
  });
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

      {/* Header / Nav (no visible admin toggle) */}
      <header className="relative z-20 w-full p-4 flex justify-between items-center">
        <div></div>
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
  const [duoStep, setDuoStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    teamName: '',
    participationType: 'solo' as 'solo' | 'duo',
    sameClass: true,
    sharedClass: {
      batch: '',
      degree: '',
      course: '',
      instituteName: '',
    },
    participant1: {
      fullName: '',
      email: '',
      phone: '',
      enrollmentNumber: '',
      batch: '',
      degree: '',
      course: '',
      instituteName: '',
    },
    participant2: {
      fullName: '',
      email: '',
      phone: '',
      enrollmentNumber: '',
      batch: '',
      degree: '',
      course: '',
      instituteName: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formData.participationType === 'solo') setDuoStep(1);
  }, [formData.participationType]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.participationType === 'duo' && duoStep === 1) {
      setDuoStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          teamName: '',
          participationType: 'solo',
          sameClass: true,
          sharedClass: { batch: '', degree: '', course: '', instituteName: '' },
          participant1: {
            fullName: '',
            email: '',
            phone: '',
            enrollmentNumber: '',
            batch: '',
            degree: '',
            course: '',
            instituteName: '',
          },
          participant2: {
            fullName: '',
            email: '',
            phone: '',
            enrollmentNumber: '',
            batch: '',
            degree: '',
            course: '',
            instituteName: '',
          },
        });
        setDuoStep(1);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentKey =
    formData.participationType === 'duo'
      ? duoStep === 1
        ? 'participant1'
        : 'participant2'
      : 'participant1';

  const current = formData[currentKey];

  const setCurrent = (patch: Partial<typeof current>) => {
    setFormData({
      ...formData,
      [currentKey]: {
        ...current,
        ...patch,
      },
    } as any);
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
              <Trophy size={14} /> Team Name
            </label>
            <input
              required
              type="text"
              value={formData.teamName}
              onChange={e => setFormData({ ...formData, teamName: e.target.value })}
              placeholder="e.g. Pixel Warriors"
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
                <BookOpen size={14} /> Participation
              </label>
              <select
                required
                value={formData.participationType}
                onChange={e => setFormData({ ...formData, participationType: e.target.value as 'solo' | 'duo' })}
                className="w-full px-4 py-3 border-2 border-[#535353] bg-white focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
              >
                <option value="solo">Solo</option>
                <option value="duo">Duo</option>
              </select>
            </div>

            {formData.participationType === 'duo' && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
                  <BookOpen size={14} /> Same Class
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sameClass: !formData.sameClass })}
                  className={`w-full pixel-button px-4 py-3 text-[10px] sm:text-xs font-black tracking-widest ${formData.sameClass ? 'bg-green-500 text-white' : 'bg-[#535353] text-white'}`}
                >
                  {formData.sameClass ? 'YES (FILL ONCE)' : 'NO (FILL BOTH)'}
                </button>
              </div>
            )}
          </div>

          {formData.participationType === 'duo' && formData.sameClass && (
            <div className="bg-gray-50 border-2 border-[#535353] p-4 space-y-4">
              <div className="text-[10px] font-black text-[#535353] uppercase tracking-widest">Shared Class Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#535353] uppercase tracking-wider block">Batch</label>
                  <input
                    required
                    type="text"
                    value={formData.sharedClass.batch}
                    onChange={e => setFormData({ ...formData, sharedClass: { ...formData.sharedClass, batch: e.target.value } })}
                    className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-white transition-colors font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#535353] uppercase tracking-wider block">Degree</label>
                  <input
                    required
                    type="text"
                    value={formData.sharedClass.degree}
                    onChange={e => setFormData({ ...formData, sharedClass: { ...formData.sharedClass, degree: e.target.value } })}
                    className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-white transition-colors font-bold text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#535353] uppercase tracking-wider block">Course</label>
                  <input
                    required
                    type="text"
                    value={formData.sharedClass.course}
                    onChange={e => setFormData({ ...formData, sharedClass: { ...formData.sharedClass, course: e.target.value } })}
                    className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-white transition-colors font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#535353] uppercase tracking-wider block">Institute Name</label>
                  <input
                    required
                    type="text"
                    value={formData.sharedClass.instituteName}
                    onChange={e => setFormData({ ...formData, sharedClass: { ...formData.sharedClass, instituteName: e.target.value } })}
                    className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-white transition-colors font-bold text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.participationType === 'duo' && (
            <div className="text-center text-[10px] font-black text-[#535353] uppercase tracking-[0.3em]">
              {duoStep === 1 ? 'Participant 1' : 'Participant 2'}
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
              <User size={14} /> Full Name
            </label>
            <input
              required
              type="text"
              value={current.fullName}
              onChange={e => setCurrent({ fullName: e.target.value })}
              placeholder="Enter full name"
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
              value={current.email}
              onChange={e => setCurrent({ email: e.target.value })}
              placeholder="pixel@example.com"
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
              <Phone size={14} /> Phone Number
            </label>
            <input
              required
              type="tel"
              value={current.phone}
              onChange={e => setCurrent({ phone: e.target.value })}
              placeholder="+91 999999999"
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
              <BookOpen size={14} /> Enrollment Number
            </label>
            <input
              required
              type="text"
              value={current.enrollmentNumber}
              onChange={e => setCurrent({ enrollmentNumber: e.target.value })}
              placeholder="e.g. ENR123456"
              className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
            />
          </div>

          {(formData.participationType === 'solo' || !formData.sameClass) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
                    <BookOpen size={14} /> Batch
                  </label>
                  <input
                    required
                    type="text"
                    value={current.batch}
                    onChange={e => setCurrent({ batch: e.target.value })}
                    placeholder="e.g. 2024-2028"
                    className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
                    <BookOpen size={14} /> Degree
                  </label>
                  <input
                    required
                    type="text"
                    value={current.degree}
                    onChange={e => setCurrent({ degree: e.target.value })}
                    placeholder="e.g. B.Tech"
                    className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
                    <BookOpen size={14} /> Course
                  </label>
                  <input
                    required
                    type="text"
                    value={current.course}
                    onChange={e => setCurrent({ course: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-[#535353] uppercase tracking-wider">
                    <BookOpen size={14} /> Institute Name
                  </label>
                  <input
                    required
                    type="text"
                    value={current.instituteName}
                    onChange={e => setCurrent({ instituteName: e.target.value })}
                    placeholder="Your college / institute"
                    className="w-full px-4 py-3 border-2 border-[#535353] focus:outline-none focus:bg-gray-50 transition-colors font-bold text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {formData.participationType === 'duo' && (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDuoStep(1)}
                disabled={duoStep === 1}
                className="pixel-button px-4 py-2 bg-[#535353] text-white text-xs disabled:opacity-50"
              >
                PARTICIPANT 1
              </button>
              <button
                type="button"
                onClick={() => setDuoStep(2)}
                className="pixel-button px-4 py-2 bg-[#5a6b8c] text-white text-xs"
              >
                PARTICIPANT 2
              </button>
            </div>
          )}

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
                {submitted
                  ? 'SUCCESSFULLY REGISTERED!'
                  : isSubmitting
                    ? 'PROCESSING...'
                    : formData.participationType === 'duo' && duoStep === 1
                      ? 'NEXT: PARTICIPANT 2'
                      : 'SUBMIT REGISTRATION'}
              </span>
            </div>
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-[10px] font-bold text-black uppercase tracking-[0.3em]">
        &copy; 2026 PIXEL RUSH 2.0
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

  const handleAttendance = async (id: string, present: boolean) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, present }),
      });

      if (res.ok) {
        setData(prev => prev.map(r => (r.id === id ? { ...r, present } : r)));
      } else if (res.status === 401) {
        setError('Unauthorized token. Please login again.');
        handleLogout();
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json?.message || json?.error || 'Failed to update attendance');
      }
    } catch (err) {
      setError('Failed to update attendance');
    }
  };

  const handleExport = () => {
    if (!data.length) return;

    const headers = [
      'Team Name',
      'Participation Type',
      'Same Class',
      'Present',

      'P1 Full Name',
      'P1 Email',
      'P1 Phone',
      'P1 Enrollment Number',
      'P1 Batch',
      'P1 Degree',
      'P1 Course',
      'P1 Institute Name',

      'P2 Full Name',
      'P2 Email',
      'P2 Phone',
      'P2 Enrollment Number',
      'P2 Batch',
      'P2 Degree',
      'P2 Course',
      'P2 Institute Name',

      'Registered At',
    ];

    const escapeCell = (value: string | number | null | undefined) => {
      const str = value == null ? '' : String(value);
      const escaped = str.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const rows = data.map((row) => [
      escapeCell(row.teamName),
      escapeCell(row.participationType === 'duo' ? 'Duo' : 'Solo'),
      escapeCell(row.sameClass ? 'Yes' : 'No'),
      escapeCell(row.present ? 'Present' : 'Absent'),

      escapeCell(row.participant1?.fullName),
      escapeCell(row.participant1?.email),
      escapeCell(row.participant1?.phone),
      escapeCell(row.participant1?.enrollmentNumber),
      escapeCell(row.participant1?.batch),
      escapeCell(row.participant1?.degree),
      escapeCell(row.participant1?.course),
      escapeCell(row.participant1?.instituteName),

      escapeCell(row.participant2?.fullName || ''),
      escapeCell(row.participant2?.email || ''),
      escapeCell(row.participant2?.phone || ''),
      escapeCell(row.participant2?.enrollmentNumber || ''),
      escapeCell(row.participant2?.batch || ''),
      escapeCell(row.participant2?.degree || ''),
      escapeCell(row.participant2?.course || ''),
      escapeCell(row.participant2?.instituteName || ''),

      escapeCell(new Date(row.created_at).toISOString()),
    ]);

    const csvContent =
      `${headers.map(escapeCell).join(',')}\n` +
      rows.map((r) => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pixel-rush-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            onClick={handleExport}
            className="pixel-button px-4 py-2 bg-green-500 text-white text-[10px] sm:text-xs flex items-center gap-2"
          >
            EXPORT TO EXCEL
          </button>
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
            <table className="w-full text-left border-collapse min-w-[1600px]">
              <thead>
                <tr className="bg-[#535353] text-white">
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Team</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Type</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Same Class</th>

                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P1 Name</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P1 Email</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P1 Phone</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P1 Enroll</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P1 Batch</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P1 Degree</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P1 Course</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P1 Institute</th>

                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P2 Name</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P2 Email</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P2 Phone</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P2 Enroll</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P2 Batch</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P2 Degree</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P2 Course</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">P2 Institute</th>

                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Present</th>
                  <th className="p-3 text-xs font-black tracking-widest uppercase border-2 border-[#535353]">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={23} className="p-8 text-center text-[#757575] font-bold border-2 border-[#535353]">No registrations yet.</td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.teamName}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participationType === 'duo' ? 'Duo' : 'Solo'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.sameClass ? 'Yes' : 'No'}</td>

                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant1?.fullName}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant1?.email}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant1?.phone}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant1?.enrollmentNumber}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant1?.batch}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant1?.degree}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant1?.course}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant1?.instituteName}</td>

                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant2?.fullName || '-'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant2?.email || '-'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant2?.phone || '-'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant2?.enrollmentNumber || '-'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant2?.batch || '-'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant2?.degree || '-'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant2?.course || '-'}</td>
                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">{row.participant2?.instituteName || '-'}</td>

                      <td className="p-3 text-sm font-bold border-2 border-t-0 border-[#535353] text-[#535353]">
                        <label className="inline-flex items-center gap-2 select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(row.present)}
                            onChange={(e) => handleAttendance(row.id, e.target.checked)}
                          />
                          <span className="text-xs font-black">{row.present ? 'Present' : 'Absent'}</span>
                        </label>
                      </td>
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

