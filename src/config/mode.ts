export type AppMode = "prototype" | "app";

export const MODE: AppMode =
  (import.meta.env.VITE_APP_MODE as AppMode) === "app" ? "app" : "prototype";

export const isPrototype = MODE === "prototype";
export const isApp = MODE === "app";

export default MODE;
