import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const BLOCKED_PATTERNS = [
  /^\s*rm\s+(-[a-z]*f[a-z]*|-[a-z]*r[a-z]*)\s+.*\/\s*$/i,
  /^\s*rm\s+(-rf|-fr|--recursive)\s+\/\b/i,
  /^\s*:()\s*\{.*\};:/,
  /^\s*mkfs/i,
  /^\s*dd\s+.*of=\/dev\//i,
  /^\s*>\s*\/dev\/(sda|hda|vda|nvme)/i,
  /^\s*fdisk\s/i,
  /^\s*parted\s/i,
  /^\s*shred\s/i,
  /^\s*wipefs\s/i,
];

const ALLOWED_COMMANDS = new Set([
  "ssh", "curl", "wget", "chmod", "ls", "pwd", "cat", "echo",
  "sed", "dos2unix", "bash", "sh", "exit", "sudo", "apt", "apt-get",
  "yum", "dnf", "systemctl", "service", "java", "which", "uname",
  "hostname", "whoami", "ping", "mkdir", "cd", "cp", "mv",
  "tar", "unzip", "zip", "nano", "vim", "vi", "less", "more",
  "grep", "awk", "ps", "top", "df", "du", "free", "id",
  "env", "export", "source", "./install-script.sh", "install-script.sh",
]);

function isCommandAllowed(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }
  const rootCmd = trimmed.split(/\s+/)[0].replace(/^.*\//, "");
  return ALLOWED_COMMANDS.has(rootCmd);
}

const WebTerminal = forwardRef(({ serverId }, ref) => {
  const terminalRef = useRef(null);
  const terminalInstanceRef = useRef(null);
  const socketRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [command, setCommand] = useState("");
  const [reconnectKey, setReconnectKey] = useState(0);
  const [cmdError, setCmdError] = useState("");
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const socketUrl = useMemo(() => {
    const token = localStorage.getItem("token");
    const base = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
    const url = new URL("/ws/terminal", base.replace(/^http/, "ws"));
    if (token) url.searchParams.set("token", token);
    return url.toString();
  }, []);

  const sendRaw = useCallback((rawCommand) => {
    const socket = socketRef.current;
    const term = terminalInstanceRef.current;
    if (!rawCommand?.trim()) return false;
    if (!isCommandAllowed(rawCommand)) {
      term?.writeln(`\r\n\x1b[31m✖ Command blocked: "${rawCommand.trim()}" is not permitted in this restricted shell.\x1b[0m\r\n`);
      return false;
    }
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(rawCommand.endsWith("\n") ? rawCommand : `${rawCommand}\n`);
      return true;
    }
    term?.writeln("\r\n\x1b[33mUnable to send — WebSocket not connected.\x1b[0m\r\n");
    return false;
  }, []);

  const reconnect = useCallback(() => {
    setStatus("connecting");
    setReconnectKey((k) => k + 1);
  }, []);

  useImperativeHandle(ref, () => ({
    sendCommand: sendRaw,
    reconnect,
    focus: () => terminalInstanceRef.current?.focus(),
  }), [reconnect, sendRaw]);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      theme: {
        background: "#020617",
        foreground: "#e2e8f0",
        cursor: "#60a5fa",
        selectionBackground: "#1e40af55",
        black: "#1e293b",
        red: "#f87171",
        green: "#4ade80",
        yellow: "#facc15",
        blue: "#60a5fa",
        magenta: "#c084fc",
        cyan: "#22d3ee",
        white: "#e2e8f0",
        brightBlack: "#475569",
        brightGreen: "#86efac",
      },
    });
    terminalInstanceRef.current = term;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    term.focus();

    term.writeln("\x1b[36mWSMS Restricted Terminal\x1b[0m");
    term.writeln(`\x1b[90mServer ID: ${serverId || "N/A"}\x1b[0m`);
    term.writeln("\x1b[90mConnecting...\x1b[0m\r\n");

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("connected");
      socket.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
      term.writeln("\x1b[32m✔ Connected.\x1b[0m Type commands below or use the input bar.\r\n");
    };

    socket.onmessage = (e) => term.write(e.data);

    socket.onerror = () => {
      setStatus("error");
      term.writeln("\r\n\x1b[31m✖ Connection error. Is the backend running?\x1b[0m\r\n");
    };

    socket.onclose = () => {
      setStatus("disconnected");
      term.writeln("\r\n\x1b[33m⚠ Connection closed.\x1b[0m\r\n");
    };

    term.onData((data) => {
      if (socket.readyState !== WebSocket.OPEN) return;
      if (data.length > 1 && !data.startsWith("\x1b")) {
        const lines = data.split(/\r?\n/);
        for (const line of lines) {
          if (!line.trim()) continue;
          if (!isCommandAllowed(line)) {
            term.writeln(`\r\n\x1b[31m✖ Blocked paste: "${line.trim()}"\x1b[0m\r\n`);
            return;
          }
        }
      }
      socket.send(data);
    });

    const handleResize = () => {
      fitAddon.fit();
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close();
      term.dispose();
      socketRef.current = null;
      terminalInstanceRef.current = null;
    };
  }, [serverId, socketUrl, reconnectKey]);

  const handleSend = () => {
    const trimmed = command.trim();
    if (!trimmed) return;
    setCmdError("");
    if (!isCommandAllowed(trimmed)) {
      setCmdError(`"${trimmed.split(" ")[0]}" is not an allowed command in this restricted shell.`);
      return;
    }
    if (sendRaw(trimmed)) setCommand("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCommand((prev) => prev + text);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 1500);
      }
    } catch {
      setCmdError("Clipboard access denied. Paste manually with Ctrl+V.");
    }
  };

  const statusMeta = {
    connected:    { dot: "bg-emerald-500", label: "Connected" },
    connecting:   { dot: "bg-amber-400 animate-pulse", label: "Connecting…" },
    error:        { dot: "bg-red-500", label: "Connection Error" },
    disconnected: { dot: "bg-slate-400", label: "Disconnected" },
  }[status] ?? { dot: "bg-slate-400", label: status };

  return (
    <div className="flex flex-col gap-3">
      {/* Status bar */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className={`inline-block h-2 w-2 rounded-full ${statusMeta.dot}`} />
        <span className="font-medium">{statusMeta.label}</span>
        <span className="ml-auto font-mono opacity-60 truncate max-w-xs" title={socketUrl}>{socketUrl}</span>
        <button
          type="button"
          onClick={reconnect}
          className="ml-2 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition font-medium"
        >
          Retry
        </button>
      </div>

      {/* xterm canvas */}
      <div
        ref={terminalRef}
        style={{ height: "420px", width: "100%" }}
        className="rounded-xl overflow-hidden border border-slate-700 shadow-lg"
        onClick={() => terminalInstanceRef.current?.focus()}
      />

      {/* Command input bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePaste}
            title="Paste from clipboard"
            className={`shrink-0 px-3 py-2 rounded-lg border transition flex items-center gap-1.5 text-sm font-medium
              ${pasteSuccess
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
          >
            {pasteSuccess ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Pasted</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden sm:inline">Paste</span>
              </>
            )}
          </button>

          <input
            type="text"
            value={command}
            onChange={(e) => { setCommand(e.target.value); setCmdError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="Type a command and press Enter…"
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition
              ${cmdError
                ? "border-red-400 focus:ring-red-400/40"
                : "border-slate-300 dark:border-slate-600 focus:ring-blue-500/40"
              }`}
            spellCheck={false}
          />

          <button
            type="button"
            onClick={handleSend}
            className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {cmdError && (
          <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 px-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {cmdError}
          </p>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-500 px-1">
          Restricted shell — only installation-related commands are permitted.
        </p>
      </div>
    </div>
  );
});

WebTerminal.displayName = "WebTerminal";
export default WebTerminal;