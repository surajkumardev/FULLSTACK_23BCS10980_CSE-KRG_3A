import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, CreditCard, BarChart3, Users } from 'lucide-react';
import Reveal from '../components/common/Reveal';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-secondary-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center cursor-pointer group">
              <div className="logo-container h-10 w-10 transition-transform group-hover:scale-110">
                <img src="/lgoog_proeject.png" alt="FINANCIFY Logo" className="w-full h-full" />
              </div>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-secondary-700 hover:text-primary-600 px-5 py-2  rounded-md font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-gradient px-6 py-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="py-40 relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>

        {/* Floating decorations */}
        <span className="hero-decor hero-decor--pink" style={{ top: '10%', left: '5%', width: 140, height: 140 }}></span>
        <span className="hero-decor hero-decor--violet" style={{ bottom: '15%', right: '10%', width: 160, height: 160, animationDelay: '0.8s' }}></span>
        <span className="hero-decor hero-decor--blue" style={{ top: '40%', right: '30%', width: 120, height: 120, animationDelay: '0.4s' }}></span>

        <div className="container mx-auto px-6 text-center relative z-10">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-12 leading-tight">
              Take Control of Your
              <br />
              <span className="text-yellow-300">Financial Future</span>
            </h1>
          </Reveal>
          <Reveal>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register" className="btn btn-gradient btn-lg shadow-xl">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg shadow-lg">
                Sign In
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 bg-secondary-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-900">
                Features
              </h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <Reveal className="card text-center">
              <div className="card-body py-8 px-6">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">
                  Smart Dashboard
                </h3>
              </div>
            </Reveal>

            {/* Feature 2 */}
            <Reveal className="card text-center" style={{ transitionDelay: '0.05s' }}>
              <div className="card-body py-8 px-6">
                <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">
                  Transaction Management
                </h3>
              </div>
            </Reveal>

            {/* Feature 3 */}
            <Reveal className="card text-center" style={{ transitionDelay: '0.1s' }}>
              <div className="card-body py-8 px-6">
                <div className="h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-warning-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">
                  Bank Integration
                </h3>
              </div>
            </Reveal>

            {/* Feature 4 */}
            <Reveal className="card text-center" style={{ transitionDelay: '0.15s' }}>
              <div className="card-body py-8 px-6">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">
                  Subscription Plans
                </h3>
              </div>
            </Reveal>

            {/* Feature 5 */}
            <Reveal className="card text-center" style={{ transitionDelay: '0.2s' }}>
              <div className="card-body py-8 px-6">
                <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">
                  Secure Authentication
                </h3>
              </div>
            </Reveal>

            {/* Feature 6 */}
            <Reveal className="card text-center" style={{ transitionDelay: '0.25s' }}>
              <div className="card-body py-8 px-6">
                <div className="h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-warning-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">
                  Financial Analytics
                </h3>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-900">Testimonials</h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Reveal>
              <div className="testimonial-card">
                <div className="flex items-center gap-4 mb-4">
                  <img className="avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop" alt="User avatar" />
                  <div>
                    <div className="font-semibold">Ayesha Khan</div>
                    <div className="text-secondary-500 text-sm">Freelancer</div>
                  </div>
                </div>
                <p className="text-secondary-700">
                  “The dashboard gives me clarity in minutes. I love the clean design and the insights.”
                </p>
              </div>
            </Reveal>

            <Reveal style={{ transitionDelay: '0.1s' }}>
              <div className="testimonial-card">
                <div className="flex items-center gap-4 mb-4">
                  <img className="avatar" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format&fit=crop" alt="User avatar" />
                  <div>
                    <div className="font-semibold">Rohan Mehta</div>
                    <div className="text-secondary-500 text-sm">Product Manager</div>
                  </div>
                </div>
                <p className="text-secondary-700">
                  “Bank integrations and transaction tagging saved me hours. Highly recommended.”
                </p>
              </div>
            </Reveal>

            <Reveal style={{ transitionDelay: '0.2s' }}>
              <div className="testimonial-card">
                <div className="flex items-center gap-4 mb-4">
                  <img className="avatar" src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80&auto=format&fit=crop" alt="User avatar" />
                  <div>
                    <div className="font-semibold">Priya Sharma</div>
                    <div className="text-secondary-500 text-sm">Entrepreneur</div>
                  </div>
                </div>
                <p className="text-secondary-700">
                  “The analytics helped me cut unnecessary spending and plan better.”
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

   

      {/* Footer */}
      <footer className="bg-secondary-900 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center cursor-pointer group">
              <div className="logo-container h-8 w-8 transition-transform group-hover:scale-110">
                <img src="/lgoog_proeject.png" alt="FINANCIFY Logo" className="w-full h-full" />
              </div>
            </Link>
            <div className="flex gap-6">
              <a href="#features" className="text-secondary-400 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-secondary-400 hover:text-white transition-colors">Testimonials</a>
              <a href="#contact" className="text-secondary-400 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-secondary-400 text-sm">
              © 2025 FINANCIFY. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

