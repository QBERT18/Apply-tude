export const THEME_STORAGE_KEY = "theme";

// Inline script injected into <head> in root.tsx. Runs synchronously before
// paint so the correct theme class is on <html> before the first render,
// preventing any flash of the wrong theme. Resolution order:
//   1. localStorage["theme"] if explicitly "light" or "dark"
//   2. OS preference via prefers-color-scheme
//   3. Fallback: dark
export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);var d=t==="dark"||(t!=="light"&&!window.matchMedia("(prefers-color-scheme: light)").matches);var c=document.documentElement.classList;if(d){c.add("dark");}else{c.remove("dark");}}catch(e){}})();`;
