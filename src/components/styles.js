// ── STYLES       GLOBAUX ─────────────────────────────────────────────────────────────
// Toute modification visuelle (couleurs, espacements, polices) se fait
// UNIQUEMENT ici. Aucun style inline ne devrait être ajouté dans les composants
// sauf cas ponctuel déjà existant (valeurs dynamiques calculées).
//
// Thème CLAIR (fond blanc) — anciennes valeurs du thème sombre laissées en
// commentaire au besoin pour référence rapide.

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.app{min-height:100vh;background:#ffffff;color:#2a2520;font-family:'DM Sans',sans-serif}
.hdr{background:#ffffff;border-bottom:1px solid #e8e2d8;padding:18px 32px;display:flex;align-items:center;gap:14px}
.logo{width:40px;height:40px;background:#c8a96e;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px}
.hdr h1{font-family:'Playfair Display',serif;font-size:19px;color:#2a2520}
.hdr p{font-size:11px;color:#9a8e7f;text-transform:uppercase;letter-spacing:.08em}
.main{max-width:1080px;margin:0 auto;padding:28px 20px}
.tabs{display:flex;gap:4px;background:#f5f0e8;border-radius:10px;padding:4px;margin-bottom:22px;border:1px solid #e8e2d8}
.tab{flex:1;padding:9px;border-radius:7px;border:none;background:transparent;color:#9a8e7f;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif}
.tab.on{background:#ffffff;color:#a8801f;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.tab:disabled{opacity:.35;cursor:not-allowed}
.bdg{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;background:#c8a96e22;color:#a8801f;border-radius:50%;font-size:10px;margin-left:5px}
.card{background:#ffffff;border:1px solid #e8e2d8;border-radius:14px;padding:22px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.ct{font-family:'Playfair Display',serif;font-size:15px;color:#a8801f;margin-bottom:16px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
label{display:block;font-size:11px;color:#9a8e7f;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
select,input[type=number],input[type=text],input[type=time],input[type=date]{width:100%;background:#ffffff;border:1px solid #d8d0c2;border-radius:8px;color:#2a2520;padding:10px 13px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;appearance:none}
select:focus,input:focus{border-color:#c8a96e}
.jg{display:flex;gap:8px;flex-wrap:wrap}
.jb{padding:7px 15px;border-radius:8px;border:1px solid #d8d0c2;background:#ffffff;color:#9a8e7f;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif}
.jb.on{background:#c8a96e22;border-color:#c8a96e;color:#a8801f}
.pb{padding:10px 8px;border-radius:10px;border:1px solid #d8d0c2;background:#ffffff;color:#9a8e7f;font-size:12px;cursor:pointer;text-align:center;font-family:'DM Sans',sans-serif}
.pb em{font-size:16px;display:block;margin-bottom:3px;font-style:normal}
.pb.on{background:#c8a96e22;border-color:#c8a96e;color:#a8801f}
.prest-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0ebe0}
.prest-row:last-child{border-bottom:none}
.prest-btn{flex:0 0 190px;padding:9px;border-radius:9px;border:1px solid #d8d0c2;background:#ffffff;color:#9a8e7f;font-size:12px;cursor:pointer;text-align:center;font-family:'DM Sans',sans-serif}
.prest-btn em{font-size:15px;display:block;margin-bottom:2px;font-style:normal}
.prest-btn.on{background:#c8a96e22;border-color:#c8a96e;color:#a8801f}
.steps{display:flex;margin-bottom:24px;border-radius:12px;overflow:hidden;border:1px solid #e8e2d8}
.step{flex:1;padding:11px 8px;text-align:center;font-size:12px;color:#9a8e7f;background:#f5f0e8;border-right:1px solid #e8e2d8;cursor:pointer}
.step:last-child{border-right:none}
.step.on{background:#c8a96e22;color:#a8801f}
.step.done{background:#e6f4ea;color:#3a8a52}
.step-num{display:block;font-size:16px;margin-bottom:2px}
.btn-g{width:100%;padding:13px;background:#c8a96e;color:#ffffff;border:none;border-radius:12px;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer}
.btn-g:disabled{opacity:.4;cursor:not-allowed}
.btn-s{padding:8px 16px;background:transparent;color:#a8801f;border:1px solid #c8a96e44;border-radius:8px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif}
.btn-n{padding:8px 16px;background:transparent;color:#9a8e7f;border:1px solid #d8d0c2;border-radius:8px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif}
.btn-copy{padding:11px 20px;background:#c8a96e;color:#ffffff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif}
.btn-word{padding:11px 20px;background:#2d6a2d;color:#ffffff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif}
.btn-wa{padding:11px 20px;background:#25D366;color:#ffffff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.btn-del{padding:6px 11px;background:transparent;color:#c0392b;border:1px solid #c0392b33;border-radius:6px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif}
.row-btns{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}
.rh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:12px}
.rt{font-family:'Playfair Display',serif;font-size:20px;color:#2a2520}
.rs{font-size:12px;color:#9a8e7f;margin-top:3px}
.tw{overflow-x:auto;border-radius:12px;border:1px solid #e8e2d8;margin-bottom:16px}
table.mt{width:100%;border-collapse:collapse}
table.mt th{background:#f5f0e8;color:#a8801f;font-family:'Playfair Display',serif;font-size:12px;padding:10px 12px;text-align:center;border:1px solid #e8e2d8;white-space:nowrap}
table.mt th.l{background:#ffffff;color:#9a8e7f;text-align:left;font-size:11px;text-transform:uppercase}
table.mt td{padding:8px 11px;border:1px solid #ece6da;font-size:12px;line-height:1.5;vertical-align:middle}
table.mt td.sec{background:#c8a96e1a;color:#a8801f;font-weight:700;border-left:4px solid #c8a96e;border-top:3px solid #c8a96e;border-bottom:3px solid #c8a96e;text-align:center;white-space:nowrap;font-size:11px}
table.mt td.sub{background:#faf7f1;color:#9a8e7f;font-size:11px;padding-left:14px;white-space:nowrap}
table.mt td.val{background:#ffffff;color:#2a2520;text-align:center;cursor:pointer}
table.mt td.val:hover{background:#f5f0e8;outline:1px solid #c8a96e66}
table.mt td.editing{background:#fdf8ee;padding:6px}
/* Bordure renforcee en debut de chaque nouvelle section (premiere ligne du groupe) */
table.mt tr:has(td.sec) td{border-top:3px solid #c8a96e}
.cell-ta{width:100%;background:#ffffff;border:1px solid #c8a96e;border-radius:6px;color:#2a2520;padding:6px;font-size:12px;font-family:'DM Sans',sans-serif;resize:vertical;min-height:36px;outline:none}
.cell-acts{display:flex;gap:6px;margin-top:4px;justify-content:flex-end}
.btn-ok{padding:4px 12px;background:#c8a96e;color:#ffffff;border:none;border-radius:5px;font-size:11px;cursor:pointer;font-weight:600;font-family:'DM Sans',sans-serif}
.btn-x{padding:4px 10px;background:transparent;color:#9a8e7f;border:1px solid #d8d0c2;border-radius:5px;font-size:11px;cursor:pointer;font-family:'DM Sans',sans-serif}
.regen-j{padding:3px 8px;background:#e6f4ea;color:#3a8a52;border:1px solid #c3e6cc;border-radius:5px;font-size:10px;cursor:pointer;font-family:'DM Sans',sans-serif;display:block;margin:4px auto 0;width:90%}
.kv{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0ebe0;font-size:12px}
.kv:last-child{border-bottom:none}
.kv-k{color:#9a8e7f}
.kv-v{color:#2a2520;font-weight:600;text-align:right;max-width:60%}
.inf{background:#e6f4ea;border:1px solid #c3e6cc;border-radius:11px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#2d6a2d}
.warn{background:#fdf0e0;border:1px solid #f0d4a8;border-radius:11px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#b06a10}
.hi{display:flex;justify-content:space-between;align-items:center;padding:11px 15px;border-bottom:1px solid #f0ebe0;font-size:13px}
.hi:last-child{border-bottom:none}
.hid{color:#9a8e7f;font-size:12px;margin-top:2px}
.hic{color:#a8801f;font-weight:500}
.empty{text-align:center;padding:36px;color:#9a8e7f;font-size:14px}
.tag-a{background:#fbeaea;color:#c0392b;border:1px solid #c0392b33;border-radius:6px;padding:2px 8px;font-size:10px;margin-left:6px}
.tag-p{background:#e6f4ea;color:#2d6a2d;border:1px solid #2d6a2d33;border-radius:6px;padding:2px 8px;font-size:10px;margin-left:6px}
@media(max-width:600px){.g2,.g3{grid-template-columns:1fr}.hdr{padding:14px 18px}.main{padding:20px 14px}.prest-btn{flex:0 0 150px}}
`;
