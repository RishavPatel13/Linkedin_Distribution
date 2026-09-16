import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ShieldCheck, Radio, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !password) {
      setError('Please enter both ID and password.');
      return;
    }

    setIsSubmitting(true);
    // Brief delay so the button state feels intentional
    await new Promise((r) => setTimeout(r, 350));

    const result = login(userId, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success('Welcome back, Linkedin-Admin');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-[#0f172a]">
      {/* Brand panel — matches sidebar language */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative overflow-hidden bg-[#0f172a] text-white flex-col justify-between p-10 xl:p-14">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(0,119,181,0.45), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, rgba(14,165,233,0.2), transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0077B5] flex items-center justify-center shadow-lg shadow-[#0077B5]/40">
              <span className="font-bold text-xl leading-none">in</span>
            </div>
            <div>
              <div className="font-bold text-base tracking-tight">LinkedIn Distribution</div>
              <div className="text-slate-400 text-xs">Content Engine</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0077B5]/15 border border-[#0077B5]/30 text-[#38bdf8] text-xs font-semibold">
            <Radio className="w-3.5 h-3.5" />
            Admin portal access
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
            Broadcast once.
            <span className="block text-slate-300 font-semibold mt-1">Reach every channel.</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Secure entry to your LinkedIn content distribution workspace — create, reshare, and
            manage company pages & groups from one place.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: 'AI drafting', icon: Sparkles },
              { label: 'Multi-target post', icon: Radio },
              { label: 'Reshare by URL', icon: ShieldCheck },
              { label: 'Live connection', icon: Lock },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-900/50 px-3 py-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0077B5]/20 text-[#38bdf8] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-500">
          Authorized operators only · Session clears when the browser tab closes
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#0077B5] flex items-center justify-center text-white shadow-md shadow-[#0077B5]/30">
              <span className="font-bold text-lg leading-none">in</span>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">LinkedIn Distribution</div>
              <div className="text-slate-500 text-xs">Content Engine</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-200/60 p-7 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign in</h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Enter your admin credentials to open the distribution dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-id" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Admin ID
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="login-id"
                    type="text"
                    autoComplete="username"
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value);
                      setError('');
                    }}
                    placeholder="Linkedin-Admin"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5]/30 focus:border-[#0077B5] transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5]/30 focus:border-[#0077B5] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0077B5] hover:bg-[#005f8d] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 shadow-md shadow-[#0077B5]/25 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign in to dashboard
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-5">
            LinkedIn Distribution System · Internal use only
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
