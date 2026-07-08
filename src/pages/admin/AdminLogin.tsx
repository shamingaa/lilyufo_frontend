import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiErrorMessage } from '../../api/client';
import { input, label, pageHeading, primaryButton } from '../../styles';
import { PasswordInput } from '../../components/PasswordInput';

export function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(apiErrorMessage(err, 'Invalid admin credentials.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className={`mb-6 ${pageHeading}`}>Admin Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-md border border-stone-200 bg-white p-6 shadow-sm"
      >
        <label className={label}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
          />
        </label>
        <label className={label}>
          Password
          <PasswordInput required value={password} onChange={setPassword} autoComplete="current-password" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
