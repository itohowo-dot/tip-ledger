import { createContext, useContext, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";

const ROUTE_ORDER: Record<string, number> = {
  "/": 0,
  "/send": 1,
  "/activity": 2,
  "/leaderboard": 3,
  "/dashboard": 4,
};

interface NavigationDirectionValue {
  direction: number; // 1 = forward, -1 = backward
}

const NavigationDirectionContext = createContext<NavigationDirectionValue>({ direction: 1 });

export function NavigationDirectionProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const prevIndex = useRef(ROUTE_ORDER[pathname] ?? 0);

  const direction = useMemo(() => {
    const currentIndex = ROUTE_ORDER[pathname] ?? 0;
    const dir = currentIndex >= prevIndex.current ? 1 : -1;
    prevIndex.current = currentIndex;
    return dir;
  }, [pathname]);

  return (
    <NavigationDirectionContext.Provider value={{ direction }}>
      {children}
    </NavigationDirectionContext.Provider>
  );
}

export function useNavigationDirection() {
  return useContext(NavigationDirectionContext);
}
