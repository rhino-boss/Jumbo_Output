/* ============================================================
   Omniplay — 手動收錄清單
   ------------------------------------------------------------
   首頁分四區，其中兩區是自動掃描 rhino-boss/Jumbo、不用寫在這裡：

     Demogame  ← Project/Slots/<代號_名稱>/index.html
     分析報告   ← Project/競品分析/遊戲數據_*.html

   另兩區沒有自動掃描，項目全部寫在下面：

     其他報告   cat: "report"    機制說明、專題報告之類
     常用連結   cat: "links"     常用的內外部網頁

   欄位：
     title   必填  卡片標題
     url     必填  站內相對路徑或完整外部網址（https://...）
     cat     必填  "demo" | "analysis" | "report" | "links"
     game    選填  遊戲代號或廠商，例 "H016"、"PG"
     desc    選填  一行說明
     date    選填  "YYYY-MM-DD"，用於排序
     tags    選填  字串陣列

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
  }

  /* ---- 常用連結（待補）----
  ,{
    title: "某個常用網頁",
    url: "https://example.com/",
    cat: "links",
    desc: "一行說明"
  }
  */
];
