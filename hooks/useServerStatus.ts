"use client";

import { useState, useEffect } from 'react';
import { checkServerHealth } from '@/lib/api';
import { HealthStatus } from '@/types/analysis';

type Status = 'loading' | 'online' | 'offline';

export function useServerStatus() {
  const [status, setStatus] = useState<Status>('loading');
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function verifyStatus() {
      try {
        const data = await checkServerHealth();
        if (isMounted) {
          if (data.success && data.status === 'healthy' && data.analyzer_ready) {
            setStatus('online');
            setHealthData(data);
          } else {
            setStatus('offline');
          }
        }
      } catch (error) {
        if (isMounted) {
          setStatus('offline');
        }
      }
    }

    verifyStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return { status, healthData };
}