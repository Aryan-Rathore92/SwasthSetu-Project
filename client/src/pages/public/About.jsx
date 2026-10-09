import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ShieldAlert, Heart, Building, Users, Activity } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-wider text-brand-500 uppercase">Our Mission</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            About the SwasthSetu Initiative
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Strengthening existing public healthcare coordination across rural India without replacing doctor clinical authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-navy-900">The Problem in Underserved Communities</h2>
            <p>
              Rural patients often travel between Sub-Centres, Primary Health Centres (PHCs), Community Health Centres (CHCs), and District Hospitals.
              Their medical records rarely move with them, causing repetitive examinations, delayed diagnosis, long queues, and costly travel for impoverished families.
            </p>
            <p>
              SwasthSetu was conceived as a digital coordination bridge ("Setu") that connects frontline workers, medical officers, and hospital admins to ensure care continuity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Hackathon Context & Medical Disclaimer</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              SwasthSetu is developed strictly as a 24-Hour National Hackathon demonstration project. It is NOT a certified medical device, NOT a replacement for emergency dispatch systems (108/102), and must NOT be used for real clinical decision-making.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              All clinical rules and AI explanations serve as proof-of-concept decision support for healthcare evaluators.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

