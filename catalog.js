/* ============================================================
   Jumbo Output — 收錄清單
   ------------------------------------------------------------
   要新增一筆，就在下面陣列加一個物件。欄位說明：
     title   必填  卡片標題
     url     必填  站內相對路徑（例：analysis/xxx.html）或完整外部網址（https://...）
     cat     必填  分類："demo" | "analysis"
     game    選填  遊戲代號或廠商，例 "H016"、"PG"
     desc    選填  一行說明
     date    選填  "YYYY-MM-DD"，用於排序與顯示
     tags    選填  字串陣列

   Demogame 不需要寫在這裡 — 首頁會自動掃描 rhino-boss/Jumbo 的 Project/Slots。
   ============================================================ */
window.CATALOG = [
  {
    title: "Super Ace 遊戲數據",
    url: "analysis/遊戲數據_Super_Ace.html",
    cat: "analysis",
    game: "JILI",
    desc: "總 RTP 94.158%／官方 96.50%，付費轉 166,050，FG 週期 1/118.5",
    date: "2026-08-26",
    tags: ["JILI", "Buy Feature"]
  },
  {
    title: "Lucky Neko 遊戲數據",
    url: "analysis/遊戲數據_Lucky_Neko.html",
    cat: "analysis",
    game: "PG",
    desc: "總 RTP 100.932%／官方 96.72%，付費轉 47,068，樣本偏高 +4.21pp",
    date: "2026-08-26",
    tags: ["PG"]
  },
  {
    title: "Pinata Wins 遊戲數據",
    url: "analysis/遊戲數據_Pinata_Wins.html",
    cat: "analysis",
    game: "PG",
    desc: "總 RTP 92.542%，付費轉 22,688，底注含 5x Ante",
    date: "2026-08-26",
    tags: ["PG", "Ante"]
  },
  {
    title: "Gates of Olympus 1000 遊戲數據",
    url: "analysis/遊戲數據_Gates_of_Olympus_1000.html",
    cat: "analysis",
    game: "PP",
    desc: "總 RTP 90.748%／官方 96.75%，付費轉 31,472，FG 平均 94.47x",
    date: "2026-08-26",
    tags: ["PP", "Buy Feature"]
  },
  {
    title: "Wild Bounty Showdown 遊戲數據",
    url: "analysis/遊戲數據_Wild_Bounty_Showdown.html",
    cat: "analysis",
    game: "PG",
    desc: "總 RTP 86.636%／官方 96.75%，付費轉 10,463，樣本量偏低",
    date: "2026-08-27",
    tags: ["PG"]
  }
];
