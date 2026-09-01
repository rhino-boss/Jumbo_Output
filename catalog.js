/* ============================================================
   Omniplay — 手動收錄清單
   ------------------------------------------------------------
   首頁分四區，其中兩區是自動掃描 rhino-boss/Jumbo、不用寫在這裡：

     Demogame  ← Project/Slots/<代號_名稱>/index.html
     競品分析   ← Project/競品分析/遊戲數據_*.html

   另兩區沒有自動掃描，項目全部寫在下面：

     其他報告   cat: "report"    機制說明、專題報告之類
     常用連結   cat: "links"     常用的內外部網頁

   欄位：
     title   必填  卡片標題
     url     必填  站內相對路徑或完整外部網址（https://...）
     cat     必填  "demo" | "analysis" | "report" | "links"
     game    選填  小標籤，用來分群，例 "Drive"、"Sheets"、"H016"、"PG"
     desc    選填  一行說明
     date    選填  "YYYY-MM-DD"。有日期的排前面（新到舊）；
                   沒日期的維持在這個檔案裡的順序
     tags    選填  字串陣列（目前卡片上不顯示，但可被搜尋）

   首頁每區只顯示前 4 筆，所以放在最前面的會是預設看到的那幾筆。
   要看全部請點該區的「完整頁 →」。

   demo / analysis 也可以手動加，用來掛「不在那兩個位置」的網頁；
   網址若與自動掃描到的相同會自動去重（以手動的為準）。
   ============================================================ */
window.CATALOG = [
  /* ---- 其他報告 ---- */
  {
    title: "老手救援 C 版 機制說明",
    url: "https://rhino-boss.github.io/Jumbo/Project/System/機制說明_老手救援C版.html",
    cat: "report",
    desc: "雙池救援機制：判定條件、50×／20× 救援獎項、遊戲歷程",
    date: "2026-08-28"
  },

  /* ---- 常用連結（順序即顯示順序，首頁只顯示前 4 個） ----
     TODO: 6ek7 要放在這一區的第一個，等網址補上後插在「線上遊戲資源」前面：
     { title: "6ek7", url: "https://…", cat: "links", game: "…", desc: "…" },
  */
  {
    title: "線上遊戲資源",
    url: "https://docs.google.com/spreadsheets/d/1DbJQoP7Wz7lEs2Osxj96YUGMs8lyrXZbwfnLEivAhKE/edit?gid=0#gid=0",
    cat: "links", game: "Sheets",
    desc: "已上線遊戲的資源清單"
  },
  {
    title: "雲端資料夾 — 專案",
    url: "https://drive.google.com/drive/u/0/folders/16zZoKJYt_Hz1srm1ZHNgSKucDp6LE4vg",
    cat: "links", game: "Drive",
    desc: "各專案的雲端資料"
  },
  {
    title: "雲端資料夾 — 送驗",
    url: "https://drive.google.com/drive/folders/0ABrNenAbZUCkUk9PVA",
    cat: "links", game: "Drive",
    desc: "送驗文件與報告"
  },
  {
    title: "測試環境 — Dev",
    url: "https://ghdev.jigaming.com.tw/login",
    cat: "links", game: "測試",
    desc: "開發測試站"
  },
  {
    title: "常用連結整理",
    url: "https://docs.google.com/spreadsheets/d/1WcNH7Mu_IDXAhMvzMX-LHEzyiusUkgLV4I2O-vN6XcY/edit?gid=1289038844#gid=1289038844",
    cat: "links", game: "Sheets",
    desc: "連結總表（這一區的來源）"
  },
  {
    title: "遊戲代號一覽",
    url: "https://docs.google.com/spreadsheets/d/1q1AzYQMf86_P2C-N5iFOUD8neyumS4vH_u1odIZzPvg/edit?gid=0#gid=0",
    cat: "links", game: "Sheets",
    desc: "iGaming 遊戲代號與 Game ID 對照"
  },
  {
    title: "HR 系統",
    url: "https://hr.jumbogames.com.tw/portal/40/default.aspx",
    cat: "links", game: "HR",
    desc: "差勤、假單、人事作業"
  },
  {
    title: "JIRA — OP 看板",
    url: "http://jira.jumbogames.com.tw:8080/secure/RapidBoard.jspa?rapidView=906&projectKey=OP&selectedIssue=OP-1568&quickFilter=1437",
    cat: "links", game: "JIRA",
    desc: "OP 專案的 Rapid Board"
  },
  {
    title: "Notion — 數學",
    url: "https://app.notion.com/p/Landbase-b4a57871c3e640098d5b78a16f223dd3?__dm_a=1",
    cat: "links", game: "Notion",
    desc: "Landbase 數學文件"
  },
  {
    title: "Notion — OP",
    url: "https://app.notion.com/p/285a24db19f180eab346f2a3f3dee4e7",
    cat: "links", game: "Notion",
    desc: "OP 相關文件"
  },
  {
    title: "雲端資料夾 — 規格書",
    url: "https://drive.google.com/drive/folders/1vWFwLBNDmsd5-1wZWqLGIsNwqGasAqT1",
    cat: "links", game: "Drive",
    desc: "遊戲規格書"
  },
  {
    title: "數學權限",
    url: "https://docs.google.com/spreadsheets/d/1rTGeitrRYsX0qnCXfEDGYLvAYGjcEwavRm5h3MOmigg/edit?gid=0#gid=0",
    cat: "links", game: "Sheets",
    desc: "數學相關的權限對照表"
  },
  {
    title: "測試環境 — Club",
    url: "https://jiclub.jigaming777.com/login",
    cat: "links", game: "測試",
    desc: "Club 測試站"
  }
];
