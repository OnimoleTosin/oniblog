import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { auth, getIdToken } from "@/lib/firebaseAuth";
import { logout as firebaseLogout } from "@/lib/firebaseAuth";
import { useLocation } from "wouter";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const [, setLocation] = useLocation();
  const { redirectOnUnauthenticated = false, redirectPath = "/auth/login" } =
    options ?? {};
  const utils = trpc.useUtils();
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Initialize Firebase auth state listener
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      if (!isMounted) return;

      try {
        if (user) {
          const token = await getIdToken();
          if (isMounted) {
            setFirebaseToken(token);
          }
        } else {
          if (isMounted) {
            setFirebaseToken(null);
          }
        }
      } catch (error) {
        console.error('[useAuth] Error getting Firebase token:', error);
        if (isMounted) {
          setFirebaseToken(null);
        }
      } finally {
        if (isMounted) {
          setFirebaseReady(true);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Only query backend after Firebase is ready
  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: firebaseReady,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      // Call Firebase logout
      await firebaseLogout();
      
      // Call backend logout for cleanup
      try {
        await logoutMutation.mutateAsync();
      } catch (error) {
        // Ignore errors from backend logout
        console.error('[useAuth] Backend logout error:', error);
      }
    } catch (error: unknown) {
      console.error('[useAuth] Logout error:', error);
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      setFirebaseToken(null);
      setFirebaseReady(false);
      setLocation('/');
    }
  }, [logoutMutation, utils, setLocation]);

  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      loading: !firebaseReady || meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
      firebaseToken,
      firebaseReady,
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
    firebaseToken,
    firebaseReady,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (!firebaseReady) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    setLocation(redirectPath);
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    firebaseReady,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
    setLocation,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
