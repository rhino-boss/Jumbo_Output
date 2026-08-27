# 老虎機遊戲試玩（Jumbo_Output）

工作成果的網頁索引站。首頁 `index.html` 是目錄，卡片點進去開對應網頁。

線上位址：<https://rhino-boss.github.io/Jumbo_Output/>

## 這個倉庫幾乎不放內容

兩個分類的內容**全部從 `rhino-boss/Jumbo` 自動掃描**，這裡只有索引本身：

```
index.html      索引首頁（搜尋 + 分類下拉）
catalog.js      手動收錄清單，平常是空的（只在要掛例外網頁時才寫）
assets/         favicon（深藍底白 J）
.nojekyll       讓 GitHub Pages 原樣輸出，不跑 Jekyll
```

| 分類 | 來源 | 連結指向 |
|---|---|---|
| Demogame | `Project/Slots/<代號_名稱>/index.html` | `rhino-boss.github.io/Jumbo/Project/Slots/<資料夾>/` |
| 競品分析 | `Project/競品分析/遊戲數據_*.html` | `rhino-boss.github.io/Jumbo/Project/競品分析/<檔名>` |

**所以新增內容不需要動這個倉庫** — 把檔案放進 Jumbo 專案對應位置並 push，
這裡重新整理就會出現。

## Demogame 怎麼掃

規則與 `Cworld/studio/demogame/index.html` 相同：

- 只取 `Project/Slots` 底下**頂層**符合 `代號_名稱` 的資料夾
  （中文開頭的 `其他/` 因此自動排除，連帶排除「其他人的遊戲」與「未完成遊戲」）
- 該資料夾底下要有 `index.html` 才算有 demo，才會上架

卡片說明顯示**遊戲類型**，讀該遊戲的 `game_rule.md` 後正規化成
`Cluster Pay / Pay Anywhere / N Ways / N Lines`（＋Cascade 等額外特色），
邏輯與 Cworld 的 `normalizePlay` 相同。例如：

```
H016 幸運王牌       → 1,024 Ways / Cascade / Cascade Multiplier
H026 彩罐熱舞 1000  → 20 Lines / Cascade
H028 雷神爆金 1000  → 2,025–32,400 Ways / Megaways / Cascade
```

## 競品分析怎麼掃

列出 `Project/競品分析/` 底下的 `遊戲數據_*.html`（`索引.html` 不收），
再讀同資料夾的 **`README.md`**，解析裡面兩張表格填卡片資訊：

- 表一「| 遊戲 | 廠商 | 付費轉 | 報告日期 | … | 報告 |」→ 標題、廠商、付費轉、日期
- 表二「| 指標 | <遊戲名>… |」的 `總 RTP` 與 `官方 RTP` 兩列 → 說明裡的 RTP

產出的卡片長這樣：

```
[JILI] Super Ace 遊戲數據
       總 RTP 94.158%／官方 96.50%，付費轉 166,050        2026-08-26
```

官方 RTP 是 `⏳` 時會自動省略該段。README 沒列到的檔案仍會上架，
標題從檔名反推，並在筆數旁提示。

> 因此**維護 `Project/競品分析/README.md` 的表格，就等於維護這個站的卡片內容**。

## API 用量

GitHub API 共 3 次呼叫（未登入限每小時 60 次）：

```
/contents/Project                    找 Slots 的 tree sha
/git/trees/<sha>?recursive=1         一次抓整棵 Slots 子樹
/contents/Project/競品分析            列出競品報告
```

`game_rule.md` 與競品分析的 `README.md` 都是同源的 Pages 靜態檔，不吃 API 額度。
任一邊掃描失敗時，另一邊仍正常顯示，並在筆數旁標示失敗原因。

## 分類篩選

一顆按鈕，點開選單選擇：**全部分類 / Demogame / 競品分析**，
選單右側顯示各分類筆數，按鈕左側色點跟著選取分類變色。支援點外部與 Esc 關閉。

**進站預設顯示 Demogame**（`index.html` 裡的 `DEFAULT_CAT`）。
兩邊都還沒回來前顯示「正在載入清單…」，不會閃一下「沒有符合條件」。

## 視覺風格

沿用 Cworld 的設計語言，底色改為淺藍：頁面底 `#eef2f9`、白卡、
`0 2px 12px rgba(0,0,0,.07)` 柔和陰影（hover 換 `0 8px 32px rgba(0,0,0,.13)` 並上浮 3px）、
Helvetica Neue / PingFang TC 字族、海軍藍漸層 hero（`#2a3d5c → #3e6394`），
卡片頂端 3px 色條用 Cworld 的粉彩標分類：

| 分類 | 色條 |
|---|---|
| Demogame | `--accent-4` `#d4cba8`（沙） |
| 競品分析 | `--accent-1` `#d4a8a8`（玫瑰） |

沒有做亮／深自動切換，是固定亮色。

卡片刻意做小（欄寬下限 268px、內距 16px、圓角 12px），
內容只有「分類標籤／標題／說明」三行，不顯示日期與標籤列 —
日期仍用於排序與搜尋，只是不占版面。

最上方那顆代號（`.gid`）只在**標題開頭不是它**時才顯示：
Demogame 的標題本來就是「H016 幸運王牌」，代號會重複所以自動隱藏；
競品分析的標題是「Super Ace 遊戲數據」，廠商（PG／PP／JILI）不在標題裡，照樣顯示。

favicon 是深藍 `#1b3a6b` 底白 J，字形幾何沿用 Cworld 那顆紅底 C
（64×64、`rx=14`、Helvetica Bold、`text-anchor:middle`），
`x/y` 依 Arial Bold 的實際字形範圍反推以視覺置中。因為它疊在海軍藍 hero 上
對比不足，hero 那顆 logo 加了 `box-shadow: 0 0 0 2px rgba(255,255,255,.32)` 描邊。

## 手動掛一個例外網頁

只有內容不在上面那兩個位置時才需要。編輯 `catalog.js`：

```js
window.CATALOG = [
  {
    title: "某份報告",
    url: "https://example.com/report.html",  // 完整外部網址，或站內相對路徑
    cat: "analysis",                         // demo | analysis
    game: "PG",                              // 選填
    desc: "一行說明",                         // 選填
    date: "2026-08-27",                      // 選填，用於排序
    tags: ["PG"]                             // 選填
  }
];
```

- `url` 以 `http://` 或 `https://` 開頭時，卡片標示「外部連結 ↗」並開新視窗。
- 清單依 `date` 由新到舊排序。
- 這裡寫的網址若與自動掃描到的相同，會自動去重（以手動的為準）。

## 本機預覽

直接用瀏覽器開 `index.html`。兩個分類都需要連得上網路才會有內容。

## 部署

推到 `main` 即自動部署（Settings → Pages：`Deploy from a branch`、`main` / `/ (root)`）。

> 這個倉庫是公開的，但因為內容全靠外部連結，倉庫裡實際只有索引與 favicon。
> 被連過去的檔案本來就在公開的 `rhino-boss/Jumbo` Pages 上。
