/** Inline before hydration to avoid theme flash; must match persist name + state shape. */
export const THEME_STORAGE_SCRIPT = `(function(){try{var k='inklink-theme';var r=localStorage.getItem(k);if(!r)return;var p=JSON.parse(r);var t=p&&p.state&&p.state.theme;if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`;
