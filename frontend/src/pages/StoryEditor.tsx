import React, { useState } from 'react';

import { Send, Settings, ChevronDown, SlidersHorizontal, Clock, Menu, FileText, User, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data (Same as before)
const MOCK_SEGMENTS = [
    { id: '1', author: 'ai', content: "The clock struck thirteen, sending a shiver through the crowded ballroom. It wasn't the sound itself, but the silence that followed.", imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000" },
    { id: '2', author: 'user', content: "Detective Miller adjusted his tie, his eyes scanning the room. 'Nobody panic,' he lied, his hand drifting to his revolver.", imageUrl: null },
];

const MOCK_HISTORY = [
    { id: '101', title: 'The 13th Hour', genre: 'Mystery', date: '2 hours ago' },
    { id: '102', title: 'Cyberpunk Dreams', genre: 'Sci-Fi', date: 'Yesterday' },
    { id: '103', title: 'The Lost Kingdom', genre: 'Fantasy', date: '3 days ago' },
    { id: '104', title: 'Neon Nights', genre: 'Cyberpunk', date: '4 days ago' },
    { id: '105', title: 'Whispers in the Dark', genre: 'Horror', date: '1 week ago' },
    { id: '106', title: 'Stellar Voyage', genre: 'Sci-Fi', date: '2 weeks ago' },
];

const StoryEditor: React.FC = () => {
    // const { id } = useParams(); // Unused for now
    const [segments, setSegments] = useState(MOCK_SEGMENTS);
    const [draftSegments, setDraftSegments] = useState(MOCK_SEGMENTS);
    const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);

    const [inputText, setInputText] = useState('');
    const [controlsOpen, setControlsOpen] = useState(false); // Collapsed by default
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [controls, setControls] = useState({ pace: 50, detail: 75, tone: 60 });

    const handleSend = () => {
        if (!inputText.trim()) return;
        const newSegment = { id: Date.now().toString(), author: 'user', content: inputText, imageUrl: null };

        // If we are viewing history, switching to draft implies we should probably append to draft?
        // For simplicity, let's force return to Active Draft if user sends a message, or just update the current view.
        // Assuming user acts on the active draft:
        if (viewingHistoryId) {
            // If viewing history, prevent editing or switch back?
            // Let's simplified: If sending, we assume we are adding to the *viewed* story (if we supported separate chats)
            // or we just force switch back. User asked to "add current story to memory".
            // Let's just update the state.
        }

        const updatedSegments = [...(viewingHistoryId ? segments : draftSegments), newSegment as any];

        setSegments(updatedSegments);
        if (!viewingHistoryId) {
            setDraftSegments(updatedSegments);
        }

        setInputText('');
        // Mock AI response
        setTimeout(() => {
            setSegments(prev => [...prev, { id: 'ai-' + Date.now(), author: 'ai', content: "...", imageUrl: null }]);
            if (!viewingHistoryId) {
                setDraftSegments(prev => [...prev, { id: 'ai-' + Date.now(), author: 'ai', content: "...", imageUrl: null }]);
            }
        }, 1000);
    };

    const handleLoadStory = (story: { id: string, title: string }) => {
        // If currently viewing active draft, save it (already synced via draftSegments state, but good to be sure)
        if (!viewingHistoryId) {
            setDraftSegments(segments);
        }

        setViewingHistoryId(story.id);

        // Mock loading a previous story state
        setSegments([
            { id: '1', author: 'ai', content: `(Loaded story: ${story.title}) The archives were dusty, but the answer was here somewhere...`, imageUrl: null },
            { id: '2', author: 'user', content: "I began to search the shelves.", imageUrl: null }
        ]);

        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    const handleReturnToCurrent = () => {
        setViewingHistoryId(null);
        setSegments(draftSegments);
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }

    return (
        <div className="relative h-[calc(100vh-4rem)] flex overflow-hidden bg-background">

            {/* Sidebar - History */}
            <motion.div
                initial={{ width: 280 }}
                animate={{ width: sidebarOpen ? 280 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex flex-col border-r border-border bg-card/50 backdrop-blur overflow-hidden whitespace-nowrap"
            >
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Deep Lore Memories
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {/* Current Story Item */}
                    <div
                        onClick={handleReturnToCurrent}
                        className={`p-3 rounded-lg cursor-pointer transition-colors group ${!viewingHistoryId ? 'bg-primary/20 hover:bg-primary/30' : 'hover:bg-muted/50'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md ${!viewingHistoryId ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                                <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-medium text-sm text-foreground truncate">Current Story</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                    <span className="text-primary italic">Editing Now</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {MOCK_HISTORY.map((story) => (
                        <div key={story.id} onClick={() => handleLoadStory(story)} className={`p-3 rounded-lg cursor-pointer transition-colors group ${viewingHistoryId === story.id ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md text-primary">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-medium text-sm text-foreground truncate">{story.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span>{story.genre}</span>
                                        <span>•</span>
                                        <span>{story.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Sidebar Toggle Button (Mobile/Desktop) */}
            <div className={`absolute top-4 left-4 z-40 md:hidden`}>
                <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Menu className="w-4 h-4" />
                </Button>
            </div>


            <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">

                {/* Top Right Controls Overlay (Absolute on Desktop, Drawer on Mobile) */}
                <AnimatePresence>
                    {controlsOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute top-4 right-4 z-40 w-80 bg-popover border border-border rounded-xl shadow-xl p-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Controls
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => setControlsOpen(false)}>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Image Preview - REMOVED from controls, moving to stream */}
                                {/* <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                                {segments[0].imageUrl ? (
                                    <img src={segments[0].imageUrl} className="w-full h-full object-cover" alt="Scene" />
                                ) : (
                                    <div className="flex items-center justify-center h-full"><ImageIcon className="text-muted-foreground" /></div>
                                )}
                            </div> */}

                                <div className="space-y-4">
                                    <Slider label="Pacing" value={controls.pace} onChange={(e) => setControls({ ...controls, pace: +e.target.value })} />
                                    <Slider label="Detail Level" value={controls.detail} onChange={(e) => setControls({ ...controls, detail: +e.target.value })} />
                                    <Slider label="Tone" value={controls.tone} onChange={(e) => setControls({ ...controls, tone: +e.target.value })} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col h-full relative">

                    {/* Editor Header / Toolbar */}
                    <div className="h-14 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-30 w-full">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hidden md:flex p-1 h-8 w-8"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <Menu className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold text-foreground">The 13th Hour</span>
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">Mystery</span>
                        </div>
                        <Button
                            variant={controlsOpen ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setControlsOpen(!controlsOpen)}
                            className="gap-2"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Button>
                    </div>

                    {/* Story Stream */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth">
                        {segments.map((seg) => (
                            <motion.div
                                key={seg.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`flex ${seg.author === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end gap-3 max-w-[90%] sm:max-w-[75%] ${seg.author === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${seg.author === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {seg.author === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                    </div>

                                    <div className={`space-y-2 ${seg.author === 'user' ? 'items-end flex flex-col' : ''}`}>
                                        {/* Image Display */}
                                        {seg.imageUrl && (
                                            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-border">
                                                <img src={seg.imageUrl} alt="Story segment visualization" className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        <div className={`p-4 rounded-2xl text-base sm:text-lg leading-relaxed shadow-sm ${seg.author === 'user'
                                            ? 'bg-primary/90 text-primary-foreground rounded-tr-sm dark:bg-primary'
                                            : 'bg-card text-card-foreground border border-border rounded-tl-sm'
                                            }`}>
                                            {seg.content}
                                        </div>
                                        <span className="text-xs text-muted-foreground px-1 capitalize">{seg.author}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 sm:p-6 bg-background border-t border-border">
                        <div className="relative max-w-4xl mx-auto">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type to continue the story..."
                                className="w-full min-h-[5rem] max-h-[12rem] p-4 pr-14 rounded-xl border border-input bg-card text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                            />
                            <div className="absolute bottom-4 right-3">
                                <Button
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-lg"
                                    onClick={handleSend}
                                    disabled={!inputText.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-center mt-2 text-xs text-muted-foreground">
                            AI adapts to your style. Cmd+Enter to send.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryEditor;
