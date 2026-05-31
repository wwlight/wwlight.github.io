import {
  Download,
  FileDown,
  History,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react";
import type { ReactNode } from "react";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";
import { ColorThemePicker } from "@/components/theme/ColorThemePicker";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cardIconClass } from "@/lib/bookmarks/admin-helpers";
import { cn } from "@/lib/utils";

interface AdminHeaderActionProps {
  label: string;
  description?: string;
  onClick: () => void;
  children: ReactNode;
  primary?: boolean;
}

function AdminHeaderAction({
  label,
  description,
  onClick,
  children,
  primary = false,
}: AdminHeaderActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus-visible:ring-0 focus-visible:ring-offset-0",
            primary
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : cardIconClass,
          )}
          aria-label={label}
          onClick={onClick}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        <p className="font-medium">{label}</p>
        {description ? <p className="mt-0.5 text-muted-foreground">{description}</p> : null}
      </TooltipContent>
    </Tooltip>
  );
}

interface AdminHeaderActionsProps {
  className?: string;
  isDev: boolean;
  userName: string;
  onImportJson: () => void;
  onExportJson: () => void;
  onOpenVersionHistory: () => void;
  onRestoreInitial: () => void;
  onSave: () => void;
  onReturnToFrontend: () => void;
  onReturnToBlog: () => void;
  onLogout: () => void;
}

export function AdminHeaderActions({
  className,
  isDev,
  userName,
  onImportJson,
  onExportJson,
  onOpenVersionHistory,
  onRestoreInitial,
  onSave,
  onReturnToFrontend,
  onReturnToBlog,
  onLogout,
}: AdminHeaderActionsProps) {
  const saveLabel = isDev ? "保存到项目" : "导出 bookmarks.ts";
  const saveDescription = isDev
    ? "写入 db/data/bookmarks.ts"
    : "下载文件后手动替换并提交";

  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2", className)}>
      <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
        <AdminHeaderAction label="导入 JSON" onClick={onImportJson}>
          <Upload className="size-4" />
        </AdminHeaderAction>
        <AdminHeaderAction label="导出 JSON" onClick={onExportJson}>
          <Download className="size-4" />
        </AdminHeaderAction>
        {isDev ? (
          <AdminHeaderAction label="版本记录" onClick={onOpenVersionHistory}>
            <History className="size-4" />
          </AdminHeaderAction>
        ) : null}
        <AdminHeaderAction label="恢复初始" onClick={onRestoreInitial}>
          <RotateCcw className="size-4" />
        </AdminHeaderAction>
        <AdminHeaderAction
          label={saveLabel}
          description={saveDescription}
          onClick={onSave}
          primary
        >
          {isDev ? <Save className="size-4" /> : <FileDown className="size-4" />}
        </AdminHeaderAction>
      </div>

      <ColorThemePicker />

      <AdminUserMenu
        name={userName}
        onReturnToFrontend={onReturnToFrontend}
        onReturnToBlog={onReturnToBlog}
        onLogout={onLogout}
      />
    </div>
  );
}
