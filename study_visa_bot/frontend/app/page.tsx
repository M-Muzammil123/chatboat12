"use client";

import StatsCard from "../components/StatsCard";
import ChatMonitor from "../components/ChatMonitor";
import LeadsKanban from "../components/LeadsKanban";
import { Users, FileCheck, DollarSign, Activity, Globe } from "lucide-react";

import { useEffect, useState } from "react";
import { fetchStats } from "../lib/api/analytics";

export default function Home() {
  const [stats, setStats] = useState({
    total_leads: 0,
    approved_visas: 0,
    active_applications: 0,
    ai_engagement: "0%"
  });

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
    const interval = setInterval(() => fetchStats().then(setStats).catch(console.error), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-8 space-y-8 bg-[url('/grid-bg.svg')] bg-fixed">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
            VisaGenie Nexus
          </h1>
          <p className="text-gray-400 mt-1">AI-Powered Immigration Command Center</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online
          </span>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={stats.total_leads.toString()}
          icon={Users}
          trend="+Live"
          trendUp={true}
          color="cyan"
        />
        <StatsCard
          title="Visa Approved"
          value={stats.approved_visas.toString()}
          icon={FileCheck}
          trend="Target: 100"
          trendUp={true}
          color="green"
        />
        <StatsCard
          title="Active Apps"
          value={stats.active_applications.toString()}
          icon={DollarSign}
          trend="In Pipeline"
          trendUp={true}
          color="purple"
        />
        <StatsCard
          title="AI Engagement"
          value={stats.ai_engagement}
          icon={Activity}
          color="yellow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kanban Board (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="text-cyan-400" size={20} />
              Application Pipeline
            </h2>
            <button className="text-sm text-cyan-400 hover:text-cyan-300">View All</button>
          </div>
          <LeadsKanban />
        </div>

        {/* Chat Monitor (Takes 1 column) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-purple-400" size={20} />
            AI Live Feed
          </h2>
          <ChatMonitor />

          {/* Mini Stat */}
          <div className="glass-panel p-4 rounded-xl border border-gray-800 mt-6">
            <h3 className="text-gray-400 text-sm mb-2">Top Destinations</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>🇨🇦 Canada</span>
                <span className="text-cyan-400 font-bold">45%</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 w-[45%] h-full"></div>
              </div>

              <div className="flex justify-between text-sm">
                <span>🇬🇧 UK</span>
                <span className="text-purple-400 font-bold">30%</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 w-[30%] h-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
