"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MoreHorizontal, FileText } from "lucide-react";
import { fetchLeads, updateLeadStatus, Lead } from "../lib/api/leads";
import LeadDetailsModal from "./LeadDetailsModal";

const columns = [
    { id: "new_lead", label: "New Leads", color: "border-blue-500/50" },
    { id: "docs_pending", label: "Docs Pending", color: "border-yellow-500/50" },
    { id: "applied", label: "Visa Applied", color: "border-purple-500/50" },
    { id: "approved", label: "Visa Approved", color: "border-green-500/50" },
];

export default function LeadsKanban() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const refreshLeads = async () => {
        try {
            const data = await fetchLeads();
            setLeads(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        refreshLeads();
        const interval = setInterval(refreshLeads, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const handleStatusClick = async (e: React.MouseEvent, id: number, currentStatus: string) => {
        e.stopPropagation(); // Prevent modal open
        const statusOrder = ["new_lead", "docs_pending", "applied", "approved"];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

        // Optimistic UI update
        setLeads(leads.map(l => l.id === id ? { ...l, status: nextStatus } : l));
        await updateLeadStatus(id, nextStatus);
    };

    return (
        <div className="h-full overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max h-full px-4">
                {columns.map(col => (
                    <div key={col.id} className={`w-80 flex-shrink-0 bg-gray-900/50 backdrop-blur-sm rounded-xl border-t-2 ${col.color} p-4 flex flex-col`}>
                        <h3 className="text-gray-400 font-medium mb-4 flex justify-between items-center">
                            {col.label}
                            <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                                {leads.filter(l => l.status === col.id).length}
                            </span>
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-3">
                            <AnimatePresence>
                                {leads.filter(l => l.status === col.id).map(lead => (
                                    <motion.div
                                        layoutId={String(lead.id)}
                                        key={lead.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={() => setSelectedLead(lead)}
                                        className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-white">{lead.student.name || "Unknown"}</h4>
                                            <span className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</span>
                                        </div>

                                        <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                                            <span>{lead.country === "Canada" ? "🇨🇦" : lead.country === "UK" ? "🇬🇧" : "🏳️"} {lead.country}</span>
                                        </div>

                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700/50">
                                            <button
                                                onClick={(e) => handleStatusClick(e, lead.id, lead.status)}
                                                className="text-xs text-purple-400 hover:text-purple-300 transition-colors uppercase font-bold tracking-wider"
                                            >
                                                {col.label} ↻
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>

            <LeadDetailsModal
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
            />
        </div>
    );
}
