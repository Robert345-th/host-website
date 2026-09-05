(function () {
  const STYLE_ID = "ze-bottom-nav-styles";
  const ICONS = {
    home: '<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/>',
    wanted: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    booked: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    shop: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    install: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  };
  const ITEMS = [
    { key: "home", href: "/", label: "Home", labelKey: "home" },
    { key: "wanted", href: "/wanted.html", label: "Wanted", labelKey: "wanted" },
    { key: "booked", href: "/booked.html", label: "Booked", labelKey: "booked" },
    { key: "shop", href: "/my-shop.html", label: "My Shop", labelKey: "my_shop" },
  ];

  function navLabel(key, fallback) {
    return typeof t === "function" ? t(key) : fallback;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .bottom-nav {
        position: fixed; left: 0; right: 0; bottom: 0; z-index: 120;
        display: flex; background: #111; border-top: 1px solid #222;
        padding: 8px 6px calc(8px + env(safe-area-inset-bottom, 0px));
      }
      body.ze-has-bottom-nav { padding-bottom: 72px; }
      .bottom-nav .nav-item {
        flex: 1; text-align: center; text-decoration: none; color: #9a9490;
        font-size: 9px; font-weight: 600; padding: 4px 1px; min-width: 0;
        background: none; border: none; cursor: pointer; font-family: inherit;
      }
      .bottom-nav .nav-item.active { color: #F5C518; }
      .bottom-nav .nav-icon {
        display: flex; align-items: center; justify-content: center; margin-bottom: 2px;
      }
      .bottom-nav .nav-icon svg {
        width: 21px; height: 21px; stroke: currentColor; fill: none;
        stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
      }
    `;
    document.head.appendChild(style);
  }

  function shouldShowInstallNav() {
    if (typeof window.isPwaStandalone === "function" && window.isPwaStandalone()) return false;
    return true;
  }

  function installNavLabel() {
    if (/Android/i.test(navigator.userAgent)) return navLabel("nav_download", "Download");
    return navLabel("nav_install", "Install");
  }

  function renderInstallNavItem() {
    if (!shouldShowInstallNav()) return "";
    const label = installNavLabel();
    return `
      <button type="button" class="nav-item" id="navInstallBtn">
        <div class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS.install}</svg></div>
        <div>${label}</div>
      </button>`;
  }

  function wireInstallNavButton() {
    const btn = document.getElementById("navInstallBtn");
    if (!btn || btn.dataset.wired === "1") return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", () => {
      if (typeof window.promptPwaInstall === "function") {
        window.promptPwaInstall();
        return;
      }
      window.location.href = "/install.html";
    });
  }

  function renderBottomNav(active) {
    injectStyles();
    document.body.classList.add("ze-has-bottom-nav");
    let mount = document.getElementById("bottomNav");
    if (!mount) {
      mount = document.createElement("nav");
      mount.id = "bottomNav";
      mount.setAttribute("aria-label", "Main");
      document.body.appendChild(mount);
    }
    mount.className = "bottom-nav";
    mount.innerHTML = ITEMS.map((item) => {
      const isActive = active && item.key === active;
      const needsLogin = item.key === "shop" || item.key === "booked";
      return `
        <a href="${item.href}" class="nav-item${isActive ? " active" : ""}"${needsLogin ? ' data-require-login="1"' : ""}>
          <div class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[item.key]}</svg></div>
          <div>${navLabel(item.labelKey, item.label)}</div>
        </a>`;
    }).join("") + renderInstallNavItem();

    mount.querySelectorAll("[data-require-login]").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (window.ZEAuth && !ZEAuth.requireLogin(link.getAttribute("href"))) {
          e.preventDefault();
        }
      });
    });
    wireInstallNavButton();
  }

  window.renderBottomNav = renderBottomNav;

  function boot() {
    if (!document.body.hasAttribute("data-nav-active")) return;
    renderBottomNav(document.body.dataset.navActive || null);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("pwa-install-ready", boot);
  window.addEventListener("appinstalled", boot);
  window.addEventListener("langchange", boot);
})();
