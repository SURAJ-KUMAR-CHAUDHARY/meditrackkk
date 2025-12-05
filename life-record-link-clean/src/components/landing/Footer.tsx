import { Heart, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">MediTrack</span>
            </Link>
            <p className="text-background/60 text-sm">
              Your complete medical history, securely stored and accessible anywhere.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-background/60 text-sm">
              <li><Link to="/" className="hover:text-background transition-colors">Features</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Pricing</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Security</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Integrations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/60 text-sm">
              <li><Link to="/" className="hover:text-background transition-colors">About</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-background/60 text-sm">
              <li><Link to="/" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-background transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2024 MediTrack. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
