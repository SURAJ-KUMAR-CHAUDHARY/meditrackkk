import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Building, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState<'patient' | 'doctor'>(defaultRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'patient') {
      navigate('/patient/dashboard');
    } else {
      navigate('/doctor/dashboard');
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 medical-grid opacity-20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">MediTrack</span>
            </Link>
            
            <h1 className="text-4xl font-bold mb-4">
              Welcome to your{' '}
              <span className="gradient-text">health journey</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Access your complete medical history, share records with doctors, 
              and take control of your healthcare.
            </p>
          </motion.div>
          
          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-32 right-20 glass-card p-6 w-64"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-medium text-sm">50,000+</div>
                <div className="text-xs text-muted-foreground">Active Patients</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          
          <div className="glass-card-solid p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {isSignUp ? 'Create your account' : 'Sign in to MediTrack'}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp ? 'Start managing your health records today' : 'Access your medical history'}
              </p>
            </div>
            
            {/* Role tabs */}
            <Tabs value={role} onValueChange={(v) => setRole(v as 'patient' | 'doctor')} className="mb-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="patient" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
                  <User className="w-4 h-4 mr-2" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
                  <Building className="w-4 h-4 mr-2" />
                  Doctor
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder={role === 'patient' ? 'John Doe' : 'Dr. Jane Smith'}
                      className="pl-11 h-12"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-11 h-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 h-12"
                  />
                </div>
              </div>
              
              {role === 'doctor' && isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="license">Medical License Number</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="license"
                      placeholder="License #"
                      className="pl-11 h-12"
                    />
                  </div>
                </div>
              )}
              
              <Button type="submit" variant="gradient" className="w-full" size="lg">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
