# Jumbo Output

工作上 Output 出去的網頁索引站。首頁 `index.html` 是目錄，卡片點進去開對應網頁。

線上位址：<https://rhino-boss.github.io/Jumbo_Output/>

## 目錄結構

```
index.html      索引首頁（搜尋 + 分類下拉）
catalog.js      靜態收錄清單 — 手動加的項目改這個檔案
assets/         favicon（藍底白 J，沿用 Cworld 那顆 C 的樣式）
analysis/       競品分析報告 HTML（Demogame 走自動掃描，不放檔案）
.nojekyll       讓 GitHub Pages 原樣輸出，不跑 Jekyll
```

## 視覺風格

沿用 Cworld 的設計語言：暖白底 `#f7f7f5`、白卡 16px 圓角、
`0 2px 12px rgba(0,0,0,.07)` 柔和陰影（hover 換 `0 8px 32px rgba(0,0,0,.13)` 並上浮 3px）、
Helvetica Neue / PingFang TC 字族、海軍藍漸層 hero（`#2a3d5c → #3e6394`），
卡片頂端 4px 色條用 Cworld 的四色粉彩標分類：

| 分類 | 色條 |
|---|---|
| Demogame | `--accent-4` `#d4cba8`（沙） |
| 競品分析 | `--accent-1` `#d4a8a8`（玫瑰） |

Cworld 本身沒有深色模式，所以這裡也是純亮色。

## 兩種分類

分類篩選是一顆按鈕，點開選單選擇：**全部分類 / Demogame / 競品分析**，
選單右側顯示各分類筆數，按鈕左側色點跟著選取分類變色。支援點外部與 Esc 關閉。

**進站預設顯示 Demogame**（`index.html` 裡的 `DEFAULT_CAT`）。掃描回來之前
會顯示「正在掃描 Demogame…」，不會閃一下「沒有符合條件」。

## Demogame 是自動掃描的

首頁載入時打 GitHub API 掃 `rhino-boss/Jumbo` 的 `Project/Slots`，
規則與 `Cworld/studio/demogame/index.html` 相同：

- 只取**頂層**符合 `代號_名稱` 的資料夾（中文開頭的 `其他/` 因此自動排除，
  連帶排除了「其他人的遊戲」與「未完成遊戲」）
- 該資料夾底下要有 `index.html` 才算有 demo，才會上架
- 連結為 `https://rhino-boss.github.io/Jumbo/Project/Slots/<資料夾>/`

**所以新增 Demogame 不需要動這個倉庫** — 在 Jumbo 專案裡建好 `H0xx_名稱/index.html`
並 push，這裡重新整理就會出現。

卡片說明顯示**遊戲類型**，來源是各遊戲的 `game_rule.md`，統一正規化成
`Cluster Pay / Pay Anywhere / N Ways / N Lines`（＋Cascade 等額外特色），
邏輯與 Cworld 的 `normalizePlay` 相同。例如：

```
H016 幸運王牌       → 1,024 Ways / Cascade / Cascade Multiplier
H026 彩罐熱舞 1000  → 20 Lines / Cascade
H028 雷神爆金 1000  → 2,025–32,400 Ways / Megaways / Cascade
```

GitHub API 共 2 次呼叫（未登入限每小時 60 次）；`game_rule.md` 是同源的 Pages
靜態檔，不吃 API 額度。掃描失敗時首頁仍會正常顯示靜態項目，並在筆數旁標示原因。

## 新增一筆競品分析

編輯 `catalog.js`，在陣列裡加一個物件：

```js
{
  title: "Super Ace 遊戲數據",
  url: "analysis/遊戲數據_Super_Ace.html",  // 站內相對路徑，或完整外部網址
  cat: "analysis",                          // demo | analysis
  game: "JILI",                             // 選填（遊戲代號或廠商）
  desc: "一行說明",                          // 選填
  date: "2026-08-26",                       // 選填，用於排序
  tags: ["JILI"]                            // 選填
}
```

- `url` 以 `http://` 或 `https://` 開頭時，卡片會標示「外部連結 ↗」並開新視窗。
- 其餘視為站內相對路徑，檔案要一起放進倉庫。
- 清單依 `date` 由新到舊排序。手動加的 demo 網址若與自動掃描重複，會自動去重。

## 競品數據報告的正本在哪

`analysis/遊戲數據_*.html` 是從 `工作區/Project/競品分析/` 複製過來的產出物，
**不要手改**。要更新內容：改各遊戲資料夾裡的 md 正本
（`市場資訊\H5\{廠商} - {遊戲名稱}\遊戲數據_{遊戲名稱}.md`），
重跑 `~/.claude/skills/game-data-report/scripts/build_html.py`，
覆蓋回 `Project/競品分析/`，再複製到這裡。

## 本機預覽

直接用瀏覽器開 `index.html`（`catalog.js` 以 `<script src>` 載入，不受 file:// 的 CORS 限制）。
Demogame 自動掃描與遊戲類型需要連得上網路。

## 部署

推到 `main` 即自動部署（Settings → Pages：`Deploy from a branch`、`main` / `/ (root)`）。

> 注意：GitHub 免費方案的 Pages 僅支援公開倉庫，倉庫轉公開後所有檔案都會對外公開。
> 本倉庫只放索引與自包含的報告 HTML，不放遊戲的 `config.js` 數學模型。
> （`rhino-boss/Jumbo` 本身已是公開倉庫且已開啟 Pages，那些檔案目前已可公開取得。）
