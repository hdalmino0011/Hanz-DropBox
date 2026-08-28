// script.js
(function () {
  "use strict";

  var config = window.DROPBOX_CONFIG || {};
  var owner = config.owner || "";
  var repo = config.repo || "";
  var branch = config.branch || "main";
  var rootPath = (config.path || "").replace(/^\/+|\/+$/g, "");

  var state = {
    currentPath: rootPath,
    entries: [],
    query: ""
  };

  var els = {
    pathTrail: document.getElementById("pathTrail"),
    searchInput: document.getElementById("searchInput"),
    refreshBtn: document.getElementById("refreshBtn"),
    clearCacheBtn: document.getElementById("clearCacheBtn"),
    listState: document.getElementById("listState"),
    stateIcon: document.getElementById("stateIcon"),
    stateTitle: document.getElementById("stateTitle"),
    stateBody: document.getElementById("stateBody"),
    stateActionBtn: document.getElementById("stateActionBtn"),
    ledgerList: document.getElementById("ledgerList")
  };

  var EXT_GROUPS = {
    image: ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"],
    doc: ["pdf", "doc", "docx", "txt", "md", "rtf", "odt"],
    archive: ["zip", "rar", "7z", "tar", "gz"],
    app: ["apk", "exe", "dmg", "msi", "ipa"]
  };

  function extGroup(ext) {
    for (var group in EXT_GROUPS) {
      if (EXT_GROUPS[group].indexOf(ext) !== -1) return group;
    }
    return "generic";
  }

  function getExt(name) {
    var parts = name.split(".");
    if (parts.length < 2) return "";
    return parts[parts.length - 1].toLowerCase();
  }

  function formatSize(bytes) {
    if (bytes === undefined || bytes === null) return "\u2014";
    if (bytes < 1024) return bytes + " B";
    var units = ["KB", "MB", "GB"];
    var val = bytes;
    var i = -1;
    do {
      val = val / 1024;
      i++;
    } while (val >= 1024 && i < units.length - 1);
    return val.toFixed(val < 10 ? 1 : 0) + " " + units[i];
  }

  function apiUrl(path) {
    var url = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + path;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "ref=" + encodeURIComponent(branch);
  }

  function showState(kind, title, body, withAction) {
    els.ledgerList.innerHTML = "";
    els.listState.hidden = false;
    els.stateIcon.className = "state-icon " + kind;
    els.stateTitle.textContent = title;
    els.stateBody.textContent = body;
    els.stateActionBtn.hidden = !withAction;
  }

  function hideState() {
    els.listState.hidden = true;
  }

  function renderBreadcrumbs() {
    var trail = els.pathTrail;
    trail.innerHTML = "";

    var rootBtn = document.createElement("button");
    rootBtn.type = "button";
    rootBtn.className = "crumb";
    rootBtn.dataset.path = rootPath;
    rootBtn.textContent = "root";
    trail.appendChild(rootBtn);

    var relative = state.currentPath.slice(rootPath.length).replace(/^\/+/, "");
    var segments = relative ? relative.split("/") : [];
    var acc = rootPath;

    segments.forEach(function (seg, idx) {
      var sep = document.createElement("span");
      sep.className = "crumb-sep";
      sep.textContent = "/";
      trail.appendChild(sep);

      acc = acc ? acc + "/" + seg : seg;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "crumb";
      btn.dataset.path = acc;
      btn.textContent = seg;
      if (idx === segments.length - 1) {
        btn.classList.add("is-current");
      }
      trail.appendChild(btn);
    });

    if (segments.length === 0) {
      rootBtn.classList.add("is-current");
    }

    Array.prototype.forEach.call(trail.querySelectorAll(".crumb"), function (btn) {
      btn.addEventListener("click", function () {
        loadPath(btn.dataset.path);
      });
    });
  }

  function iconFor(entry) {
    if (entry.type === "dir") {
      var f = document.createElement("span");
      f.className = "icon-folder";
      f.setAttribute("aria-hidden", "true");
      return f;
    }
    var ext = getExt(entry.name);
    var group = extGroup(ext);
    var i = document.createElement("span");
    i.className = "icon-file" + (group !== "generic" ? " type-" + group : "");
    i.setAttribute("aria-hidden", "true");
    i.setAttribute("data-ext", ext ? ext.slice(0, 4) : "file");
    return i;
  }

  function renderEntries() {
    var list = els.ledgerList;
    list.innerHTML = "";

    var query = state.query.trim().toLowerCase();
    var filtered = state.entries.filter(function (e) {
      return !query || e.name.toLowerCase().indexOf(query) !== -1;
    });

    filtered.sort(function (a, b) {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    if (filtered.length === 0) {
      hideState();
      var emptyKind = query ? "warn" : "empty";
      showState(
        emptyKind,
        query ? "No matches" : "This folder is empty",
        query ? "Nothing here matches \u201c" + state.query + "\u201d." : "Push some files to this folder in the repository to see them here."
      );
      return;
    }

    hideState();

    filtered.forEach(function (entry) {
      var row = document.createElement("li");
      row.className = "ledger-row";
      row.setAttribute("role", "listitem");

      var nameCell = document.createElement("div");
      nameCell.className = "row-name";

      if (entry.type === "dir") {
        var openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "name-btn";
        openBtn.appendChild(iconFor(entry));
        var nameSpan = document.createElement("span");
        nameSpan.className = "name-text";
        nameSpan.textContent = entry.name;
        openBtn.appendChild(nameSpan);
        openBtn.addEventListener("click", function () {
          loadPath(entry.path);
        });
        nameCell.appendChild(openBtn);
      } else {
        var wrap = document.createElement("span");
        wrap.className = "name-btn";
        wrap.appendChild(iconFor(entry));
        var nameSpan2 = document.createElement("span");
        nameSpan2.className = "name-text";
        nameSpan2.textContent = entry.name;
        wrap.appendChild(nameSpan2);
        nameCell.appendChild(wrap);
      }
      row.appendChild(nameCell);

      var typeCell = document.createElement("span");
      typeCell.className = "row-type";
      typeCell.textContent = entry.type === "dir" ? "Folder" : (getExt(entry.name) || "file").toUpperCase();
      row.appendChild(typeCell);

      var sizeCell = document.createElement("span");
      sizeCell.className = "row-size";
      sizeCell.setAttribute("data-label", "Size:");
      sizeCell.textContent = entry.type === "dir" ? "\u2014" : formatSize(entry.size);
      row.appendChild(sizeCell);

      var actionCell = document.createElement("div");
      actionCell.className = "row-action";

      if (entry.type === "dir") {
        var openLink = document.createElement("button");
        openLink.type = "button";
        openLink.className = "download-btn open-btn";
        openLink.innerHTML = '<span class="download-icon" aria-hidden="true"></span><span>Open</span>';
        openLink.addEventListener("click", function () {
          loadPath(entry.path);
        });
        actionCell.appendChild(openLink);
      } else {
        var dl = document.createElement("a");
        dl.className = "download-btn";
        dl.href = entry.download_url || entry.html_url;
        dl.setAttribute("download", entry.name);
        dl.target = "_blank";
        dl.rel = "noopener";
        dl.innerHTML = '<span class="download-icon" aria-hidden="true"></span><span>Get</span>';
        actionCell.appendChild(dl);
      }
      row.appendChild(actionCell);

      list.appendChild(row);
    });
  }

  function loadPath(path) {
    state.currentPath = path;
    state.query = "";
    els.searchInput.value = "";
    renderBreadcrumbs();
    fetchFolder(path);
  }

  function fetchFolder(path) {
    if (!owner || !repo) {
      showState(
        "warn",
        "Repository not configured",
        "Open config.js and set owner, repo and branch to point this page at your GitHub repository.",
        false
      );
      return;
    }

    // Hide any previous state – no loading message
    hideState();
    els.ledgerList.innerHTML = "";

    var url = apiUrl(path);
    console.log("Fetching: " + url);

    var controller = new AbortController();
    var timeoutId = setTimeout(function () {
      controller.abort();
    }, 10000);

    fetch(url, { signal: controller.signal })
      .then(function (res) {
        clearTimeout(timeoutId);
        console.log("Response status: " + res.status);
        if (res.status === 404) {
          throw { kind: "notfound" };
        }
        if (res.status === 403) {
          throw { kind: "ratelimit" };
        }
        if (!res.ok) {
          throw { kind: "error", status: res.status };
        }
        return res.json();
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : [data];
        state.entries = list.map(function (item) {
          return {
            name: item.name,
            path: item.path,
            type: item.type === "dir" ? "dir" : "file",
            size: item.size,
            download_url: item.download_url,
            html_url: item.html_url
          };
        });
        renderEntries();
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        console.error("Fetch error:", err);
        if (err && err.name === "AbortError") {
          showState("warn", "Request timed out",
            "GitHub API took too long to respond. Check your internet or try again later.", false);
        } else if (err && err.kind === "notfound") {
          showState("warn", "Folder not found",
            "GitHub couldn\u2019t find that path in " + owner + "/" + repo + ". Check the repository, branch and path in config.js.", false);
        } else if (err && err.kind === "ratelimit") {
          showState("warn", "Rate limit reached",
            "GitHub\u2019s public API allows a limited number of unauthenticated requests per hour from your location. Try again shortly.", false);
        } else {
          showState("warn", "Couldn\u2019t reach GitHub",
            "Check your connection, or confirm the repository is public and correctly set in config.js.", false);
        }
      });
  }

  function init() {
    renderBreadcrumbs();
    fetchFolder(state.currentPath);

    els.searchInput.addEventListener("input", function (e) {
      state.query = e.target.value;
      renderEntries();
    });

    els.refreshBtn.addEventListener("click", function () {
      fetchFolder(state.currentPath);
    });

    els.clearCacheBtn.addEventListener("click", clearCacheAndReload);
  }

  function clearCacheAndReload() {
    var btn = els.clearCacheBtn;
    btn.classList.add("is-working");
    btn.disabled = true;
    btn.querySelector("span:last-child").textContent = "Clearing\u2026";

    var jobs = [];

    if (window.caches && caches.keys) {
      jobs.push(
        caches.keys().then(function (names) {
          return Promise.all(names.map(function (name) { return caches.delete(name); }));
        }).catch(function () {})
      );
    }

    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      jobs.push(
        navigator.serviceWorker.getRegistrations().then(function (regs) {
          return Promise.all(regs.map(function (r) { return r.unregister(); }));
        }).catch(function () {})
      );
    }

    try { window.localStorage && localStorage.clear(); } catch (e) {}
    try { window.sessionStorage && sessionStorage.clear(); } catch (e) {}

    Promise.all(jobs).finally(function () {
      var url = new URL(window.location.href);
      url.searchParams.set("_fresh", Date.now().toString());
      window.location.replace(url.toString());
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
