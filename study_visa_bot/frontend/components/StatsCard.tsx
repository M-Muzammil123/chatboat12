"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color: "cyan" | "purple" | "green" | "yellow";
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, color }: StatsCardProps) {
    const colorClasses = {
        cyan: "from-cyan-500 to-blue-500",
        purple: "from-purple-500 to-pink-500",
        green: "from-green-500 to-emerald-500",
        yellow: "from-yellow-500 to-orange-500"
    };

    const bgGlow = {
        cyan: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
        purple: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
        green: "shadow-[0_0_20px_rgba(34,197,94,0.15)]",
        yellow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel p-6 rounded-2xl relative overflow-hidden group border border-gray-800 hover:border-gray-700 transition-all ${bgGlow[color]}`}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon size={80} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-10`}>
                        <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
                </div>

                <div className="flex items-end gap-3">
                    <h2 className="text-3xl font-bold text-white">{value}</h2>
                    {trend && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full mb-1 ${trendUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
