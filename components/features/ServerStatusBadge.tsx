"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerStatus } from "@/hooks/useServerStatus";
import { Wifi, WifiOff } from "lucide-react";

export function ServerStatusBadge() {
  const { status } = useServerStatus();

  if (status === 'loading') {
    return <Skeleton className="h-6 w-24 rounded-full" />;
  }

  if (status === 'offline') {
    return (
      <Badge variant="destructive" className="flex items-center gap-2">
        <WifiOff className="h-3 w-3" />
        Servidor Offline
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-2 border-green-600 text-green-700 dark:border-green-500 dark:text-green-500">
      <Wifi className="h-3 w-3" />
      Servidor Online
    </Badge>
  );
}