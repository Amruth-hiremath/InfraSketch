import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import {
    ChevronRight, Database, Server, HardDrive, Shield,
    Palette, Activity, Cloud, Terminal, CheckCircle2,
    AlertTriangle, LogIn, DollarSign, MousePointer,
    TrendingDown, Layers, ArrowRight, X, Zap
} from 'lucide-react';
import Galaxy from '../components/landing/Galaxy';
import DotField from '../components/landing/DotField';
import AuthModal from '../components/auth/AuthModal';

// ─── Spotlight Card ───────────────────────────────────────────────────────────
const SpotlightCard = ({ children, className = '' }) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={() => { setIsFocused(true); setOpacity(1); }}
            onBlur={() => { setIsFocused(false); setOpacity(0); }}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden rounded-3xl border border-[#1c1c1c] bg-[#0A0A0A] ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px z-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,92,0,0.1), transparent 40%)`,
                }}
            />
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
};

// ─── Scroll Stack Card ────────────────────────────────────────────────────────
function ScrollStackCard({ card, index, total, scrollYProgress }) {
    const step = 1 / total;
    const entryStart = Math.max(0, index * step - step * 0.3);
    const entryEnd = index * step;

    const y = useTransform(
        scrollYProgress,
        [entryStart, entryEnd],
        index === 0 ? ['0vh', '0vh'] : ['110vh', '0vh']
    );
    const scale = useTransform(
        scrollYProgress,
        [index * step, Math.min((index + 1) * step, 1)],
        index === total - 1 ? [1, 1] : [1, 0.91]
    );
    const brightness = useTransform(
        scrollYProgress,
        [index * step, Math.min((index + 1) * step, 1)],
        index === total - 1 ? [1, 1] : [1, 0.5]
    );
    const filterValue = useTransform(brightness, (v) => `brightness(${v})`);

    return (
        <motion.div
            style={{ y, scale, zIndex: index + 1, filter: filterValue }}
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8 lg:p-12 will-change-transform"
        >
            <div
                className="w-full h-full max-h-[90vh] lg:max-h-[85vh] rounded-2xl lg:rounded-3xl border overflow-hidden isolate flex flex-col lg:flex-row"
                style={{ background: card.bg, borderColor: card.borderColor }}
            >
                {/* Left: Text */}
                <div className="flex-1 flex flex-col justify-center p-8 lg:p-14">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border w-max mb-6"
                        style={{ borderColor: `${card.accent}30`, background: `${card.accent}10` }}
                    >
                        <span style={{ color: card.accent }}>{card.tagIcon}</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: card.accent }}>
                            {card.tag}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] mb-5">
                        {card.title}
                    </h2>
                    <p className="text-[#666] text-base lg:text-lg leading-relaxed font-medium max-w-md">
                        {card.description}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                        {card.bullets.map((b) => (
                            <span
                                key={b}
                                className="flex items-center gap-1.5 text-xs font-mono text-[#555] bg-[#111] border border-[#1c1c1c] px-3 py-1.5 rounded-full"
                            >
                                <span style={{ color: card.accent }}>›</span> {b}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Right: Visual */}
                <div
                    className="flex-1 relative overflow-hidden rounded-b-2xl lg:rounded-none lg:rounded-r-3xl border-t lg:border-t-0 lg:border-l"
                    style={{ borderColor: card.borderColor }}
                >
                    {card.visual}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Mockup Visuals ───────────────────────────────────────────────────────────
const CanvasMockup = () => (
    <div className="absolute inset-0 bg-[#050505]">
        <div
            className="absolute inset-0 opacity-25"
            style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
            }}
        />
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
            <line x1="28%" y1="38%" x2="52%" y2="38%" stroke="#FF5C00" strokeWidth="1.5" strokeDasharray="5 5" />
            <line x1="52%" y1="38%" x2="72%" y2="62%" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 5" />
            <line x1="28%" y1="38%" x2="16%" y2="62%" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5 5" />
            <line x1="52%" y1="38%" x2="52%" y2="65%" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="5 5" />
        </svg>
        {[
            { label: 'ALB', x: '28%', y: '38%', color: '#FF5C00', sub: 'us-east-1' },
            { label: 'EC2 ×3', x: '52%', y: '38%', color: '#f97316', sub: 't3.large' },
            { label: 'RDS', x: '72%', y: '62%', color: '#3b82f6', sub: 'Aurora' },
            { label: 'Lambda', x: '52%', y: '65%', color: '#22c55e', sub: 'Serverless' },
            { label: 'VPC', x: '16%', y: '62%', color: '#a855f7', sub: '10.0.0.0/16' },
        ].map((node) => (
            <motion.div
                key={node.label}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute"
                style={{ left: node.x, top: node.y, transform: 'translate(-50%,-50%)' }}
            >
                <div
                    className="bg-[#0f0f0f] border rounded-xl px-4 py-2.5 text-center shadow-lg"
                    style={{ borderColor: `${node.color}50`, boxShadow: `0 0 20px ${node.color}18` }}
                >
                    <div className="text-xs font-bold text-white">{node.label}</div>
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: node.color }}>{node.sub}</div>
                </div>
            </motion.div>
        ))}
        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[#333] border border-[#1c1c1c] rounded-lg px-3 py-2 bg-[#0A0A0A]">
            <span className="text-[#FF5C00]">●</span> React Flow Canvas
        </div>
    </div>
);

const CostMockup = () => (
    <div className="absolute inset-0 bg-[#030705] flex flex-col justify-center p-8">
        <div className="mb-5 pb-5 border-b border-[#0d1a0d]">
            <div className="text-[10px] font-mono text-[#445544] uppercase tracking-widest mb-1">Est. Monthly Spend</div>
            <div className="text-5xl font-black text-[#22c55e] font-mono tracking-tighter">
                $4,812<span className="text-3xl text-[#223322]">.50</span>
            </div>
        </div>
        {[
            { icon: <Server size={14} />, name: 'x4 EC2 t3.large', cost: '$245.28', pct: 65 },
            { icon: <Database size={14} />, name: 'RDS Aurora', cost: '$312.00', pct: 80 },
            { icon: <Cloud size={14} />, name: 'CloudFront CDN', cost: '$87.50', pct: 25 },
            { icon: <Shield size={14} />, name: 'WAF + Shield', cost: '$167.72', pct: 45 },
        ].map((item) => (
            <div key={item.name} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 text-xs text-[#557755]">
                        <span className="text-[#22c55e]">{item.icon}</span>
                        {item.name}
                    </div>
                    <span className="text-xs font-mono text-[#22c55e]">{item.cost}</span>
                </div>
                <div className="h-1 bg-[#0a120a] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: '#22c55e', opacity: 0.6 }}
                    />
                </div>
            </div>
        ))}
    </div>
);

const SecurityMockup = () => (
    <div className="absolute inset-0 bg-[#060303] flex flex-col justify-center p-8 gap-4">
        <div className="flex items-start gap-4 p-5 bg-red-950/15 border border-red-900/25 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
            <div>
                <h4 className="text-red-300 font-bold text-sm mb-1">Critical: Public DB Exposure</h4>
                <p className="text-xs font-mono text-red-500/60 leading-relaxed">
                    RDS [db-prod] connected to Internet Gateway. Move to private subnet.
                </p>
            </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-yellow-950/15 border border-yellow-900/25 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 shadow-[0_0_10px_#f59e0b]" />
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-400 mt-0.5" />
            <div>
                <h4 className="text-yellow-300 font-bold text-sm mb-1">Warning: Missing Encryption</h4>
                <p className="text-xs font-mono text-yellow-500/60 leading-relaxed">
                    S3 bucket [assets] has encryption disabled. Enable SSE-S3.
                </p>
            </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-green-950/15 border border-green-900/25 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-400 mt-0.5" />
            <div>
                <h4 className="text-green-300 font-bold text-sm mb-1">Validated: IAM Policies</h4>
                <p className="text-xs font-mono text-green-500/60 leading-relaxed">
                    Lambda execution role follows least-privilege principle.
                </p>
            </div>
        </div>
    </div>
);

const LibraryMockup = () => {
    const services = [
        { name: 'EC2', color: '#f97316' }, { name: 'Lambda', color: '#22c55e' },
        { name: 'S3', color: '#22c55e' }, { name: 'RDS', color: '#3b82f6' },
        { name: 'VPC', color: '#a855f7' }, { name: 'CloudFront', color: '#a855f7' },
        { name: 'DynamoDB', color: '#3b82f6' }, { name: 'SNS', color: '#ec4899' },
        { name: 'SQS', color: '#ec4899' }, { name: 'ECS', color: '#f97316' },
        { name: 'EKS', color: '#f97316' }, { name: 'IAM', color: '#ef4444' },
        { name: 'WAF', color: '#ef4444' }, { name: 'CloudWatch', color: '#64748b' },
        { name: 'Aurora', color: '#3b82f6' }, { name: 'ElastiCache', color: '#06b6d4' },
    ];
    return (
        <div className="absolute inset-0 bg-[#030408] p-8 flex flex-col justify-center">
            <div className="text-[10px] font-mono text-[#868687] uppercase tracking-widest mb-5">
                AWS Service Library — 30+ Components
            </div>
            <div className="grid grid-cols-4 gap-2">
                {services.map((s, i) => (
                    <motion.div
                        key={s.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        whileHover={{ scale: 1.1 }}
                        className="bg-[#08090e] border rounded-lg p-2 flex items-center justify-center cursor-pointer transition-colors"
                        style={{ borderColor: `${s.color}20` }}
                    >
                        <span className="text-[10px] font-bold text-center leading-tight" style={{ color: s.color }}>
                            {s.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const ExportMockup = () => (
    <div className="absolute inset-x-6 top-42 bottom-6 rounded-xl overflow-hidden shadow-2xl bg-[#040306] flex flex-col">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#130f1a]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <span className="text-[#868687] text-[10px] ml-2">infrasketch-export.json</span>
        </div>
        <div className="flex-1 p-6 overflow-hidden">
            <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="text-[11px] leading-loose"
            >
                <span className="text-[#332244]">{'{'}</span>{'\n'}
                <span className="text-[#332244]">  </span>
                <span className="text-[#a855f7]">"version"</span>
                <span className="text-[#332244]">: </span>
                <span className="text-[#22c55e]">"1.0.0"</span>
                <span className="text-[#332244]">,</span>{'\n'}
                <span className="text-[#332244]">  </span>
                <span className="text-[#a855f7]">"name"</span>
                <span className="text-[#332244]">: </span>
                <span className="text-[#22c55e]">"Prod_Infra_v2"</span>
                <span className="text-[#332244]">,</span>{'\n'}
                <span className="text-[#332244]">  </span>
                <span className="text-[#a855f7]">"nodes"</span>
                <span className="text-[#332244]">: [</span>{'\n'}
                <span className="text-[#332244]">    {'{'}</span>{'\n'}
                <span className="text-[#332244]">      </span>
                <span className="text-[#3b82f6]">"id"</span>
                <span className="text-[#332244]">: </span>
                <span className="text-[#22c55e]">"vpc-01"</span>
                <span className="text-[#332244]">,</span>{'\n'}
                <span className="text-[#332244]">      </span>
                <span className="text-[#3b82f6]">"type"</span>
                <span className="text-[#332244]">: </span>
                <span className="text-[#22c55e]">"aws_vpc"</span>{'\n'}
                <span className="text-[#332244]">    {'}'}</span>{'\n'}
                <span className="text-[#332244]">  ]</span>{'\n'}
                <span className="text-[#332244]">{'}'}</span>
            </motion.pre>
        </div>
    </div>
);

// ─── Feature Card Data ────────────────────────────────────────────────────────
const FEATURE_CARDS = [
    {
        tag: 'Visual Canvas',
        tagIcon: <MousePointer size={10} />,
        title: 'Drag & Drop Architecture',
        description:
            'Build cloud infrastructure visually on a limitless canvas. Connect AWS services with smart edges that represent real network paths and security boundaries.',
        accent: '#FF5C00',
        bg: 'linear-gradient(135deg, #080502 0%, #0a0604 100%)',
        borderColor: '#1a1108',
        bullets: ['Snap-to-grid', 'Auto-layout', 'Multi-select', 'Undo / redo'],
        visual: <CanvasMockup />,
    },
    {
        tag: 'Financial Engineering',
        tagIcon: <DollarSign size={10} />,
        title: 'Live Burn Rate Calculator',
        description:
            'Watch your estimated AWS bill update in real-time as you drag components. Stop discovering your cloud costs at the end of the billing cycle.',
        accent: '#22c55e',
        bg: 'linear-gradient(135deg, #030805 0%, #040a06 100%)',
        borderColor: '#0c1a0e',
        bullets: ['Per-service costs', 'Monthly totals', 'Usage-based pricing'],
        visual: <CostMockup />,
    },
    {
        tag: 'Security First',
        tagIcon: <Shield size={10} />,
        title: 'Architecture Linting Engine',
        description:
            "Don't deploy a public database by accident. Our background linter continuously analyzes your connections and flags critical security flaws the instant they appear.",
        accent: '#ef4444',
        bg: 'linear-gradient(135deg, #080303 0%, #0a0404 100%)',
        borderColor: '#1a0808',
        bullets: ['CRIT / WARN / INFO', 'One-click highlight', 'AWS Well-Architected'],
        visual: <SecurityMockup />,
    },
    {
        tag: 'AWS Service Library',
        tagIcon: <Layers size={10} />,
        title: '30+ AWS Services Ready',
        description:
            'From EC2 to Lambda, RDS to DynamoDB — every major AWS service comes pre-configured with sensible defaults, cost data, and security rules baked in.',
        accent: '#3b82f6',
        bg: 'linear-gradient(135deg, #030508 0%, #04060a 100%)',
        borderColor: '#090d1a',
        bullets: ['Compute', 'Storage', 'Networking', 'Security', 'Analytics'],
        visual: <LibraryMockup />,
    },
    {
        tag: 'IaC Integration',
        tagIcon: <Terminal size={10} />,
        title: 'Export to Infrastructure-as-Code',
        description:
            'Every visual decision is machine-readable. Export your entire architecture as structured JSON, ready to seed Terraform modules or CloudFormation templates.',
        accent: '#a855f7',
        bg: 'linear-gradient(135deg, #050308 0%, #06040a 100%)',
        borderColor: '#110818',
        bullets: ['JSON export', 'PNG snapshot', 'Import / restore'],
        visual: <ExportMockup />,
    },
];

// ─── How It Works Step ────────────────────────────────────────────────────────
function HowItWorksStep({ number, title, description, icon, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center group"
        >
            <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#0f0f0f] border border-[#222] flex items-center justify-center group-hover:border-[#FF5C00]/40 transition-colors duration-300">
                    <span className="text-[#FF5C00]">{icon}</span>
                </div>
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#FF5C00] flex items-center justify-center text-black text-xs font-black">
                    {number}
                </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
            <p className="text-sm text-[#555] leading-relaxed max-w-[220px]">{description}</p>
        </motion.div>
    );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function Landing({ onLaunch, onSignIn, isAuthenticated, user }) {
    const scrollStackRef = useRef(null);
    const [authOpen, setAuthOpen] = useState(false);

    const { scrollYProgress } = useScroll({
        target: scrollStackRef,
        offset: ['start start', 'end end'],
    });

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        return () => {
            lenis.destroy();
        };
    }, []);

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 20,
        restDelta: 0.001
    });

    const handleSignIn = () => {
        if (onSignIn) onSignIn();
        else setAuthOpen(true);
    };

    return (
        <div className="bg-[#000] text-[#EDEDED] selection:bg-[#FF5C00]/30 selection:text-[#FF5C00]">

            {/* ── Floating Nav ──────────────────────────────────────── */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-0 sm:px-6 pt-0 sm:pt-5 pointer-events-none">
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-auto flex items-center justify-between w-full max-w-3xl px-4 py-2.5 sm:rounded-full bg-[#0A0A0A]/40 backdrop-blur-2xl border-b sm:border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                >
                    {/* Brand */}
                    <div className="flex items-center gap-2 w-auto min-w-[140px]">
                        <img
                            src="/InfraSketch.png"
                            alt="InfraSketch Logo"
                            className="w-8 h-8 object-contain rounded-md"
                        />

                        <span className="font-extrabold text-[16px] text-white tracking-tight">
                            InfraSketch
                        </span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center justify-center flex-1 gap-8">
                        {['Features', 'How it works'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(item.toLowerCase().replace(/\s+/g, '-'))?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-[15px] text-[#888] hover:text-white transition-colors font-semibold tracking-wide whitespace-nowrap"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Auth */}
                    <div className="flex items-center justify-end gap-5 w-auto min-w-[140px]">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-white/10">
                                <div className="hidden sm:block text-[14px] text-[#888] font-medium">{user?.name || 'User'}</div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF8533] to-[#FF5C00] flex items-center justify-center text-[14px] font-bold text-black border border-[#FF5C00]/50 shadow-inner">
                                    {(user?.name || 'U')[0].toUpperCase()}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleSignIn}
                                className="flex items-center gap-2 text-[14px] font-semibold text-[#aaa] hover:text-white transition-all whitespace-nowrap"
                            >
                                <LogIn size={16} />
                                Sign In
                            </button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onLaunch}
                            className="px-5 py-2 bg-[#FF5C00] text-black font-bold text-[14px] whitespace-nowrap rounded-xl shadow-[0_0_20px_-5px_#FF5C00] hover:bg-[#ff7a2a] transition-colors"
                        >
                            Launch →
                        </motion.button>
                    </div>
                </motion.nav>
            </div>

            {/* ── Hero Section ──────────────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-32">
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                    <DotField
                        dotRadius={1.5}
                        dotSpacing={16}
                        bulgeStrength={50}
                        glowRadius={180}
                        sparkle={true}
                        waveAmplitude={2}
                        gradientFrom="#FF5C00"
                        gradientTo="#ffb27f"
                        glowColor="rgba(255,92,0,0.15)"
                    />
                </div>
                <div className="absolute inset-0 z-0 opacity-70">
                    <Galaxy density={1.2} glowIntensity={0.3} hueShift={20} starSpeed={0.5} transparent={true} />
                </div>
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
                    }}
                />

                {/* Animated Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block" style={{ opacity: 0.6 }}>
                    {/* API Gateway to Center */}
                    <motion.line
                        x1="10%" y1="16%" x2="50%" y2="50%"
                        stroke="#FF5C00"
                        strokeWidth="1.5"
                        strokeDasharray="4 6"
                        fill="none"
                        initial={{ strokeDashoffset: 0, opacity: 0 }}
                        animate={{ strokeDashoffset: -20, opacity: 1 }}
                        transition={{
                            opacity: { duration: 1, delay: 0.2 },
                            strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" }
                        }}
                    />
                    {/* Center to WAF */}
                    <motion.line
                        x1="50%" y1="50%" x2="90%" y2="38%"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        strokeDasharray="4 6"
                        fill="none"
                        initial={{ strokeDashoffset: 0, opacity: 0 }}
                        animate={{ strokeDashoffset: -20, opacity: 1 }}
                        transition={{
                            opacity: { duration: 1, delay: 0.8 },
                            strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" }
                        }}
                    />
                    {/* Center to DB */}
                    <motion.line
                        x1="50%" y1="50%" x2="92%" y2="70%"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        strokeDasharray="4 6"
                        fill="none"
                        initial={{ strokeDashoffset: 0, opacity: 0 }}
                        animate={{ strokeDashoffset: -20, opacity: 1 }}
                        transition={{
                            opacity: { duration: 1, delay: 1.4 },
                            strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" }
                        }}
                    />
                    {/* Central Animated Router Node */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: 'spring', delay: 2 }}
                    >
                        <circle cx="50%" cy="50%" r="6" fill="#FF5C00" />
                        <circle cx="50%" cy="50%" r="14" fill="none" stroke="#FF5C00" strokeWidth="1" opacity="0.4" />
                    </motion.g>
                </svg>

                {/* Floating service badges */}
                <motion.div
                    animate={{ y: [-8, 8, -8], rotate: [-1, 1, -1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[12%] left-[6%] z-10 hidden md:flex bg-[#0A0A0A]/90 backdrop-blur-md border border-[#1c1c1c] p-3.5 rounded-2xl shadow-2xl items-center gap-3"
                >
                    <div className="bg-[#FF5C00]/10 p-2 rounded-xl border border-[#FF5C00]/20">
                        <Server className="text-[#FF5C00] w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">API Gateway</div>
                        <div className="text-[10px] text-[#444] font-mono">us-east-1 • Active</div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [10, -10, 10], rotate: [1.5, -1.5, 1.5] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-[28%] right-[6%] z-10 hidden md:flex bg-[#0A0A0A]/90 backdrop-blur-md border border-[#1c1c1c] p-3.5 rounded-2xl shadow-2xl items-center gap-3"
                >
                    <div className="bg-[#22c55e]/10 p-2 rounded-xl border border-[#22c55e]/20">
                        <Database className="text-[#22c55e] w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">Production DB</div>
                        <div className="text-[10px] text-[#444] font-mono">Aurora • $312/mo</div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [6, -6, 6], rotate: [-1, 1, -1] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute top-[35%] right-[8%] z-10 hidden lg:flex bg-[#0A0A0A]/90 backdrop-blur-md border border-[#1c1c1c] p-3.5 rounded-2xl shadow-2xl items-center gap-3"
                >
                    <div className="bg-[#ef4444]/10 p-2 rounded-xl border border-[#ef4444]/20">
                        <Shield className="text-[#ef4444] w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">WAF Active</div>
                        <div className="text-[10px] text-[#444] font-mono">0 threats detected</div>
                    </div>
                </motion.div>

                <div className="relative w-full max-w-6xl mx-auto px-6 z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ y: 40, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        

                        <h1 className="text-5xl sm:text-7xl md:text-[6rem] lg:text-[7.5rem] font-black text-white tracking-[-0.03em] leading-[1.02]">
                            Stop Guessing<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C00] via-[#FF8533] to-[#FFB07A] pb-2 inline-block">
                                Your Cloud Bill.
                            </span>
                        </h1>

                        <p className="mt-8 text-lg md:text-xl text-[#555] max-w-2xl mx-auto leading-relaxed font-medium px-4">
                            The visual architecture designer for engineers obsessed with scale. Drag, drop, and calculate real-time AWS burn rates before writing a single line of IaC.
                        </p>

                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={onLaunch}
                                className="group relative px-10 py-4 bg-[#FF5C00] text-black font-bold text-sm tracking-wide rounded-xl overflow-hidden flex items-center gap-2 shadow-[0_0_50px_-12px_#FF5C00] w-full sm:w-auto justify-center"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative z-10 flex items-center gap-2">
                                    Launch Workspace
                                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={handleSignIn}
                                className="px-10 py-4 bg-transparent border border-[#222] hover:border-[#333] text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                <LogIn size={14} />
                                {isAuthenticated ? `Hi, ${(user?.name || 'User').split(' ')[0]}` : 'Sign In Free'}
                            </motion.button>
                        </div>


                    </motion.div>
                </div>
            </section>

            {/* ── Marquee Strip ─────────────────────────────────────── */}
            <div className="border-y border-[#111] bg-[#040404] py-5 overflow-hidden flex relative z-10">
                <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
                    className="flex whitespace-nowrap items-center gap-16 px-8 text-[#333] font-mono text-[10px] uppercase tracking-widest"
                >
                    {[
                        'Powered by React Flow', 'AWS Architecture Native', 'Real-time Cost Engine',
                        'Security Linting', '30+ AWS Services', 'JSON IaC Export', 'PNG Diagram Export', 'Zustand State',
                        'Powered by React Flow', 'AWS Architecture Native', 'Real-time Cost Engine',
                        'Security Linting', '30+ AWS Services', 'JSON IaC Export', 'PNG Diagram Export', 'Zustand State',
                    ].map((text, i) => (
                        <React.Fragment key={i}>
                            <span>{text}</span>
                            <span className="w-1 h-1 rounded-full bg-[#FF5C00]/40 flex-shrink-0" />
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* ── Scroll Stack Section ───────────────────────────────── */}
            <section id="features" ref={scrollStackRef} className="relative bg-[#000]" style={{ height: `${(FEATURE_CARDS.length + 1.5) * 100}vh` }}>
                <div className="sticky top-0 h-screen overflow-hidden">
                    {/* Side progress dots */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
                        {FEATURE_CARDS.map((_, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    opacity: useTransform(
                                        scrollYProgress,
                                        [
                                            Math.max(0, i / FEATURE_CARDS.length - 0.05),
                                            i / FEATURE_CARDS.length,
                                            Math.min(1, (i + 1) / FEATURE_CARDS.length),
                                        ],
                                        [0.15, 1, 0.3]
                                    ),
                                    scaleX: useTransform(
                                        scrollYProgress,
                                        [
                                            Math.max(0, i / FEATURE_CARDS.length - 0.05),
                                            i / FEATURE_CARDS.length,
                                        ],
                                        [0.4, 1]
                                    ),
                                }}
                                className="h-1 w-6 bg-[#FF5C00] rounded-full origin-left"
                            />
                        ))}
                    </div>

                    {FEATURE_CARDS.map((card, i) => (
                        <ScrollStackCard
                            key={i}
                            card={card}
                            index={i}
                            total={FEATURE_CARDS.length}
                            scrollYProgress={smoothProgress}
                        />
                    ))}
                </div>
            </section>

            {/* ── Stats Bar ─────────────────────────────────────────── */}
            <section className="bg-[#000] border-y border-[#111] py-20 relative z-10">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-[#111]">
                    {[
                        { value: '30+', label: 'AWS Services', sub: 'Compute, Storage, DB & more', accent: true },
                        { value: '10x', label: 'Faster Planning', sub: 'vs manual diagram tools', accent: false },
                        { value: '~0ms', label: 'Cost Latency', sub: 'Real-time calculation', accent: false },
                        { value: '100%', label: 'Browser Native', sub: 'No installs required', accent: false },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="text-center px-8"
                        >
                            <div
                                className="text-4xl md:text-5xl font-black tracking-tighter mb-2"
                                style={{ color: stat.accent ? '#FF5C00' : 'white' }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-sm font-semibold text-white/70 mb-1">{stat.label}</div>
                            <div className="text-xs text-[#333] font-mono">{stat.sub}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ──────────────────────────────────────── */}
            <section id="how-it-works" className="bg-[#000] py-32 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1c1c1c] bg-[#0f0f0f] text-[10px] font-mono text-[#555] uppercase tracking-widest mb-6">
                            <Zap size={10} className="text-[#FF5C00]" /> How It Works
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Three steps to production-ready architecture.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
                        <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#FF5C00]/25 to-transparent" />
                        <HowItWorksStep
                            number="1" delay={0}
                            icon={<MousePointer size={20} />}
                            title="Design Visually"
                            description="Drag AWS services from the palette onto the canvas. Connect them to define your architecture topology."
                        />
                        <HowItWorksStep
                            number="2" delay={0.15}
                            icon={<Activity size={20} />}
                            title="Analyze in Real-Time"
                            description="Cost estimates update instantly. The security linter flags misconfigurations as you build."
                        />
                        <HowItWorksStep
                            number="3" delay={0.3}
                            icon={<Terminal size={20} />}
                            title="Export & Deploy"
                            description="Download your architecture as structured JSON or PNG. Feed it into your IaC pipeline."
                        />
                    </div>
                </div>
            </section>

            {/* ── Bento Grid ────────────────────────────────────────── */}
            <section className="bg-[#000] border-t border-[#111] py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mb-16 text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Precision Engineered.</h2>
                        <p className="text-[#444] text-lg font-medium">Every feature built for infrastructure architects.</p>
                    </motion.div>

                    {/* Row 1: Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        {[
                            { icon: <Layers className="w-5 h-5 text-[#FF5C00]" />, title: '30+ AWS Services', sub: 'Pre-configured with pricing data, security rules & defaults', accent: '#FF5C00' },
                            { icon: <Shield className="w-5 h-5 text-[#ef4444]" />, title: 'Security Rules Engine', sub: 'Catches public subnets, missing encryption, IAM over-permissions', accent: '#ef4444' },
                            { icon: <TrendingDown className="w-5 h-5 text-[#22c55e]" />, title: 'Zero Surprise Bills', sub: 'Real-time cost from individual service pricing matrices', accent: '#22c55e' },
                        ].map((card, i) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <SpotlightCard className="p-7 h-full group">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-[#111] border border-[#1c1c1c] flex items-center justify-center mb-5 group-hover:border-[#2a2a2a] transition-colors"
                                        style={{ boxShadow: `0 0 20px ${card.accent}10` }}
                                    >
                                        {card.icon}
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-2">{card.title}</h4>
                                    <p className="text-xs text-[#444] leading-relaxed font-mono">{card.sub}</p>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <SpotlightCard className="p-10 flex flex-col justify-center items-center text-center group" style={{ minHeight: 240 }}>
                            <div className="relative w-16 h-16 mb-6">
                                <div className="absolute inset-0 bg-[#FF5C00]/15 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-full h-full rounded-full bg-[#111] border border-[#1c1c1c] group-hover:border-[#FF5C00]/30 transition-colors flex items-center justify-center">
                                    <Activity className="w-7 h-7 text-[#444] group-hover:text-[#FF5C00] transition-colors" />
                                </div>
                            </div>
                            <h4 className="text-base font-bold text-white mb-2">Live Canvas Sync</h4>
                            <p className="text-xs text-[#444] font-mono leading-relaxed">React Flow state synced across all property updates.</p>
                        </SpotlightCard>

                        <SpotlightCard className="md:col-span-2 p-10 flex flex-col justify-between group overflow-hidden" style={{ minHeight: 240 }}>
                            <div className="z-10">
                                <Palette className="w-7 h-7 text-[#FF5C00] mb-5" />
                                <h4 className="text-2xl font-bold text-white mb-2">Vast Component Palette</h4>
                                <p className="text-[#444] text-sm">Drag dozens of pre-configured AWS services. Every category covered.</p>
                            </div>
                            <div
                                className="absolute bottom-8 left-0 right-0 overflow-hidden whitespace-nowrap opacity-20 group-hover:opacity-70 transition-opacity duration-500 px-10"
                                style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
                            >
                                <motion.div
                                    animate={{ x: ['0%', '-50%'] }}
                                    transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
                                    className="flex gap-10 items-center"
                                >
                                    {[Server, Database, HardDrive, Cloud, Shield, Activity, Layers, Server, Database, HardDrive, Cloud, Shield, Activity, Layers].map((Icon, i) => (
                                        <Icon key={i} size={40} className="text-[#333]" />
                                    ))}
                                </motion.div>
                            </div>
                        </SpotlightCard>
                    </div>

                    {/* Row 3: Export Terminal */}
                    <SpotlightCard className="p-0 flex flex-col md:flex-row group overflow-hidden">
                        <div className="p-10 md:p-12 flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#1c1c1c] z-10 bg-[#0A0A0A]">
                            <Terminal className="w-7 h-7 text-[#FF5C00] mb-5" />
                            <h4 className="text-2xl font-bold text-white mb-3">Export JSON Architecture State</h4>
                            <p className="text-[#444] text-sm leading-relaxed">
                                Instantly export your visual diagram as a structured JSON graph, ready to feed CI/CD pipelines or get converted to Terraform & CloudFormation templates.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onLaunch}
                                className="mt-6 w-max flex items-center gap-2 text-xs font-bold text-[#FF5C00] border border-[#FF5C00]/20 hover:border-[#FF5C00]/50 bg-[#FF5C00]/5 hover:bg-[#FF5C00]/10 px-4 py-2 rounded-lg transition-all"
                            >
                                Try it in the canvas <ArrowRight size={12} />
                            </motion.button>
                        </div>
                        <div className="flex-1 bg-[#050505] p-8 md:p-10 font-mono text-xs text-[#333] flex flex-col justify-center relative">
                            <div className="absolute top-4 left-5 flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c] group-hover:bg-red-500/40 transition-colors" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c] group-hover:bg-yellow-500/40 transition-colors" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c] group-hover:bg-green-500/40 transition-colors" />
                                <span className="ml-2 text-[10px] text-[#222]">infrasketch.json</span>
                            </div>
                            <pre className="mt-6 group-hover:text-[#777] transition-colors duration-500 overflow-x-auto leading-relaxed">
                                {`{
  "version": "1.0.0",
  "name": "Production_Infra_v2",
  "nodes": [
    {
      "id": "vpc-01",
      "type": "aws_vpc",
      "cidr": "10.0.0.0/16"
    },
    {
      "id": "ec2-xyz",
      "type": "aws_ec2",
      "props": {
        "instance": "t3.large",
        "count": 4
      }
    }
  ]
}`}
                            </pre>
                        </div>
                    </SpotlightCard>
                </div>
            </section>

            {/* ── Final CTA ─────────────────────────────────────────── */}
            <footer className="relative bg-[#000] border-t border-[#111] min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden py-32">
                <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF5C00] opacity-[0.06] blur-[160px] pointer-events-none rounded-full" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5C00]/20 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-5xl mx-auto px-6 space-y-10 w-full"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1c1c1c] bg-[#0f0f0f] text-[10px] font-mono text-[#444] uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
                        Free to use. No account required.
                    </div>

                    <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.03em] text-white leading-[0.95]">
                        Design AWS.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#4c4c4c] to-[#1c1c1c]">
                            Predict the Bill.
                        </span>
                    </h2>

                    <p className="text-[#444] text-lg max-w-xl mx-auto font-medium">
                        Start designing your AWS infrastructure visually in seconds. No installs, no setup, no limits.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={onLaunch}
                            className="px-12 py-5 bg-[#FF5C00] text-black font-black text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto min-w-[240px] shadow-[0_0_60px_-10px_#FF5C00] hover:bg-[#ff7a2a] transition-colors"
                        >
                            Start Sketching Now <ChevronRight size={15} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleSignIn}
                            className="px-8 py-5 border border-[#1c1c1c] hover:border-[#2a2a2a] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-white/[0.02] transition-all"
                        >
                            <LogIn size={14} />
                            {isAuthenticated ? 'Manage Account' : 'Sign In to Save Diagrams'}
                        </motion.button>
                    </div>
                </motion.div>

                <div className="absolute bottom-8 text-[10px] text-[#222] font-mono uppercase tracking-widest px-4 text-center">
                    © 2026 InfraSketch — Engineered for cloud architects.
                </div>
            </footer>

            {/* ── Auth Modal (local fallback) ────────────────────────── */}
            <AnimatePresence>
                {authOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setAuthOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AuthModal onClose={() => setAuthOpen(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}