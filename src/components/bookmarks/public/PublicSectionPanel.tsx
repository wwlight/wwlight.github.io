import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PublicSectionPanelProps {
  children: ReactNode;
}

export function PublicSectionPanel({ children }: PublicSectionPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-5 pt-6">{children}</CardContent>
    </Card>
  );
}
