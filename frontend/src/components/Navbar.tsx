export function Navbar() {
    return (
        <header className="h-14 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <span className="font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-100 to-slate-400">
                        OneCompiler
                    </span>
                    <span className="ml-1.5 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                        v1.0
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 border border-slate-800/85 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Cloud Sandbox Active
                </div>
            </div>
        </header>
    )
}