import { PromptSuggestion } from "@/components/ui/prompt-suggestion";

const DEFAULT_SUGGESTIONS = [
  "what's the current date?",
  "what time is it in Tokyo?",
  "give me the current time in Europe/Paris",
  "Write a poem",
  "Code a React component",
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
