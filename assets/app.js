/* ============================================================
   Omniplay — 共用資料載入與卡片渲染（index.html 與 all.html）

   所有內容都從 rhino-boss/Jumbo 掃出來：
     Demogame  ← Project/Slots/<代號_名稱>/index.html
     分析報告   ← Project/競品分析/遊戲數據_*.html
     其他報告／常用連結 ← catalog.js（手動）

   GitHub API 用量（未登入限每小時 60 次，且依對外 IP 計算）：
     /git/trees/main:Project/Slots?recursive=1  1 次  一次取回整棵 Slots 子樹
     /contents/Project/競品分析                  1 次  列出競品報告
     /commits?path=<遊戲資料夾>                  每款 1 次，結果快取 24 小時
   game_rule.md、version_manifest.js、競品分析的 README.md 都是同源的
   Pages 靜態檔，不吃 API 額度。額度用完時的降級行為見 loadGames 的 catch。
   ============================================================ */
window.Omni = (function () {
  var OWNER = "rhino-boss";
  var REPO = "Jumbo";
  var SLOTS_PATH = "Project/Slots";
  var ANALYSIS_DIR = "競品分析";

  var PAGES_BASE = "https://" + OWNER + ".github.io/" + REPO;
  var API_BASE = "https://api.github.com/repos/" + OWNER + "/" + REPO;
  var BLOB_BASE = "https://github.com/" + OWNER + "/" + REPO + "/blob/main";
  var COVER_BASE = PAGES_BASE + "/" + SLOTS_PATH + "/" +
                   encodeURIComponent("其他") + "/" + encodeURIComponent("遊戲資源");
  var ANALYSIS_API = API_BASE + "/contents/Project/" + encodeURIComponent(ANALYSIS_DIR);
  var ANALYSIS_BASE = PAGES_BASE + "/Project/" + encodeURIComponent(ANALYSIS_DIR);

  var CAT_LABEL = { demo: "Demogame", analysis: "分析報告", report: "其他報告", links: "常用連結" };

  var notes = [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isExternal(u) { return /^https?:\/\//i.test(u || ""); }

  /* 未登入的 GitHub API 是每小時 60 次、且依「對外 IP」計算 —
     辦公室共用一個 IP 時很容易用完，所以把額度用盡單獨標成一種錯誤，
     才能給使用者看得懂的訊息，而不是一片空白。 */
  function fetchJson(url) {
    return fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (res) {
        if (res.status === 403 || res.status === 429) {
          var e = new Error("GitHub API 額度用完（每小時 60 次，同一 IP 共用）");
          e.rateLimited = true;
          throw e;
        }
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      });
  }
  function fetchText(url) {
    return fetch(url).then(function (r) { return r.ok ? r.text() : ""; })
      .catch(function () { return ""; });
  }

  /* ---------- 遊戲類型：統一成 Cluster Pay / Pay Anywhere / N Ways / N Lines ----------
     判定依序看 game_rule.md 的「遊戲類型」「中獎方式」，Ways / Lines 的數字取自
     「最小 / 最大 Ways」或中獎方式裡的線數；額外特色（Cascade 等）接在後面。
     邏輯與 Cworld/studio/demogame 的 normalizePlay 相同。                        */
  function normalizePlay(type, winWay, waysCell) {
    var all = type + " " + winWay + " " + waysCell;
    var fmt = function (n) { return Number(n).toLocaleString("en-US"); };

    var mech = "";
    if (/cluster/i.test(all)) {
      mech = "Cluster Pay";
    } else if (/count\s*anywhere|pay\s*anywhere|全盤面|整個盤面/i.test(all)) {
      mech = "Pay Anywhere";
    } else if (/megaways|ways|way\s*game/i.test(all)) {
      var nums = (waysCell.match(/[\d,]{3,}/g) || [])
        .map(function (s) { return Number(s.replace(/,/g, "")); }).filter(Boolean);
      if (nums.length >= 2) mech = fmt(Math.min.apply(null, nums)) + "–" + fmt(Math.max.apply(null, nums)) + " Ways";
      else if (nums.length === 1) mech = fmt(nums[0]) + " Ways";
      else mech = "Ways";
    } else {
      var ln = all.match(/(\d+)\s*(?:line|lines|線|條線)/i);
      if (ln) mech = ln[1] + " Lines";
    }
    if (!mech) return type;

    var extras = type.split(/\s*\/\s*|\s+[-–—]\s+/).map(function (s) { return s.trim(); })
      .filter(function (s) {
        return s && !/^video\s*slot$/i.test(s)
          && !/^cluster\s*pays?$/i.test(s)
          && !/^count\s*anywhere$/i.test(s)
          && !/^pay\s*anywhere$/i.test(s)
          && !/^[\d,\s–—-]*ways?$/i.test(s)
          && !/^[\d,\s–—-]*lines?$/i.test(s)
          && !/^[\d,–—-]+$/.test(s);
      });

    var seen = {};
    return [mech].concat(extras).filter(function (s) {
      var k = s.toLowerCase().replace(/[\s,]/g, "");
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    }).join(" / ");
  }

  function parseFolderName(name) {
    var m = name.match(/^([A-Za-z0-9]+)_(.+)$/);
    return m ? { id: m[1], name: m[2] } : { id: "", name: name };
  }

  /* game_rule.md 的表格列：| 遊戲類型 | Video Slot - 1,024 Ways / Cascade |
     另外抓「> 撰寫日期：2026-08-11」當備用排序依據 —
     API 額度用完時仍有個合理的時間可以排序。 */
  function fetchPlay(gameBase) {
    return fetchText(gameBase + "/game_rule.md").then(function (text) {
      if (!text) return { play: "", hasRule: false, docDate: 0 };
      var cell = function (label) {
        var m = text.match(new RegExp("\\|\\s*" + label + "\\s*\\|([^|\\n]*)\\|"));
        var v = m ? m[1].trim().replace(/^`|`$/g, "") : "";
        return (!v || v === "-") ? "" : v;
      };
      var d = text.match(/撰寫日期[：:]\s*(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      return {
        play: normalizePlay(cell("遊戲類型"), cell("中獎方式"), cell("最小 / 最大 Ways")),
        hasRule: true,
        docDate: d ? Date.UTC(+d[1], +d[2] - 1, +d[3]) : 0
      };
    });
  }

  // 版本號＝Versions/version_manifest.js 的 current，沒有就取 versions[] 裡最大的
  function cmpVersion(a, b) {
    var pa = a.split(".").map(Number), pb = b.split(".").map(Number);
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
      var d = (pa[i] || 0) - (pb[i] || 0);
      if (d) return d;
    }
    return 0;
  }
  function fetchVersion(gameBase) {
    return fetchText(gameBase + "/Versions/version_manifest.js").then(function (text) {
      if (!text) return "";
      var cur = text.match(/["']?current["']?\s*:\s*["']([\d.]+)["']/);
      if (cur) return cur[1];
      var all = [];
      var re = /["']?version["']?\s*:\s*["']([\d.]+)["']/g, m;
      while ((m = re.exec(text))) all.push(m[1]);
      return all.length ? all.sort(cmpVersion).pop() : "";
    });
  }

  /* 最後更新時間＝該遊戲資料夾的最後一筆 commit 時間。
     每款 1 次 API，結果快取 6 小時，避免每次進頁面都吃掉額度。 */
  var CACHE_KEY = "omniplay-game-dates";
  var CACHE_TTL = 24 * 60 * 60 * 1000;   // 拉長到 24 小時，少吃額度
  var dateCache = (function () {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      return (Date.now() - (c.at || 0) < CACHE_TTL) ? (c.dates || {}) : {};
    } catch (e) { return {}; }
  })();
  function saveDateCache() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), dates: dateCache }));
    } catch (e) { /* localStorage 不可用就算了 */ }
  }
  var rateLimited = false;   // 一旦碰到額度上限就別再打，省下後續必然失敗的請求

  function fetchUpdated(folder) {
    if (folder in dateCache) return Promise.resolve(dateCache[folder]);
    if (rateLimited) return Promise.resolve(0);
    var path = SLOTS_PATH + "/" + folder;
    return fetchJson(API_BASE + "/commits?path=" + encodeURIComponent(path) + "&per_page=1")
      .then(function (arr) {
        var ts = (arr && arr[0]) ? (Date.parse(arr[0].commit.committer.date) || 0) : 0;
        dateCache[folder] = ts; saveDateCache();
        return ts;
      })
      .catch(function (e) {
        if (e && e.rateLimited) { rateLimited = true; return 0; }
        dateCache[folder] = 0; saveDateCache();
        return 0;
      });
  }

  /* 一次取回所有遊戲的更新時間。
     先探第一款確認額度還在，再平行抓其餘 —— 若一開始就打平行，
     rateLimited 旗標會來不及生效，額度用完時會白打每一款。
     全部命中快取時 fetchUpdated 立即回傳，不會多一趟延遲。 */
  function fetchDates(folders) {
    var out = {};
    if (!folders.length) return Promise.resolve(out);
    return fetchUpdated(folders[0]).then(function (ts) {
      out[folders[0]] = ts;
      var rest = folders.slice(1);
      if (rateLimited) { rest.forEach(function (f) { out[f] = 0; }); return out; }
      return Promise.all(rest.map(function (f) {
        return fetchUpdated(f).then(function (t) { out[f] = t; });
      })).then(function () { return out; });
    });
  }

  /* 最後一次成功掃到的遊戲清單。API 額度用完時拿它頂著，
     總比讓整個 Demogame 區變空白好。 */
  var LIST_KEY = "omniplay-games";
  var LIST_TTL = 24 * 60 * 60 * 1000;
  function saveGameList(games) {
    try { localStorage.setItem(LIST_KEY, JSON.stringify({ at: Date.now(), games: games })); }
    catch (e) {}
  }
  function cachedGameList() {
    try {
      var c = JSON.parse(localStorage.getItem(LIST_KEY) || "{}");
      if (!c.games || !c.games.length) return null;
      if (Date.now() - (c.at || 0) > LIST_TTL) return null;
      return c.games;
    } catch (e) { return null; }
  }

  /* ---------- Demogame ---------- */
  /* 直接用 <branch>:<path> 形式的 tree ref 一次取回整棵 Slots 子樹（1 次 API）。
     萬一這個寫法失效，退回原本「先查 Project 目錄拿 sha、再取 tree」的兩次呼叫。 */
  function fetchSlotsTree() {
    var ref = encodeURIComponent("main:" + SLOTS_PATH);
    return fetchJson(API_BASE + "/git/trees/" + ref + "?recursive=1")
      .catch(function (e) {
        if (e && e.rateLimited) throw e;
        return fetchJson(API_BASE + "/contents/Project").then(function (proj) {
          var slots = proj.filter(function (i) { return i.type === "dir" && i.name === "Slots"; })[0];
          if (!slots) throw new Error("找不到 Slots 目錄");
          return fetchJson(API_BASE + "/git/trees/" + slots.sha + "?recursive=1");
        });
      });
  }

  function loadGames() {
    return fetchSlotsTree()
      .then(function (tree) {
        var nodes = tree.tree || [];
        if (tree.truncated) notes.push("GitHub 目錄樹過大被截斷，Demogame 清單可能不完整");

        // 只取頂層「代號_名稱」資料夾（中文開頭的 其他/ 因此自動排除）
        var folders = nodes.filter(function (n) {
          return n.type === "tree" && /^[A-Za-z0-9]+_[^/]+$/.test(n.path);
        }).map(function (n) { return n.path; });

        /* 整棵樹已經在手上，所以 demo／版本檔／封面圖在不在都直接從樹判斷，
           不必先打再看 404 — 省下多餘請求，也不會在 console 留紅字 */
        var hasDemo = {}, hasManifest = {}, hasCover = {};
        nodes.forEach(function (n) {
          var m = n.path.match(/^([A-Za-z0-9]+_[^/]+)\/index\.html$/);
          if (m) { hasDemo[m[1]] = true; return; }
          m = n.path.match(/^([A-Za-z0-9]+_[^/]+)\/Versions\/version_manifest\.js$/);
          if (m) { hasManifest[m[1]] = true; return; }
          m = n.path.match(/遊戲資源\/([A-Za-z0-9]+)\.png$/);
          if (m) hasCover[m[1]] = true;
        });

        // 先把免費的 Pages 檔案平行抓完（game_rule.md、version_manifest.js），
        // 再單獨處理要吃 API 額度的更新時間
        return Promise.all([
          Promise.all(folders.map(function (folder) {
            var gameBase = PAGES_BASE + "/" + SLOTS_PATH + "/" + encodeURIComponent(folder);
            return Promise.all([
              fetchPlay(gameBase),
              hasManifest[folder] ? fetchVersion(gameBase) : Promise.resolve("")
            ]);
          })),
          fetchDates(folders)
        ]).then(function (res) {
          var statics = res[0], dates = res[1];
          return folders.map(function (folder, i) {
            var info = parseFolderName(folder);
            var gameBase = PAGES_BASE + "/" + SLOTS_PATH + "/" + encodeURIComponent(folder);
            var rule = statics[i][0], version = statics[i][1], ts = dates[folder] || 0;
            return {
              folder: folder, id: info.id, name: info.name,
              play: rule.play, version: version,
              // 有 commit 時間就用它；額度用完時退回 game_rule.md 的撰寫日期
              updated: ts || rule.docDate || 0,
              exactDate: !!ts,
              hasDemo: !!hasDemo[folder],
              playUrl: gameBase + "/",
              coverUrl: hasCover[info.id]
                ? COVER_BASE + "/" + encodeURIComponent(info.id) + ".png" : "",
              ruleUrl: rule.hasRule
                ? BLOB_BASE + "/" + SLOTS_PATH + "/" + encodeURIComponent(folder) + "/game_rule.md"
                : ""
            };
          });
        });
      })
      .then(function (games) {
        // 最新更新的放前面；沒有時間的沉到最後
        games.sort(function (a, b) {
          return (b.updated || 0) - (a.updated || 0) || a.id.localeCompare(b.id);
        });
        if (games.some(function (g) { return !g.exactDate; }) && rateLimited) {
          notes.push("API 額度用完，Demogame 的排序改用 game_rule.md 的撰寫日期");
        }
        saveGameList(games);
        return games;
      })
      .catch(function (err) {
        // 目錄都拿不到時，退回上次成功掃到的清單，不要整區變空白
        var stale = cachedGameList();
        if (stale) {
          notes.push(err.rateLimited
            ? "GitHub API 額度用完（每小時 60 次、同一 IP 共用），Demogame 顯示的是上次的清單"
            : "Demogame 掃描失敗（" + err.message + "），顯示上次的清單");
          return stale;
        }
        notes.push(err.rateLimited
          ? "GitHub API 額度用完（每小時 60 次、同一 IP 共用），稍後重新整理即可"
          : "Demogame 掃描失敗（" + err.message + "）");
        return [];
      });
  }

  /* ---------- 分析報告：解析 Project/競品分析/README.md 的表格 ---------- */
  function parseAnalysisReadme(text) {
    var out = { byFile: {}, rtp: {}, official: {} };
    var lines = text.split(/\r?\n/);
    var cells = function (line) {
      return line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|")
        .map(function (s) { return s.replace(/\*\*/g, "").trim(); });
    };
    var isRow = function (l) { return /^\s*\|/.test(l || ""); };

    for (var i = 0; i < lines.length; i++) {
      if (/^\s*\|\s*遊戲\s*\|/.test(lines[i])) {
        for (var j = i + 2; j < lines.length && isRow(lines[j]); j++) {
          var c = cells(lines[j]);
          var link = (c[5] || "").match(/\(([^)]+\.html)\)/);
          if (!link) continue;
          out.byFile[link[1]] = { name: c[0], vendor: c[1], spins: c[2], date: c[3] };
        }
      }
      if (/^\s*\|\s*指標\s*\|/.test(lines[i])) {
        var cols = cells(lines[i]).slice(1);
        for (var k = i + 2; k < lines.length && isRow(lines[k]); k++) {
          var r = cells(lines[k]);
          var label = r[0], vals = r.slice(1);
          if (label === "總 RTP") cols.forEach(function (g, n) { out.rtp[g] = vals[n]; });
          if (label === "官方 RTP") cols.forEach(function (g, n) { out.official[g] = vals[n]; });
        }
      }
    }
    return out;
  }

  function analysisDesc(info, meta) {
    var p = [], rtp = meta.rtp[info.name], off = meta.official[info.name];
    if (rtp && rtp !== "⏳") p.push("總 RTP " + rtp + (off && off !== "⏳" ? "／官方 " + off : ""));
    if (info.spins) p.push("付費轉 " + info.spins);
    return p.join("，");
  }

  function loadAnalysis() {
    return Promise.all([fetchJson(ANALYSIS_API), fetchText(ANALYSIS_BASE + "/README.md")])
      .then(function (res) {
        var meta = parseAnalysisReadme(res[1] || "");
        return res[0].filter(function (i) {
          return i.type === "file" && /^遊戲數據_.+\.html$/.test(i.name);
        }).map(function (f) {
          var info = meta.byFile[f.name] || {};
          if (!info.name) {
            info.name = f.name.replace(/^遊戲數據_/, "").replace(/\.html$/, "").replace(/_/g, " ");
            notes.push("README 未列出 " + info.name + "，卡片資訊從檔名推得");
          }
          return {
            title: info.name + " 遊戲數據",
            url: ANALYSIS_BASE + "/" + encodeURIComponent(f.name),
            cat: "analysis", game: info.vendor || "",
            desc: analysisDesc(info, meta), date: info.date || "",
            tags: info.vendor ? [info.vendor] : []
          };
        });
      })
      .catch(function (err) {
        notes.push(err.rateLimited
          ? "GitHub API 額度用完（每小時 60 次、同一 IP 共用），分析報告稍後重新整理即可"
          : "分析報告掃描失敗（" + err.message + "）");
        return [];
      });
  }

  /* ---------- 卡片渲染 ---------- */
  // 圖1 的遊戲卡
  function gameCard(g, isNew) {
    return '<div class="gcard">' +
      (isNew ? '<div class="ribbon"><span>NEW</span></div>' : '') +
      '<div class="gcover">' +
        // 沒有封面圖的遊戲直接只放佔位，不掛 <img>（不會產生失敗請求）
        (g.coverUrl
          ? '<img src="' + esc(g.coverUrl) + '" alt="" loading="lazy">'
          : '<span class="ph">🎰</span>') +
        (g.hasDemo ? '' : '<div class="no-demo">尚無 Demo</div>') +
      '</div>' +
      '<div class="gbody">' +
        '<div class="gtitle">' + esc(g.name) +
          (g.version ? '<span class="ver">' + esc(g.version) + '</span>' : '') +
        '</div>' +
        '<div class="gdesc">' + esc(g.play || '—') + '</div>' +
      '</div>' +
      '<div class="gfoot">' +
        (g.ruleUrl
          ? '<a class="btn btn-info" href="' + esc(g.ruleUrl) + '" target="_blank" rel="noopener noreferrer">遊戲資訊 <span class="ico">›</span></a>'
          : '<div class="btn disabled">無規則書</div>') +
        (g.hasDemo
          ? '<a class="btn btn-play" href="' + esc(g.playUrl) + '" target="_blank" rel="noopener noreferrer">開始遊玩 <span class="ico">🎮</span></a>'
          : '<div class="btn disabled">製作中</div>') +
      '</div>' +
    '</div>';
  }

  // 圖4 的一般卡；標題開頭已是代號時不重複顯示
  function listCard(it) {
    var ext = isExternal(it.url);
    var showGid = it.game && String(it.title || "").indexOf(it.game) !== 0;
    return '<a class="card ' + esc(it.cat) + '" href="' + esc(it.url) + '"' +
           (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
      '<div class="card-top">' +
        '<span class="badge ' + esc(it.cat) + '">' + esc(CAT_LABEL[it.cat] || it.cat) + '</span>' +
        (showGid ? '<span class="gid">' + esc(it.game) + '</span>' : '') +
        (ext ? '<span class="ext">外部連結 ↗</span>' : '') +
      '</div>' +
      '<h2>' + esc(it.title) + '</h2>' +
      (it.desc ? '<p>' + esc(it.desc) + '</p>' : '') +
      // 報告類才有日期（分析報告取 README 的「報告日期」、其他報告取 catalog.js 的 date）
      (it.date ? '<div class="card-date">更新 ' + esc(it.date) + '</div>' : '') +
    '</a>';
  }

  // 常用連結那種一列一個的連結卡
  function linkCard(l) {
    return '<a class="link-card" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer"' +
           (l.desc ? ' title="' + esc(l.desc) + '"' : '') + '>' +
      (l.game ? '<span class="lk-tag">' + esc(l.game) + '</span>' : '') +
      '<span class="lk-name">' + esc(l.title) + '</span>' +
      '<span class="arrow">→</span>' +
    '</a>';
  }

  // 清單模式：一列一筆，左側色條標分類
  function rowItem(it) {
    var ext = isExternal(it.url);
    var showGid = it.game && String(it.title || "").indexOf(it.game) !== 0;
    return '<a class="row ' + esc(it.cat) + '" href="' + esc(it.url) + '"' +
           (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
      (showGid ? '<span class="r-tag">' + esc(it.game) + '</span>' : '') +
      '<span class="r-title">' + esc(it.title) + '</span>' +
      (it.desc ? '<span class="r-desc">' + esc(it.desc) + '</span>' : '') +
      (it.date ? '<span class="r-meta">' + esc(it.date) + '</span>' : '') +
    '</a>';
  }

  // 遊戲轉成圖4 那種卡的資料形狀
  function gameAsItem(g) {
    return {
      title: (g.id ? g.id + " " + g.name : g.name), url: g.playUrl, cat: "demo",
      game: g.id, desc: g.play, date: g.updated ? new Date(g.updated).toISOString().slice(0, 10) : "",
      tags: g.version ? [g.version] : []
    };
  }

  function haystackOf(o) {
    return [o.title, o.name, o.id, o.game, o.desc, o.play, o.version, o.date,
            CAT_LABEL[o.cat], (o.tags || []).join(" ")].join(" ").toLowerCase();
  }

  return {
    CAT_LABEL: CAT_LABEL,
    notes: notes,
    esc: esc,
    loadGames: loadGames,
    loadAnalysis: loadAnalysis,
    gameCard: gameCard,
    listCard: listCard,
    linkCard: linkCard,
    rowItem: rowItem,
    gameAsItem: gameAsItem,
    haystackOf: haystackOf
  };
})();
