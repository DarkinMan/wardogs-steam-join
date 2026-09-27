/* The URL fragment stays in the browser; no join target is sent to the host. */
(function () {
  "use strict";
  function parseJoinFragment(fragment) {
    if (typeof fragment !== "string" || fragment.length > 512) return null;
    let uri;
    try { uri = decodeURIComponent(fragment.replace(/^#/, "")); }
    catch { return null; }
    const lobby = /^steam:\/\/joinlobby\/1867240\/([1-9][0-9]{0,19})\/([1-9][0-9]{0,19})$/.exec(uri);
    if (lobby) {
      const id = BigInt(lobby[1]), player = BigInt(lobby[2]);
      if (id <= 18446744073709551615n && player > 76561197960265728n && player <= 76561202255233023n) return uri;
    }
    const address = /^steam:\/\/connect\/([0-9]{1,3}(?:\.[0-9]{1,3}){3}):([0-9]{1,5})$/.exec(uri);
    if (address) {
      const octets = address[1].split(".").map(Number), port = Number(address[2]);
      if (octets.every(n => n <= 255) && port > 0 && port <= 65535) return uri;
    }
    return null;
  }
  function start(doc, location) {
    const uri = parseJoinFragment(location.hash);
    const status = doc.getElementById("status");
    if (!uri) {
      doc.getElementById("title").textContent = "Use your Discord join button";
      status.textContent = "This page needs a valid Wardogs join link. Return to the server board and click Join via Steam.";
      return;
    }
    const link = doc.getElementById("open");
    link.href = uri;
    link.hidden = false;
    doc.getElementById("hint").hidden = false;
    status.textContent = "Opening Steam to join your server…";
    try { location.assign(uri); }
    catch { status.textContent = "Your browser needs another click. Select Open Steam below."; }
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { parseJoinFragment, start };
  else start(document, window.location);
})();
