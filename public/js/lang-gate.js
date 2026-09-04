(function () {
  function showLangGate() {
    if (typeof hasLang === "function" && hasLang()) return;
    if (document.getElementById("zeLangGate")) return;
    const overlay = document.createElement("div");
    overlay.id = "zeLangGate";
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:400;display:flex;align-items:flex-end;justify-content:center;";
    overlay.innerHTML = `
      <div style="background:#F4F1EC;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:22px 18px calc(18px + env(safe-area-inset-bottom));">
        <div style="font-size:17px;font-weight:700;margin-bottom:6px;">Choose your language</div>
        <div style="font-size:13px;color:#5C5955;margin-bottom:14px;">You can change this later in Settings.</div>
        <button type="button" data-lang="en" style="width:100%;margin-bottom:8px;background:#C2410C;color:#fff;border:none;border-radius:12px;padding:13px;font-weight:700;">English</button>
        <button type="button" data-lang="bem" style="width:100%;margin-bottom:8px;background:#fff;border:1px solid #E2E0DC;border-radius:12px;padding:13px;font-weight:700;">Bemba</button>
        <button type="button" data-lang="ny" style="width:100%;background:#fff;border:1px solid #E2E0DC;border-radius:12px;padding:13px;font-weight:700;">Nyanja</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (typeof setLangAndApply === "function") setLangAndApply(btn.dataset.lang);
        overlay.remove();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showLangGate);
  } else {
    showLangGate();
  }
})();
