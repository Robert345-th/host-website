(function () {
  function serviceUrl(item) {
    const id = item && item.id;
    return `${location.origin}/service.html?id=${id}`;
  }

  function shopUrl(userId) {
    return `${location.origin}/vendor.html?id=${userId}`;
  }

  function shareText(item) {
    const title = item.title || "ZedEvents service";
    const price = typeof ZE !== "undefined" ? ZE.formatPrice(item.price) : item.price;
    return `${title} — ${price}\n${serviceUrl(item)}`;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      if (window.ZEUI) ZEUI.toast(typeof t === "function" ? t("copied") : "Link copied.", "success");
      else alert("Link copied.");
    } catch {
      prompt("Copy this link:", text);
    }
  }

  function openWhatsApp(text) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function shareService(item) {
    const text = shareText(item);
    const url = serviceUrl(item);
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title || "ZedEvents", text, url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    openShareSheet(item);
  }

  async function shareShop(userId, name) {
    const url = shopUrl(userId);
    const text = `${name || "ZedEvents shop"}\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: name || "ZedEvents", text, url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    openShareSheet({ title: name || "ZedEvents shop", _shareText: text, _shareUrl: url });
  }

  function openShareSheet(item) {
    let sheet = document.getElementById("zeShareSheet");
    if (sheet) sheet.remove();
    sheet = document.createElement("div");
    sheet.id = "zeShareSheet";
    sheet.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:300;display:flex;align-items:flex-end;justify-content:center;";
    const text = item._shareText || shareText(item);
    const url = item._shareUrl || serviceUrl(item);
    const waLabel = typeof t === "function" ? t("whatsapp") : "WhatsApp";
    const copyLabel = typeof t === "function" ? t("copy_link") : "Copy link";
    const shareLabel = typeof t === "function" ? t("share") : "Share";
    sheet.innerHTML = `
      <div style="background:#F4F1EC;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:18px 16px calc(16px + env(safe-area-inset-bottom));">
        <div style="font-size:16px;font-weight:700;margin-bottom:12px;">${shareLabel}</div>
        <button type="button" data-act="wa" style="width:100%;margin-bottom:8px;background:#25D366;color:#fff;border:none;border-radius:12px;padding:13px;font-weight:700;">${waLabel}</button>
        <button type="button" data-act="copy" style="width:100%;margin-bottom:8px;background:#fff;border:1px solid #E2E0DC;border-radius:12px;padding:13px;font-weight:700;">${copyLabel}</button>
        <button type="button" data-act="close" style="width:100%;background:none;border:none;padding:10px;color:#5C5955;font-weight:600;">Cancel</button>
      </div>`;
    document.body.appendChild(sheet);
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) sheet.remove();
    });
    sheet.querySelector("[data-act=wa]").onclick = () => { openWhatsApp(text); sheet.remove(); };
    sheet.querySelector("[data-act=copy]").onclick = () => { copyText(url); sheet.remove(); };
    sheet.querySelector("[data-act=close]").onclick = () => sheet.remove();
  }

  function verifiedStamp(isVerified) {
    if (!isVerified) return "";
    const label = typeof t === "function" ? t("verified") : "Verified";
    return `<span class="verified-stamp" title="${label}">✓ ${label}</span>`;
  }

  window.ZEShare = { shareService, shareShop, openShareSheet, copyText, openWhatsApp, serviceUrl, shopUrl };
  window.zeVerifiedStamp = verifiedStamp;
})();
