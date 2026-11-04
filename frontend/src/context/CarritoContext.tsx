import { createContext, type ReactNode } from "react";
import { type ItemCarrito } from "../context/carrito.reducer";

interface CarritoContextValue {
  items: ItemCarrito[];
}

export const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CarritoContext.Provider value={{ items: [] }}>
      {children}
    </CarritoContext.Provider>
  );
}