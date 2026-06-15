/**
 * 功能：书签模块搜索框（InputGroup + 搜索图标）。
 * 关联：NavBookmarks.tsx、SectionTabsNav.tsx
 */
import { Search } from "lucide-react";
import { bookmarkSearchPlaceholder, toolbarSearchInputClass, toolbarSearchInputControlClass } from "@/bookmarks/shared/lib/toolbar-ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface BookmarkSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function BookmarkSearchInput({ value, onChange, className }: BookmarkSearchInputProps) {
  return (
    <InputGroup className={cn(toolbarSearchInputClass, className)}>
      <InputGroupAddon align="inline-start">
        <Search aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={bookmarkSearchPlaceholder}
        autoComplete="off"
        className={toolbarSearchInputControlClass}
      />
    </InputGroup>
  );
}
