import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you! Demo query submitted. In production, this contacts the District CMO helpdesk.');
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold tracking-wider text-brand-500 uppercase">Support & Queries</span>
          <h1 className="text-3xl font-extrabold text-navy-900">Contact SwasthSetu Coordination Desk</h1>
          <p className="text-sm text-gray-600">
            Reach out to our pilot implementation team or report technical demonstration issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm space-y-6">
            <h3 className="text-base font-bold text-navy-900">District Pilot Contact Info</h3>
            <div className="space-y-4 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5" />
                <span>District Health Mission, Collectorate Compound, Sitapur, UP 261001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-500" />
                <span>Toll-Free Health Helpline: 104 / 108</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>support@swasthsetu.gov.in (Demo Domain)</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
              <input required type="text" placeholder="e.g. Dr. Rajesh Sharma" className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone / Mobile</label>
              <input required type="tel" placeholder="10-digit mobile number" className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Message / Feedback</label>
              <textarea required rows={3} placeholder="How can we assist you?" className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border focus:outline-none focus:border-brand-500" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors">
              Submit Message
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

