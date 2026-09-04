export const THEME_STORAGE_KEY = 'site-theme'

/**
 * Runs before first paint, inline in <head>.
 *
 * Two jobs: apply a stored explicit theme choice with no flash of the wrong
 * one, and set `data-theme` before React hydrates so the server and client
 * markup agree. Doing this in an effect instead would produce both a flash and
 * a hydration mismatch.
 *
 * With no stored choice we set nothing and the CSS `prefers-color-scheme`
 * media query in globals.css follows the operating system — that is the
 * template default. Only a deliberate press of the header switch writes this
 * key. Wrapped in try/catch because localStorage throws in some privacy modes,
 * and a theme preference is never worth breaking a page over.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`
