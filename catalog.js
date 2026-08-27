/* ============================================================
   Jumbo Output — 收錄清單
   ------------------------------------------------------------
   要新增一筆，就在下面陣列加一個物件。欄位說明：
     title   必填  卡片標題
     url     必填  站內相對路徑（例：reports/xxx.html）或完整外部網址（https://...）
     cat     必填  分類："demo" | "report" | "analysis"
     game    選填  遊戲代號，例 "H016"
     desc    選填  一行說明
     date    選填  "YYYY-MM-DD"，用於排序與顯示
     tags    選填  字串陣列
   ============================================================ */
window.CATALOG = [
  {
    title: "C027 奧林帕斯 2500 遊戲數據",
    url: "reports/C027_奧林帕斯2500_遊戲數據.html",
    cat: "report",
    game: "C027",
    desc: "自家遊戲模擬結果數據分析報告（RTP、Hit Rate、FG 週期、符號分布等）",
    date: "2026-08-20",
    tags: ["自家遊戲", "頁簽式報告"]
  },
  {
    title: "Gates of Olympus 1000 遊戲數據",
    url: "reports/Gates_of_Olympus_1000_遊戲數據.html",
    cat: "report",
    game: "C027",
    desc: "競品實機側錄封包數據分析報告",
    date: "2026-08-20",
    tags: ["競品", "側錄資料"]
  },
  {
    title: "H016 v8 vs 101003 vs Super Ace：92 老手調性比較",
    url: "analysis/H016_v8_vs_101003_92老手_調性比較.html",
    cat: "analysis",
    game: "H016",
    desc: "三方對照 92% 老手模式下的遊戲調性差異",
    date: "2026-08-17",
    tags: ["競品比較", "調性"]
  },
  {
    title: "H016 與 101003 RTP 差異診斷",
    url: "analysis/H016_vs_101003_RTP_差異診斷.html",
    cat: "analysis",
    game: "H016",
    desc: "拆解 H016 與 101003 之間 RTP 落差的來源",
    date: "2026-08-15",
    tags: ["RTP", "診斷"]
  },
  {
    title: "SPS 與 H016 special_symbol_cnt 差異診斷",
    url: "analysis/SPS_vs_H016_special_symbol_cnt_260817.html",
    cat: "analysis",
    game: "H016",
    desc: "比對特殊符號出現次數分布的差異",
    date: "2026-08-17",
    tags: ["符號分布", "診斷"]
  },
  {
    title: "H016 Index Hit Rate 偏低診斷",
    url: "analysis/H016_index_hit_rate_診斷_260814.html",
    cat: "analysis",
    game: "H016",
    desc: "分析 Index Hit Rate 偏低的成因",
    date: "2026-08-14",
    tags: ["Hit Rate", "診斷"]
  }
];
