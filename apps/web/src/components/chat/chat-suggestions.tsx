import { PromptSuggestion } from "@/components/ui/prompt-suggestion";

const DEFAULT_SUGGESTIONS = [
  "Explain how Logic works in Mindustry",
  "Design an optimal schematic for a Silicon factory",
  "How to set up an automatic transport system using Flares",
] as const;

export interface ChatSuggestionsProps {
  onSuggestionClick: (text: string) => void;
  show?: boolean;
  suggestions?: readonly string[];
}

export function ChatSuggestions({
  onSuggestionClick,
  show = true,
  suggestions = DEFAULT_SUGGESTIONS,
}: ChatSuggestionsProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((text) => (
        <PromptSuggestion key={text} onClick={() => onSuggestionClick(text)}>
          {text}
        </PromptSuggestion>
      ))}
    </div>
  );
}
