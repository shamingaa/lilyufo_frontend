import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../api/client';
import { input, label, pageHeading, primaryButton } from '../styles';
import { PasswordInput } from '../components/PasswordInput';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create account.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className={`mb-6 ${pageHeading}`}>Create an account</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-md border border-stone-200 bg-white p-6 shadow-sm"
      >
        <label className={label}>
          Name
          <input required value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </label>
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
          <PasswordInput
            required
            minLength={6}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-500">
        Already have an account?{' '}
        <Link to="/login" className="text-stone-800 underline decoration-stone-300 underline-offset-2 hover:text-stone-900">
          Log in
        </Link>
      </p>
    </div>
  );
}
