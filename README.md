# Jumbo Output

工作上 Output 出去的網頁索引站。首頁 `index.html` 是目錄，卡片點進去開對應網頁。

## 目錄結構

```
index.html      索引首頁（搜尋 + 分類篩選）
catalog.js      收錄清單 — 要新增／修改項目只改這個檔案
reports/        站內託管的遊戲數據報告 HTML
analysis/       站內託管的競品分析 HTML
games/          站內託管的 Demo Game（目前空的，demo 以外部連結收錄）
.nojekyll       讓 GitHub Pages 原樣輸出，不跑 Jekyll
```

## 新增一筆項目

編輯 `catalog.js`，在陣列裡加一個物件：

```js
{
  title: "H016 幸運王牌 Demo",
  url: "https://example.com/h016/",   // 外部網址，或站內相對路徑
  cat: "demo",                        // demo | report | analysis
  game: "H016",                       // 選填
  desc: "一行說明",                    // 選填
  date: "2026-08-27",                 // 選填，用於排序
  tags: ["Demo", "5x4"]               // 選填
}
```

- `url` 以 `http://` 或 `https://` 開頭時，卡片會標示「外部連結 ↗」並開新視窗。
- 其餘視為站內相對路徑，檔案要一起放進倉庫。
- 清單依 `date` 由新到舊排序。

## 本機預覽

直接用瀏覽器開 `index.html` 即可（`catalog.js` 用 `<script src>` 載入，不受 file:// 的 CORS 限制）。

## 部署

推到 `main` 後，於 GitHub 倉庫 Settings → Pages 選擇 `main` / `/ (root)`，
網址為 `https://rhino-boss.github.io/Jumbo_Output/`。

> 注意：GitHub 免費方案的 Pages 僅支援公開倉庫。倉庫轉為公開後，倉庫內所有檔案
> 都會對外公開，請確認放進來的內容不含不宜外流的資料（例如遊戲的 `config.js`
> 數學模型、`game_rule.md` 內部規則書）。目前 demo 一律以外部連結收錄，
> 不把這類檔案放進本倉庫。
