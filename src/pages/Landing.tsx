import { Link } from 'react-router-dom';
import { Flame, Target, Trophy, TrendingUp, Zap, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-primary" />
              <span className="text-2xl font-black tracking-tight">
                Momentum
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <Link to="/connect">
                <button className="h-10 px-6 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
                Build Trading
                <br />
                <span className="text-primary">Discipline</span> On-Chain
              </h1>

              <p className="mx-auto max-w-2xl text-lg sm:text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium">
                Track your trading habits, build streaks, earn XP, and prove your discipline with NFT badges.
                Built on the Internet Computer.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link to="/connect">
                  <button className="w-full sm:w-auto rounded-2xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-2xl transition-all duration-300 hover:shadow-primary/25 hover:scale-105 text-base sm:text-lg">
                    Start Building Habits
                  </button>
                </Link>

                <a href="#features">
                  <button className="w-full sm:w-auto rounded-2xl border-2 border-border bg-background px-8 py-4 font-bold text-foreground transition-all duration-300 hover:bg-muted hover:scale-105 shadow-lg text-base sm:text-lg">
                    Learn More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-20 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
              Features Built for{' '}
              <span className="text-primary">Traders</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground font-semibold">
              Everything you need to build consistent trading discipline
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-3xl border-2 border-border bg-card p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
              How <span className="text-primary">Momentum</span> Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground font-semibold">
              Simple steps to build trading discipline
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 rounded-2xl border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/connect">
              <button className="rounded-2xl bg-primary px-10 py-5 font-bold text-primary-foreground shadow-2xl transition-all duration-300 hover:shadow-primary/25 hover:scale-105 text-lg">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <Flame className="h-6 w-6 text-primary" />
              <span className="text-xl font-black">Momentum</span>
            </div>

            <p className="text-muted-foreground text-center">
              Built on the Internet Computer for ICP WCHL'25 Hackathon
            </p>

            <p className="text-muted-foreground">
              © 2025 Momentum. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: 'Habit Tracking',
    description:
      'Create custom trading habits like journaling, risk management reviews, and market analysis. Track daily or weekly.',
    icon: Target,
  },
  {
    title: 'Streak System',
    description:
      'Build momentum with streak tracking. Every check-in counts, and your streak grows with consistency.',
    icon: Flame,
  },
  {
    title: 'XP & Levels',
    description:
      'Earn experience points for each habit completion. Level up as you build discipline and consistency.',
    icon: TrendingUp,
  },
  {
    title: 'NFT Badges',
    description:
      'Earn verifiable NFT badges for milestone streaks. Proof of your trading discipline on-chain.',
    icon: Trophy,
  },
  {
    title: 'AI Coaching',
    description:
      'Get motivational nudges and trading-focused encouragement based on your progress and habits.',
    icon: Zap,
  },
  {
    title: 'Leaderboards',
    description:
      'Compete with fellow traders. See who has the longest streaks and highest discipline scores.',
    icon: Users,
  },
];

const steps = [
  {
    title: 'Connect Your Wallet',
    description:
      'Sign in with Internet Identity or NFID. Your identity and data are stored securely on-chain.',
  },
  {
    title: 'Create Trading Habits',
    description:
      'Set up habits like daily journaling, risk reviews, or market analysis. Choose daily or weekly frequency.',
  },
  {
    title: 'Check In Daily',
    description:
      'Complete your habits and check in. Earn XP, build streaks, and level up your trading discipline.',
  },
  {
    title: 'Earn NFT Badges',
    description:
      'Hit streak milestones and mint NFT badges as proof of your discipline. Build your on-chain reputation.',
  },
];

export default Landing;
