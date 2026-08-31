# Omniplay（Jumbo_Output）

工作成果的網頁索引站。線上位址：<https://rhino-boss.github.io/Jumbo_Output/>

## 檔案

```
index.html         首頁，分四區
games.html         Demogame 完整頁（全部遊戲＋排序＋清單／卡片切換）
catalog.js         手動收錄清單（其他報告、常用連結寫在這）
assets/style.css   兩頁共用樣式
assets/app.js      兩頁共用的資料載入與卡片渲染
assets/favicon.*   深藍底白 J
.nojekyll          讓 GitHub Pages 原樣輸出，不跑 Jekyll
```

## 首頁四區

| 區塊 | 色 | 來源 | 呈現 |
|---|---|---|---|
| Demogame | 藍 `#4a7fd0` | 自動掃描 `Project/Slots/<代號_名稱>/index.html` | 橫向軌道，一次 3 張，可左右滑動；可切清單 |
| 分析報告 | 紅 `#d9534f` | 自動掃描 `Project/競品分析/遊戲數據_*.html` | 卡片格 |
| 其他報告 | 琥珀 `#d9a13f` | `catalog.js` 的 `cat: "report"` | 卡片格 |
| 常用連結 | 綠 `#6b8f71` | `catalog.js` 的 `cat: "links"` | 卡片格（目前待補） |

區塊標題是帶色條的色底橫幅，搜尋框在最上方、一次過濾全部四區。

## Demogame

### 卡片內容

沿用 Cworld `studio/demogame` 的卡片：封面圖、NEW 緞帶、遊戲名＋版本號、
遊戲類型、底部兩顆按鈕。

- **封面** ← `Project/Slots/其他/遊戲資源/<代號>.png`；沒有就只放 🎰 佔位
  （目前 H027、H028 沒有封面圖）
- **版本號** ← `Versions/version_manifest.js` 的 `current`；沒這個檔就留空
  （目前只有 H016、H027、H028 有）
- **遊戲類型** ← `game_rule.md`，正規化成
  `Cluster Pay / Pay Anywhere / N Ways / N Lines`（＋Cascade 等），
  邏輯與 Cworld 的 `normalizePlay` 相同
- **遊戲資訊** → GitHub 上的 `game_rule.md`（會渲染 markdown）；沒有規則書就停用
- **開始遊玩** → demo 頁，開新視窗；沒有 `index.html` 的遊戲顯示「製作中」

封面圖與版本檔**在不在都直接從 Slots 子樹判斷**（那棵樹本來就抓了），
不會先打再看 404 — 所以 console 乾淨，也不浪費請求。

### 排序與 NEW

依**該遊戲資料夾的最後一筆 commit 時間**，最新的在前；同一天的用代號遞增。
NEW 緞帶固定掛在最新的 3 款（在 games.html 切換排序時也不變）。

### 橫向軌道

一次顯示 3 張（`flex: 0 0 calc((100% - 28px)/3)`），其餘左右滑動，
帶 `scroll-snap`。900px 以下 2 張、640px 以下 1 張。

### 全部顯示

右上角「全部顯示 →」進 `games.html`：全部遊戲、排序切換（更新時間／代號＋升降）、
清單／卡片切換、搜尋。排序與檢視模式記在 `localStorage`。

## 分析報告

列出 `Project/競品分析/` 的 `遊戲數據_*.html`（`索引.html` 不收），
再讀同資料夾的 **`README.md`** 解析兩張表格填卡片資訊：

- 表一「| 遊戲 | 廠商 | 付費轉 | 報告日期 | … | 報告 |」→ 標題、廠商、付費轉、日期
- 表二「| 指標 | <遊戲名>… |」的 `總 RTP` 與 `官方 RTP` → 說明裡的 RTP

官方 RTP 是 `⏳` 時自動省略該段。README 沒列到的檔案仍會上架，標題從檔名反推。

> **維護 `Project/競品分析/README.md` 的表格，就等於維護這區的卡片內容。**

## API 用量

未登入的 GitHub API 限每小時 60 次。首頁冷啟動用 10 次：

```
/contents/Project                  1   找 Slots 的 tree sha
/git/trees/<sha>?recursive=1       1   一次抓整棵 Slots 子樹
/contents/Project/競品分析          1   列出競品報告
/commits?path=<遊戲資料夾>          7   每款遊戲的最後更新時間
```

commit 時間快取在 `localStorage` 6 小時（key `omniplay-game-dates`），
所以重新整理或跳到 `games.html` 通常只花 2–3 次。
另有 11 次同源 Pages 靜態檔請求（7 份 `game_rule.md`、3 份 `version_manifest.js`、
1 份競品分析 `README.md`），不吃額度，且全部都會成功。
任一邊掃描失敗時其他區照常顯示，並在該區標示失敗原因。

## 新增內容

- **Demogame**：在 Jumbo 專案建 `Project/Slots/H0xx_名稱/index.html` 並 push
- **分析報告**：把報告放進 `Project/競品分析/`、更新該資料夾的 `README.md` 表格
- **其他報告／常用連結**：編輯這裡的 `catalog.js`

```js
window.CATALOG = [
  {
    title: "某個常用網頁",
    url: "https://example.com/",   // 完整外部網址，或站內相對路徑
    cat: "links",                  // demo | analysis | report | links
    game: "PG",                    // 選填
    desc: "一行說明",               // 選填
    date: "2026-08-28",            // 選填，用於排序
    tags: ["PG"]                   // 選填
  }
];
```

`url` 以 `http(s)://` 開頭時卡片標示「外部連結 ↗」並開新視窗。
手動項目的網址若與自動掃描到的相同會去重（以手動的為準）。

## 視覺風格

沿用 Cworld 的設計語言，底色改為淺藍：頁面底 `#eef2f9`、白卡、
`0 2px 12px rgba(0,0,0,.07)` 陰影（hover 換 `0 8px 32px rgba(0,0,0,.13)` 並上浮 3px）、
Helvetica Neue / PingFang TC 字族、海軍藍漸層 hero（`#2a3d5c → #3e6394`）。
固定亮色，沒有亮／深自動切換。

一般卡片（分析報告等）刻意做小：欄寬下限 268px、內距 16px、圓角 12px，
只有「分類標籤／標題／說明」三行，不顯示日期與標籤列 —
日期仍用於排序與搜尋，只是不占版面。卡片上的代號只在**標題開頭不是它**時才顯示。

favicon 是深藍 `#1b3a6b` 底白 J，字形幾何沿用 Cworld 那顆紅底 C
（64×64、`rx=14`、Helvetica Bold、`text-anchor:middle`），
`x/y` 依 Arial Bold 的實際字形範圍反推以視覺置中。因為它疊在海軍藍 hero 上
對比不足，hero 那顆 logo 加了 `box-shadow: 0 0 0 2px rgba(255,255,255,.32)` 描邊。

## 本機預覽

直接用瀏覽器開 `index.html`。內容需要連得上網路才會出現。

## 部署

推到 `main` 即自動部署（Settings → Pages：`Deploy from a branch`、`main` / `/ (root)`）。

> 這個倉庫是公開的，但內容全靠外部連結，倉庫裡只有索引、共用 CSS/JS 與 favicon。
> 被連過去的檔案本來就在公開的 `rhino-boss/Jumbo` Pages 上。
