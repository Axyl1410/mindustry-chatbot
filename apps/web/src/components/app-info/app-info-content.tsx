import Link from "next/link";

export function AppInfoContent() {
  return (
    <div className="space-y-4">
      <p className="text-foreground leading-relaxed">
        <span className="font-medium">Mindustry Chatbot</span> is an open-source
        AI interface that uses RAG to retrieve accurate information from
        Mindustry documentation, helping you look things up and improve your
        gameplay.
      </p>
      <p className="text-foreground leading-relaxed">
        The source code is available on{" "}
        <Link
          className="underline hover:text-primary"
          href="https://github.com/Axyl1410/mindustry-chatbot"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </Link>
        .
      </p>
    </div>
  );
}
