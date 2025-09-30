import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, User, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { registerUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.username || !formData.email) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      await registerUser({
        authMethod: 'internet-identity', // This will be set from the auth context
        username: formData.username,
        email: formData.email,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-primary" />
              <span className="text-2xl font-black tracking-tight">
                Momentum
              </span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Create Your Profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Let's get you started on your discipline journey
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-2">
                Username <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-2xl transition-all duration-300 hover:shadow-primary/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  Creating Profile...
                </span>
              ) : (
                'Create Profile & Continue'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 p-6 rounded-2xl border border-border bg-muted/30">
            <h4 className="font-bold mb-3">What happens next?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Your profile will be created on-chain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>You'll be redirected to your dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Start creating your first trading habit</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed top-1/4 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
    </div>
  );
};

export default Register;
