import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicDiagram } from '../api/diagramsApi';
import useDiagramStore from '../hooks/useDiagramStore';
import DesignerCanvas from '../components/canvas/DesignerCanvas';
import { Maximize, Minimize } from 'lucide-react';

export default function PublicView() {
    const { id } = useParams();

    const loadDiagram = useDiagramStore((s) => s.loadDiagram);
    const setViewMode = useDiagramStore((s) => s.setViewMode);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const fetchDiagram = async () => {
            try {
                const data = await getPublicDiagram(id);
                loadDiagram(data);
                setViewMode(true);
                useDiagramStore.getState().setPublicView(true);
            } catch (err) {
                console.error("Failed to load public diagram");
                if (err.response?.status === 404) {
                    setError("This diagram is private or no longer available.");
                } else {
                    setError("Something went wrong while loading the diagram.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDiagram();
    }, [id, loadDiagram, setViewMode]);

    // Listen for fullscreen changes (e.g., if the user presses ESC)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Proper toggle logic
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error enabling fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };
    
    if (error) {
    return (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white text-center px-6">
            <h1 className="text-2xl font-bold text-[#FF5C00] mb-2">
                Diagram Unavailable
            </h1>
            <p className="text-white/70 mb-4">{error}</p>

            <button
                onClick={() => window.location.href = "/"}
                className="px-4 py-2 bg-[#FF5C00] text-black rounded-lg text-sm font-semibold hover:bg-[#ff7a2a]"
            >
                Go Home
            </button>
        </div>
    );
}

    if (loading) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center text-white text-sm font-mono">
                Loading shared diagram...
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#050505] relative overflow-hidden">
            {/* Fullscreen Toggle Button */}
            <button
                onClick={toggleFullscreen}
                className="fixed top-4 right-4 z-[9999] px-4 py-2 bg-[#FF5C00] hover:bg-[#ff7a2a] text-black rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(255,92,0,0.3)] transition-colors flex items-center gap-2"
            >
                {isFullscreen ? (
                    <>
                        <Minimize size={16} /> Exit Fullscreen
                    </>
                ) : (
                    <>
                        <Maximize size={16} /> Fullscreen
                    </>
                )}
            </button>

            {/* Read-Only Badge */}
            <div className="fixed top-4 left-4 z-[9999] text-xs font-bold uppercase tracking-widest text-[#FF5C00] bg-[#FF5C00]/10 border border-[#FF5C00]/20 px-4 py-2 rounded-lg backdrop-blur-md">
                Public View
            </div>

            <DesignerCanvas />
        </div>
    );
}