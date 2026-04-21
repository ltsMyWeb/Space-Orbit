import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InteractiveTextProps {
  text: string;
  tooltip: string;
}

export function InteractiveText({ text, tooltip }: InteractiveTextProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-primary hover:text-white transition-colors border-b border-primary/30 hover:border-primary/70 border-dashed cursor-help font-medium">
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent className="glass-card text-white border-white/10 max-w-xs p-3">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
