import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Wallet, Shield, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';

const Connect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connectWallet } = useAuth();

  const handleConnect = async (method: 'nfid' | 'internet-identity') => {
    setIsConnecting(true);
    setError(null);

    try {
      await connectWallet(method);
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
      setIsConnecting(false);
    }
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
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Connect Your Wallet
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in to start building your trading discipline
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Connection Options */}
          <div className="space-y-4">
            {/* Internet Identity */}
            <button
              onClick={() => handleConnect('internet-identity')}
              disabled={isConnecting}
              className="w-full group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Internet Identity</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure authentication on the Internet Computer
                  </p>
                </div>
              </div>

              {isConnecting && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span className="text-sm font-semibold">Connecting...</span>
                  </div>
                </div>
              )}
            </button>

            {/* NFID */}
            <button
              onClick={() => handleConnect('nfid')}
              disabled={isConnecting}
              className="w-full group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary/20">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">NFID</h3>
                  <p className="text-sm text-muted-foreground">
                    Fast and easy Web3 authentication
                  </p>
                </div>
              </div>

              {isConnecting && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span className="text-sm font-semibold">Connecting...</span>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-6 rounded-2xl border border-border bg-muted/30">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Why connect?
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Your data is stored securely on-chain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>No passwords to remember</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Full control over your identity and data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Earn verifiable NFT badges</span>
              </li>
            </ul>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By connecting, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed top-1/4 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
    </div>
  );
};

export default Connect;
