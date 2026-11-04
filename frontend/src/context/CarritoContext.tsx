import { createContext, type ReactNode } from "react";
import type { ItemCarrito } from "../context/carrito.reducer";

interface CarritoContextValue {
  items: ItemCarrito[];
}

interface CarritoProviderProps {
  children: ReactNode;
}

export const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({
  children,
}: CarritoProviderProps) {
  return (
    <CarritoContext.Provider value={{ items: [] }}>
      {children}
    </CarritoContext.Provider>
  );
}