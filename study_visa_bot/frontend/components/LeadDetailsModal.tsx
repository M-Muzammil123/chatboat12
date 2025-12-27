import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Lead, fetchLeadHistory } from "../lib/api/leads";

interface ModalProps {
    lead: Lead | null;
    onClose: () => void;
}

export default function LeadDetailsModal({ lead, onClose }: ModalProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lead) {
            setLoading(true);
            fetchLeadHistory(lead.student.id || lead.id) // Fallback if structure varies
                .then(data => setHistory(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [lead]);

    if (!lead) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 border border-purple-500/30 rounded-xl w-full max-w-4xl h-[80vh] flex overflow-hidden shadow-2xl shadow-purple-900/20"
            >
                {/* Left: Profile Side */}
                <div className="w-1/3 bg-gray-800/50 p-6 border-r border-gray-700 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white mb-1">{lead.student.name || "Unknown Info"}</h2>
                    <p className="text-purple-400 text-sm mb-6 uppercase tracking-wider">Applicant Profile</p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-gray-500 text-xs uppercase">Target Country</label>
                            <div className="text-white font-medium flex items-center gap-2">
                                {lead.country} {lead.country === "Canada" && "🇨🇦"}
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-500 text-xs uppercase">Current Status</label>
                            <div className="text-blue-400 font-mono text-sm">{lead.status}</div>
                        </div>
                        <div>
                            <label className="text-gray-500 text-xs uppercase">Contact ID</label>
                            <div className="text-gray-300 text-sm">{lead.student.whatsapp_id}</div>
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                            <label className="text-gray-500 text-xs uppercase">AI Extracted Data</label>
                            <pre className="text-xs text-green-400 mt-2 bg-black/40 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                                {JSON.stringify(lead.student.profile_data, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Right: Chat Monitor Side */}
                <div className="w-2/3 flex flex-col bg-black/60">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-white font-semibold">Live Chat Transcript</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-sm">
                        {loading ? (
                            <div className="text-gray-500 text-center mt-10">Decrypting secure logs...</div>
                        ) : history.length === 0 ? (
                            <div className="text-gray-600 text-center mt-10 italic">No message history found.</div>
                        ) : (
                            history.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
                                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === "user"
                                            ? "bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700"
                                            : "bg-purple-900/30 text-purple-100 rounded-tr-none border border-purple-500/30"
                                        }`}>
                                        <div className="text-[10px] opacity-50 mb-1 uppercase tracking-widest">
                                            {msg.sender === "user" ? "Student" : "AI Agent"} • {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                        {msg.message}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Simulation of Input (Disabled for now) */}
                    <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                        <input disabled placeholder="Manual override disabled (Agent Mode Only)" className="w-full bg-black/50 border border-gray-700 rounded p-2 text-gray-500 text-sm cursor-not-allowed" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
