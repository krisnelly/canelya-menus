export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.app{min-height:100vh;background:#faf6ef;color:#1a1208;font-family:'DM Sans',sans-serif}
.hdr{background:#3d1f00;border-bottom:4px solid #c8941f;padding:18px 32px;display:flex;align-items:center;gap:14px}
.logo{width:40px;height:40px;background:#c8941f;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px}
.hdr h1{font-family:'Playfair Display',serif;font-size:19px;color:#ffffff}
.hdr p{font-size:11px;color:#f0d699;text-transform:uppercase;letter-spacing:.08em}
.main{max-width:1080px;margin:0 auto;padding:28px 20px}
.tabs{display:flex;gap:4px;background:#3d1f00;border-radius:10px;padding:4px;margin-bottom:22px}
.tab{flex:1;padding:9px;border-radius:7px;border:none;background:transparent;color:#f0d699;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500}
.tab.on{background:#c8941f;color:#1a1208;font-weight:700}
.tab:disabled{opacity:.35;cursor:not-allowed}
.bdg{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;background:#c8941f;color:#1a1208;border-radius:50%;font-size:10px;margin-left:5px;font-weight:700}
.card{background:#ffffff;border:1px solid #b88a2e;border-radius:14px;padding:22px;margin-bottom:16px;box-shadow:0 3px 14px rgba(61,31,0,.14)}
.ct{font-family:'Playfair Display',serif;font-size:16px;color:#3d1f00;margin-bottom:16px;border-bottom:2px solid #c8941f;padding-bottom:8px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
label{display:block;font-size:11px;color:#5a3a16;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;font-weight:700}
select,input[type=number],input[type=text],input[type=time],input[type=date]{width:100%;background:#ffffff;border:2px solid #b88a2e;border-radius:8px;color:#1a1208;padding:10px 13px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;appearance:none}
select:focus,input:focus{border-color:#3d1f00;box-shadow:0 0 0 3px rgba(200,148,31,.28)}
.jg{display:flex;gap:8px;flex-wrap:wrap}
.jb{padding:7px 15px;border-radius:8px;border:2px solid #b88a2e;background:#ffffff;color:#5a3a16;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600}
.jb.on{background:#3d1f00;border-color:#3d1f00;color:#ffffff;font-weight:700}
.pb{padding:10px 8px;border-radius:10px;border:2px solid #b88a2e;background:#ffffff;color:#5a3a16;font-size:12px;cursor:pointer;text-align:center;font-family:'DM Sans',sans-serif;font-weight:600}
.pb em{font-size:16px;display:block;margin-bottom:3px;font-style:normal}
.pb.on{background:#3d1f00;border-color:#3d1f00;color:#ffffff}
.prest-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #e3cfa0}
.prest-row:last-child{border-bottom:none}
.prest-btn{flex:0 0 190px;padding:9px;border-radius:9px;border:2px solid #b88a2e;background:#ffffff;color:#5a3a16;font-size:12px;cursor:pointer;text-align:center;font-family:'DM Sans',sans-serif;font-weight:600}
.prest-btn em{font-size:15px;display:block;margin-bottom:2px;font-style:normal}
.prest-btn.on{background:#3d1f00;border-color:#3d1f00;color:#ffffff;font-weight:700}
.steps{display:flex;margin-bottom:24px;border-radius:12px;overflow:hidden;border:2px solid #b88a2e}
.step{flex:1;padding:11px 8px;text-align:center;font-size:12px;color:#5a3a16;background:#fbf3e6;border-right:1px solid #b88a2e;cursor:pointer;font-weight:600}
.step:last-child{border-right:none}
.step.on{background:#3d1f00;color:#ffffff;font-weight:700}
.step.done{background:#185c18;color:#ffffff}
.step-num{display:block;font-size:16px;margin-bottom:2px}
.btn-g{width:100%;padding:13px;background:#3d1f00;color:#ffffff;border:none;border-radius:12px;font-size:15px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer}
.btn-g:hover{background:#5a2e00}
.btn-g:disabled{opacity:.4;cursor:not-allowed}
.btn-s{padding:8px 16px;background:transparent;color:#3d1f00;border:2px solid #b88a2e;border-radius:8px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:700}
.btn-n{padding:8px 16px;background:transparent;color:#5a3a16;border:2px solid #c8a96e;border-radius:8px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600}
.btn-copy{padding:11px 20px;background:#8a5a1c;color:#ffffff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif}
.btn-word{padding:11px 20px;background:#185c18;color:#ffffff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif}
.btn-wa{padding:11px 20px;background:#1ba952;color:#ffffff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.btn-del{padding:6px 11px;background:transparent;color:#9e1414;border:2px solid #9e1414;border-radius:6px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:700}
.row-btns{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}
.rh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:12px}
.rt{font-family:'Playfair Display',serif;font-size:22px;color:#3d1f00}
.rs{font-size:12px;color:#5a3a16;margin-top:4px;font-weight:600}
.tw{overflow-x:auto;border-radius:12px;border:2px solid #b88a2e;margin-bottom:16px}
table.mt{width:100%;border-collapse:collapse}
table.mt th{background:#3d1f00;color:#f0d699;font-family:'Playfair Display',serif;font-size:12px;padding:11px 12px;text-align:center;border:1px solid #5a2e00;white-space:nowrap}
table.mt th.l{background:#6b4c2a;color:#fdf9f4;text-align:left;font-size:11px;text-transform:uppercase}
table.mt td{padding:9px 12px;border:1px solid #e3cfa0;font-size:12px;line-height:1.5;vertical-align:middle}
table.mt td.sec{background:#3d1f00;color:#f0d699;font-weight:700;border-left:4px solid #c8941f;text-align:center;white-space:nowrap;font-size:11px}
table.mt td.sub{background:#fbf3e6;color:#5a3a16;font-size:11px;padding-left:14px;white-space:nowrap;font-weight:700}
table.mt td.val{background:#ffffff;color:#1a1208;text-align:center;cursor:pointer}
table.mt td.val:hover{background:#fbe6cf;outline:2px solid #c8941f}
table.mt td.editing{background:#fbf3e6;padding:6px}
.cell-ta{width:100%;background:#ffffff;border:2px solid #b88a2e;border-radius:6px;color:#1a1208;padding:6px;font-size:12px;font-family:'DM Sans',sans-serif;resize:vertical;min-height:36px;outline:none}
.cell-acts{display:flex;gap:6px;margin-top:4px;justify-content:flex-end}
.btn-ok{padding:4px 12px;background:#3d1f00;color:#ffffff;border:none;border-radius:5px;font-size:11px;cursor:pointer;font-weight:700;font-family:'DM Sans',sans-serif}
.btn-x{padding:4px 10px;background:transparent;color:#5a3a16;border:2px solid #b88a2e;border-radius:5px;font-size:11px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600}
.regen-j{padding:3px 8px;background:#185c18;color:#ffffff;border:none;border-radius:5px;font-size:10px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:700;display:block;margin:4px auto 0;width:90%}
.kv{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e3cfa0;font-size:12px}
.kv:last-child{border-bottom:none}
.kv-k{color:#5a3a16;font-weight:700}
.kv-v{color:#1a1208;font-weight:700;text-align:right;max-width:60%}
.inf{background:#e2f0e2;border:2px solid #185c18;border-radius:11px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#0f3d0f;font-weight:600}
.warn{background:#fdeccd;border:2px solid #b88a2e;border-radius:11px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#6b4310;font-weight:600}
.hi{display:flex;justify-content:space-between;align-items:center;padding:12px 15px;border-bottom:1px solid #e3cfa0;font-size:13px}
.hi:last-child{border-bottom:none}
.hid{color:#5a3a16;font-size:12px;margin-top:3px;font-weight:600}
.hic{color:#3d1f00;font-weight:700}
.empty{text-align:center;padding:36px;color:#5a3a16;font-size:14px;font-weight:600}
.tag-a{background:#9e1414;color:#ffffff;border-radius:6px;padding:2px 8px;font-size:10px;margin-left:6px;font-weight:700}
.tag-p{background:#185c18;color:#ffffff;border-radius:6px;padding:2px 8px;font-size:10px;margin-left:6px;font-weight:700}
@media(max-width:600px){.g2,.g3{grid-template-columns:1fr}.hdr{padding:14px 18px}.main{padding:20px 14px}.prest-btn{flex:0 0 150px}}
`;
