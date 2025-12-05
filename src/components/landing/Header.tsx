import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">MediTrack</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button variant="gradient">Get Started</Button>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-b border-border"
        >
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors py-2">
              Features
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors py-2">
              Pricing
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors py-2">
              About
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Link to="/auth">
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button variant="gradient" className="w-full">Get Started</Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};
