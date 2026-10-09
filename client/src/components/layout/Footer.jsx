import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Heart, PhoneCall, HelpCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-gray-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Swasth<span className="text-brand-400">Setu</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Bridging healthcare gaps across Indian rural communities by digitally uniting patients, frontline ASHA workers, doctors, hospitals, and district administration.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-navy-900 border border-navy-700 text-[11px] text-brand-300">
              <ShieldAlert className="w-3.5 h-3.5 text-brand-400" />
              <span>National Hackathon 2026 Prototype</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About SwasthSetu</Link></li>
              <li><a href="#features" className="hover:text-white transition-colors">Core Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Referral Workflow</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Healthcare Portal Login</Link></li>
            </ul>
          </div>

          {/* Col 3: 5 Roles Ecosystem */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Five-Tier Network</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>1. Rural Patients & Families</li>
              <li>2. Frontline Health Workers (ASHA/ANM)</li>
              <li>3. Primary & Specialist Doctors</li>
              <li>4. Facility Administrators (PHC / CHC)</li>
              <li>5. District Administration (CMO)</li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Emergency Helplines</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                <span>108 - National Emergency Ambulance</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                <span>102 - Free Pregnancy / Infant Transport</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                <span>112 - Pan-India Emergency Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="mt-10 pt-6 border-t border-navy-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500">
          <p>
            © 2026 SwasthSetu Healthcare Initiative. Strictly a hackathon demonstration system. Not certified as a medical device.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Designed for 24-Hour Innovation</span>
            <span>•</span>
            <span className="text-brand-400 font-medium">Sitapur District Pilot Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

