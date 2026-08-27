# Jumbo Output

工作上 Output 出去的網頁索引站。首頁 `index.html` 是目錄，卡片點進去開對應網頁。

## 目錄結構

```
index.html      索引首頁（搜尋 + 分類下拉）
catalog.js      靜態收錄清單 — 手動加的項目改這個檔案
assets/         favicon（藍底白 J，沿用 Cworld 那顆 C 的樣式）
reports/        站內託管的遊戲數據報告 HTML
analysis/       站內託管的競品分析 HTML
games/          預留；demo 目前全部走自動掃描，不放檔案
.nojekyll       讓 GitHub Pages 原樣輸出，不跑 Jekyll
```

## 三種分類

分類篩選是一顆按鈕，點開選單選擇：**全部分類 / Demo Game / 遊戲數據報告 / 競品分析**，
選單右側顯示各分類目前筆數。

## Demo Game 是自動掃描的

首頁載入時會打 GitHub API 掃 `rhino-boss/Jumbo` 的 `Project/Slots`，
規則與 `Cworld/studio/demogame/index.html` 相同：

- 只取**頂層**符合 `代號_名稱` 的資料夾（中文開頭的 `其他/` 因此自動排除，
  連帶排除了「其他人的遊戲」與「未完成遊戲」）
- 該資料夾底下要有 `index.html` 才算有 demo，才會上架
- 連結為 `https://rhino-boss.github.io/Jumbo/Project/Slots/<資料夾>/`

**所以新增 demo 不需要動這個倉庫** — 在 Jumbo 專案裡建好 `H0xx_名稱/index.html`
並 push，這裡重新整理就會出現。

共 2 次 API 呼叫；未登入的 GitHub API 限制為每小時 60 次。掃描失敗時
首頁仍會正常顯示靜態項目，並在筆數旁標示失敗原因。

## 新增一筆靜態項目

編輯 `catalog.js`，在陣列裡加一個物件：

```js
{
  title: "H016 幸運王牌 RTP 診斷",
  url: "analysis/xxx.html",   // 站內相對路徑，或完整外部網址
  cat: "analysis",            // demo | report | analysis
  game: "H016",               // 選填
  desc: "一行說明",            // 選填
  date: "2026-08-27",         // 選填，用於排序
  tags: ["RTP", "診斷"]        // 選填
}
```

- `url` 以 `http://` 或 `https://` 開頭時，卡片會標示「外部連結 ↗」並開新視窗。
- 其餘視為站內相對路徑，檔案要一起放進倉庫。
- 清單依 `date` 由新到舊排序。手動加的 demo 網址若與自動掃描重複，會自動去重。

## 本機預覽

直接用瀏覽器開 `index.html`（`catalog.js` 以 `<script src>` 載入，不受 file:// 的 CORS 限制）。
Demo 自動掃描需要連得上 GitHub API。

## 部署

推到 `main` 後，於 Settings → Pages 選 `Deploy from a branch`、`main` / `/ (root)`，
網址為 `https://rhino-boss.github.io/Jumbo_Output/`。

> 注意：GitHub 免費方案的 Pages 僅支援公開倉庫，倉庫轉公開後所有檔案都會對外公開。
> 本倉庫只放索引與自包含的報告 HTML，不放遊戲的 `config.js` 數學模型。
> （`rhino-boss/Jumbo` 本身已是公開倉庫且已開啟 Pages，那些檔案目前已可公開取得。）
