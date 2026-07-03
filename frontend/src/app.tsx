import { useState, useEffect } from 'preact/hooks';
import { LANGUAGES, type Language } from './utils/language';
import { Navbar } from './components/Navbar';
import { IDE } from './components/Ide';
import axios from 'axios';
import { pollBackend } from './utils/pollBackend';

export function App() {
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState(selectedLang.codeTemplate)
  const [output, setOutput] = useState<any>(null)

  useEffect(() => {
    setCode(selectedLang.codeTemplate)
  }, [selectedLang])

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    setIsDropdownOpen(false);
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true)
      setOutput(null)
      console.log({
        lang: selectedLang.id,
        code: code,
      })

      const response = await axios.post("http://localhost:8080/api/code/submit", {
        language: selectedLang.id,
        code: code,
      })

      console.log("Running output", response.data);

      pollBackend(response.data.id, setOutput)

    } catch (error) {
      console.error("Failed to run code:", error)
    } finally {
      setIsRunning(false)
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isDropdownOpen && !(e.target as HTMLElement).closest('.lang-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isDropdownOpen]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Banner Navigation */}
      <Navbar />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-h-[calc(100vh-3.5rem)]">
        {/* Left Side: Mock IDE Editor Panel */}
        <section className="w-full lg:w-[55%] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-900 bg-slate-950 overflow-hidden">
          {/* Top Panel Controls */}
          <div className="h-12 border-b border-slate-900 px-4 bg-slate-950/80 flex items-center justify-between gap-4 select-none">
            {/* Custom Dropdown Selector */}
            <div className="relative lang-dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-750 bg-slate-900 text-sm font-medium transition-all text-slate-200 hover:text-white"
              >
                <span className={`w-2 h-2 rounded-full ${selectedLang.iconColor.replace('text-', 'bg-')}`}></span>
                {selectedLang.name}
                <svg className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden z-50 backdrop-blur-md py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-800 transition-colors ${selectedLang.id === lang.id ? 'text-indigo-400 bg-slate-800/40 font-medium' : 'text-slate-300'
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${lang.iconColor.replace('text-', 'bg-')}`}></span>
                        {lang.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">.{lang.extension.split('.')[1]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Run & Action Button Group */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="relative group px-4 py-1.5 rounded-lg text-sm font-semibold text-white overflow-hidden shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-transform group-hover:scale-105"></div>
                <span className="relative flex items-center gap-1.5">
                  {isRunning ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Run Code
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* IDE Placeholder Workspace */}
          <div className="flex-1 flex flex-col min-h-[350px] lg:min-h-0 bg-slate-950 overflow-hidden relative">

            <IDE code={code} updateCode={setCode} />
          </div>
        </section>

        {/* Right Side: Output Terminal / Logs */}
        <section className="w-full lg:w-[45%] flex flex-col bg-slate-950 overflow-hidden">
          {/* Top Panel Terminal Header */}
          <div className="h-12 border-b border-slate-900 bg-slate-950 px-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-450 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                Output
              </span>
            </div>

          </div>

          {/* Terminal Screen Body */}
          <div className="flex-1 bg-black p-4 font-mono text-sm leading-relaxed overflow-auto relative min-h-[250px] lg:min-h-0 flex flex-col justify-between">
            <div className="relative flex-1">
              {/* Running Spinner Overlay */}
              {(!output || isRunning) && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-slate-400 z-10">
                  <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="text-xs uppercase tracking-widest text-slate-500 font-bold animate-pulse">
                    Compiling & Executing Code...
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-900/60 pb-1.5 mb-2 select-none">
                  <span>Standard Console Output</span>
                </div>
                <pre className="whitespace-pre-wrap select-text font-mono leading-relaxed text-emerald-400/90">
                  {output?.stdout ? output.stdout : output?.stderr}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}