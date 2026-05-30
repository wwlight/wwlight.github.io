import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookmarkSectionData } from "@/lib/bookmarks/types";

interface SectionJumpSelectProps {
  sections: BookmarkSectionData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function SectionJumpSelect({ sections, selectedIndex, onSelect }: SectionJumpSelectProps) {
  return (
    <Select value={String(selectedIndex)} onValueChange={(value) => onSelect(Number(value))}>
      <SelectTrigger className="h-8 w-30 shrink-0">
        <SelectValue placeholder="跳转" />
      </SelectTrigger>
      <SelectContent align="end">
        {sections.map((section, index) => (
          <SelectItem key={section.title + index} value={String(index)}>
            <span className="truncate">{section.title}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
