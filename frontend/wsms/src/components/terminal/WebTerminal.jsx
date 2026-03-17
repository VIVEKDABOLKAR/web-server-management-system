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
import api from "../../services/api";

const WebTerminal = forwardRef(({ serverId }, ref) => {

  const terminalRef = useRef(null);
  const terminalInstanceRef = useRef(null);
  const socketRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [command, setCommand] = useState("");
  const [reconnectKey, setReconnectKey] = useState(0);

  const socketUrl = useMemo(() => {
    const token = localStorage.getItem("token");
    const backendBaseUrl = "ws://localhost:8080/ws/terminal";
    const parsedUrl = new URL(backendBaseUrl);
    parsedUrl.protocol = parsedUrl.protocol === "https:" ? "wss:" : "ws:";
    parsedUrl.pathname = "/ws/terminal";
    parsedUrl.search = token ? `token=${encodeURIComponent(token)}` : "";
    return parsedUrl.toString();
  }, []);

  const sendRaw = useCallback((rawCommand) => {
    //Holds the websocket instance
    const socket = socketRef.current;
    //Holds the xterm terminal instance
    //xterm is the terminal UI library used in the browser
    const term = terminalInstanceRef.current;

    if (!rawCommand || !rawCommand.trim()) {
      return false;
    }

    //it will send the data to the backend what user is entering in the terminal
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(rawCommand.endsWith("\n") ? rawCommand : `${rawCommand}\n`);
      return true;
    }

    if (term) {
      term.writeln("\r\nUnable to send command: Spring terminal websocket is not connected.\r\n");
    }

    return false;
  }, []);

  const reconnect = useCallback(() => {
    setStatus("connecting");
    setReconnectKey((prev) => prev + 1);
  }, []);

  useImperativeHandle(ref, () => ({
    sendCommand: (cmd) => sendRaw(cmd),
    reconnect,
    focus: () => terminalInstanceRef.current?.focus(),
  }), [reconnect, sendRaw]);

  useEffect(() => {

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      theme: {
        background: "#020617",
        foreground: "#e2e8f0",
      },
    });
    terminalInstanceRef.current = term;

    //FitAddon is an add-on used with xterm.js that automatically resizes a terminal to fit its container
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();
    term.focus();
    term.writeln("WSMS Remote Terminal");
    term.writeln(`Server ID: ${serverId || "N/A"}`);
    term.writeln("Connecting to Spring terminal websocket...\r\n");

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("connected");
      socket.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
      term.writeln("Connected. You can start typing commands.\r\n");
    };

    //receives messages from backend and writes them to terminal with term.write(event.data).
    socket.onmessage = (event) => {
      term.write(event.data);
    };

    socket.onerror = () => {
      setStatus("error");
      term.writeln("\r\nConnection error. Check Spring Boot backend websocket.\r\n");
    };

    socket.onclose = () => {
      setStatus("disconnected");
      term.writeln("\r\nConnection closed.\r\n");
    };

    //captures keyboard input and sends it to backend with socket.send(data).
    term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
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

  const statusLabel =
    status === "connected"
      ? "Connected"
      : status === "connecting"
        ? "Connecting..."
        : status === "error"
          ? "Connection Error"
          : "Disconnected";

  const statusClass =
    status === "connected"
      ? "bg-emerald-500"
      : status === "connecting"
        ? "bg-amber-500"
        : "bg-rose-500";

  const handleSendCommand = () => {
    const trimmed = command.trim();
    if (!trimmed) return;
    if (sendRaw(trimmed)) {
      terminalInstanceRef.current?.writeln(`$ ${trimmed}`);
      setCommand("");
    }
  };

  const handleTerminalContainerClick = () => {
    terminalInstanceRef.current?.focus();
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusClass}`} />
        <span>{statusLabel}</span>
        <span className="ml-auto text-xs opacity-80">{socketUrl}</span>
        <button
          type="button"
          onClick={reconnect}
          className="ml-3 px-2 py-1 text-xs rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          Retry
        </button>
      </div>

      <div
        ref={terminalRef}
        style={{ height: "420px", width: "100%" }}
        className="rounded-lg overflow-hidden border border-slate-700"
        onClick={handleTerminalContainerClick}
      />

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendCommand();
            }
          }}
          placeholder="Type command and press Enter (fallback input)"
          className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleSendCommand}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
});

export default WebTerminal;