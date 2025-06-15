"use client";

import React from "react";

// Ya no se necesitan props si los botones se eliminan
interface ToolbarProps {}

export const Toolbar: React.FC<ToolbarProps> = () => {
  // Opción 1: Devolver null si la barra ya no debe renderizarse en absoluto.
  return null;

  // Opción 2: Devolver el div vacío si quieres mantener la estructura para futuro uso, 
  // pero sin los botones de Save/Reset.
  // return (
  //   <div className="absolute top-4 right-4 flex gap-2 bg-background/80 backdrop-blur-md p-2 rounded shadow-lg z-10">
  //     {/* No hay contenido de botones aquí */}
  //   </div>
  // );
};
