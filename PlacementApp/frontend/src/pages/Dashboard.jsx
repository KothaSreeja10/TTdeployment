import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, BookOpen, TrendingUp } from 'lucide-react';
import api from '../api';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay, duration: 0.5 }}
    className="glass-panel p-6 flex items-center justify-between card-hover cursor-default"
  >
    <div>
      <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon size={28} className="text-white" />
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, companies: 0, skills: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [stRes, coRes, skRes, jbRes] = await Promise.all([
          api.get('/students'),
          api.get('/companies'),
          api.get('/skills'),
          api.get('/companies/all-jobs')
        ]);
        setStats({
          students: stRes.data.length,
          companies: coRes.data.length,
          skills: skRes.data.length,
          jobs: jbRes.data.length
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-100 drop-shadow-sm mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-400">Welcome to EduTrack! Here is the latest campus placement data.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.students} icon={Users} color="bg-blue-500/80 shadow-lg shadow-blue-500/20" delay={0.1} />
        <StatCard title="Partner Companies" value={stats.companies} icon={Building2} color="bg-indigo-500/80 shadow-lg shadow-indigo-500/20" delay={0.2} />
        <StatCard title="Active Jobs" value={stats.jobs} icon={TrendingUp} color="bg-teal-500/80 shadow-lg shadow-teal-500/20" delay={0.3} />
        <StatCard title="Skill Catalog" value={stats.skills} icon={BookOpen} color="bg-purple-500/80 shadow-lg shadow-purple-500/20" delay={0.4} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-panel p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-10 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 text-center space-y-4">
          <BookOpen className="mx-auto text-slate-500/50" size={64} />
          <h2 className="text-2xl font-semibold text-slate-300">More Insights Coming Soon</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Detailed analytics, recent placement activities, and high-match candidates will be displayed here.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
