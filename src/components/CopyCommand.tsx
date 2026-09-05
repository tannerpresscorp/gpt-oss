import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCommand({ label, command }: { label: string; command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return <div className="command-block"><span>{label}</span><button onClick={copy} aria-label={`Copy ${command}`}><code>{command}</code>{copied ? <Check size={17} /> : <Copy size={17} />}</button>{copied && <small role="status">Copied—paste it into your terminal.</small>}</div>;
}
