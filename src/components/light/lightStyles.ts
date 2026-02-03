/**
 * 浅色模式 CSS 样式
 */
export const lightStyles = `
  :root {
    /* --- LIGHT MODE: MORANDI (High-End Clean) --- */
    --app-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --bg-color: #EBF4F8; /* Foggy White */
    --bg-image: none;
    
    /* Shape */
    --r-lg: 24px;
    --r-md: 16px;
    --r-sm: 8px;
    --clip-shape: none;
    
    /* Depth */
    --dock-shadow: 0px 20px 40px rgba(17, 97, 107, 0.25);
    --dock-side-shadow: 6px 6px 0px #0D4A52, -6px 6px 0px #0D4A52;
    --card-shadow: 0 4px 16px rgba(17, 97, 107, 0.08);
    --btn-press-y: 6px;
    --border-width: 0px;
    --neon-tube-border: none;
    --neon-tube-glow: none;

    /* Colors */
    --text-primary: #11616B; /* Deep Teal */
    --text-secondary: #5A8F96;
    --text-tertiary: #DC8B70; /* Terracotta */

    /* Printer */
    --printer-main: #11616B;      
    --printer-dark: #0D4A52;      
    --printer-slot: #072F36; /* Deep dark teal for slot */     
    --printer-detail: rgba(255,255,255,0.2);
    --printer-backdrop: none;

    /* Keys & Inputs */
    --key-bg: #FFFFFF;
    --key-text: #11616B;
    --key-shadow: #98CCC6;
    
    --input-bg-price: #FEF7DC; /* Soft Cream Yellow */   
    --input-bg-amount: #E3F1F3; /* Soft Ice Blue */  
    --input-bg-count: #F3E5F5; /* Soft Lilac Purple */   
    --input-text: #11616B;
    --input-shadow: rgba(17, 97, 107, 0.08);
    --input-label: #7BBDB6;

    /* Buttons */
    --btn-main: #DC8B70; /* Terracotta */        
    --btn-shadow: #B56A50;
    --btn-text: #FFFFFF;
    --btn-gradient: none;
    --btn-border: none;

    /* Receipt */
    --receipt-bg: #FFFFFF;
    --receipt-border: none;
    --receipt-backdrop: none;
    --receipt-jagged-display: block;
    
    /* Unit Price */
    --up-bg: #F7FBFC;
    --up-border: dashed #7BBDB6;

    /* Themes */
    --theme-0: #DC8B70; 
    --theme-1: #11616B; 
    --theme-2: #7BBDB6; 
    --theme-3: #E6B9A8; 
    
    /* Badge */
    --badge-bg: #DC8B70;
    --badge-text: #FFFFFF;
  }

  /* Apply clip-path only in dark mode */
  body.dark-mode .printer-body, 
  body.dark-mode .print-btn, 
  body.dark-mode .receipt, 
  body.dark-mode .best-badge, 
  body.dark-mode .install-btn, 
  body.dark-mode .math-key {
    clip-path: var(--clip-shape);
  }

  /* Obsidian Glass Printer Effect (Dark Mode Only) */
  body.dark-mode .printer-body {
    border: var(--neon-tube-border);
    box-shadow: var(--neon-tube-glow), var(--dock-side-shadow);
    backdrop-filter: var(--printer-backdrop);
  }

  /* Neon Tube Effect on Paper Slot */
  body.dark-mode .paper-slot {
    border-bottom: 2px solid #B026FF;
    box-shadow: 0 0 8px #B026FF;
  }
  
  body.dark-mode .print-btn {
    background-image: var(--btn-gradient);
    border: var(--btn-border);
  }
  
  body.dark-mode .print-btn:active {
    transform: translate(2px, 2px);
    box-shadow: -2px -2px 0 var(--btn-shadow);
  }
  
  /* SHARP TEXT - NO GLOW */
  body.dark-mode .input-label,
  body.dark-mode .r-val,
  body.dark-mode .app-title, 
  body.dark-mode .action-btn {
    text-shadow: none !important;
  }
  
  /* Dark Mode Receipt - Glassy */
  body.dark-mode .receipt {
    backdrop-filter: var(--receipt-backdrop);
    box-shadow: 0 0 10px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5);
  }
  
  /* Ensure border color shows up in dark mode */
  body.dark-mode .receipt-band {
     display: none; /* Hide top band, use border instead */
  }
  
  /* Best badge sharp */
  body.dark-mode .best-badge {
    box-shadow: none;
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background-color: var(--bg-color);
    background-image: var(--bg-image);
    background-attachment: fixed;
    height: 100dvh;
    overflow: hidden;
    color: var(--text-primary);
    font-family: var(--app-font);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
  }

  /* --- Header --- */
  .header {
    padding: 16px 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }
  .app-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    text-transform: uppercase;
  }
  .header-actions {
    display: flex;
    gap: 10px;
  }
  .action-btn {
    font-size: 13px;
    color: var(--text-secondary);
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: var(--r-md);
    border: var(--border-width) solid var(--text-secondary); 
    cursor: pointer;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.2s;
    font-family: var(--app-font);
  }
  .action-btn:active { transform: scale(0.95); }
  .install-btn {
    background: var(--btn-main);
    color: var(--btn-text);
    border-color: var(--btn-main);
  }

  /* --- Output Area --- */
  .paper-stream {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    padding-bottom: 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scrollbar-width: none; 
    -ms-overflow-style: none;
  }
  .paper-stream::-webkit-scrollbar { display: none; }
  
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    gap: 16px;
    margin-bottom: 40px;
  }
  .empty-icon {
    background: var(--receipt-bg);
    padding: 20px;
    border-radius: var(--r-lg);
    box-shadow: var(--card-shadow);
    border: var(--border-width) solid var(--text-secondary);
  }

  /* --- Receipt Card --- */
  .receipt {
    position: relative;
    background: var(--receipt-bg);
    border-radius: var(--r-md);
    border: var(--receipt-border);
    padding: 0; 
    box-shadow: var(--card-shadow);
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: bottom center;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Theme Classes */
  .theme-0 { --current-theme: var(--theme-0); }
  .theme-1 { --current-theme: var(--theme-1); }
  .theme-2 { --current-theme: var(--theme-2); }
  .theme-3 { --current-theme: var(--theme-3); }

  /* Top Color Band */
  .receipt-band {
    height: 8px;
    width: 100%;
    background-color: var(--current-theme);
  }

  .receipt-content {
    padding: 16px 20px 20px;
  }

  /* Jagged Bottom */
  .receipt-jagged {
    display: var(--receipt-jagged-display);
    height: 12px;
    width: 100%;
    background: var(--receipt-bg);
    -webkit-mask-image: linear-gradient(45deg, transparent 50%, black 50%), linear-gradient(-45deg, transparent 50%, black 50%);
    -webkit-mask-size: 16px 16px;
    -webkit-mask-repeat: repeat-x;
    mask-image: linear-gradient(45deg, transparent 50%, black 50%), linear-gradient(-45deg, transparent 50%, black 50%);
    mask-size: 16px 16px;
    mask-repeat: repeat-x;
    margin-top: -1px;
  }
  
  /* Best Badge */
  .best-badge {
    background: var(--badge-bg);
    color: var(--badge-text);
    font-size: 11px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--r-sm);
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    margin-right: auto;
    font-family: var(--app-font);
  }

  @keyframes popIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }

  .receipt-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }
  .receipt-row:last-child { margin-bottom: 0; }

  .r-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
  }
  .r-val {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
  }
  .r-sub {
    font-size: 11px;
    color: var(--text-tertiary);
    font-weight: 600;
    margin-left: 6px;
  }

  .unit-price-display {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: var(--up-bg);
    padding: 10px 16px;
    margin: 12px -20px -8px;
    border-top: 1px var(--up-border);
    border-bottom: 1px var(--up-border); 
  }
  .up-val {
    font-size: 24px;
    font-weight: 800;
    margin-right: 4px;
    color: var(--current-theme);
  }
  .up-unit {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 600;
  }

  /* --- Printer Dock --- */
  .dock-wrapper {
    padding: 0 16px 24px;
    perspective: 1000px;
    z-index: 20;
  }

  .printer-body {
    background: var(--printer-main);
    border-radius: var(--r-lg);
    padding: 24px 16px 20px;
    position: relative;
    border: var(--border-width) solid var(--text-secondary); 
    
    /* 3D Box Shadow */
    box-shadow: 
      var(--dock-side-shadow),
      var(--dock-shadow);
      
    background-image: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.05) 100%);
  }

  /* --- Optimized Paper Slot --- */
  .paper-slot {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    width: 85%;
    height: 18px;
    background: var(--printer-dark);
    border-radius: var(--r-md) var(--r-md) 0 0;
    box-shadow: inset 0 -2px 6px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.05); 
    display: flex;
    align-items: flex-end; 
    justify-content: center;
    padding-bottom: 5px;
    z-index: 0;
  }
  
  /* The actual gap where paper comes out */
  .paper-slot::after {
    content: '';
    width: 90%;
    height: 6px;
    background: var(--printer-slot);
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(255,255,255,0.15);
    transition: all 0.3s ease;
  }

  /* Dark mode specific: Neon Glow in the slot */
  body.dark-mode .paper-slot::after {
    background: #B026FF;
    height: 3px;
    margin-bottom: 2px;
    box-shadow: 
      0 0 5px #B026FF,
      0 0 10px #B026FF;
    border-radius: 0;
  }

  .printer-detail-line {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: var(--printer-detail);
    border-radius: 2px;
  }

  .input-area {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }

  /* Left: Math Keypad */
  .math-pad {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 6px;
    width: 72px;
  }
  
  .math-key {
    background: var(--key-bg);
    border: var(--border-width) solid var(--key-text);
    border-radius: var(--r-sm);
    font-size: 18px;
    font-weight: 700;
    color: var(--key-text);
    box-shadow: 0 4px 0 var(--key-shadow); 
    cursor: pointer;
    transition: all 0.1s;
    font-family: var(--app-font);
  }
  .math-key:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 var(--key-shadow);
  }

  /* Center: Inputs */
  .inputs-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }

  .input-row {
    display: flex;
    gap: 8px;
  }

  .input-group {
    flex: 1;
    position: relative;
  }

  .input-label {
    position: absolute;
    top: 4px;
    left: 8px;
    font-size: 9px;
    font-weight: 700;
    color: var(--input-label);
    text-transform: uppercase;
    pointer-events: none;
    font-family: var(--app-font);
  }

  .pastel-input {
    width: 100%;
    height: 44px;
    border: var(--border-width) solid var(--input-text);
    border-radius: var(--r-md);
    padding: 14px 8px 2px; 
    font-size: 15px;
    font-weight: 700;
    color: var(--input-text);
    outline: none;
    transition: transform 0.1s, box-shadow 0.2s;
    box-shadow: inset 0 2px 4px var(--input-shadow);
    text-align: left;
    font-family: var(--app-font);
  }
  .pastel-input:focus {
    box-shadow: inset 0 2px 4px var(--input-shadow), 0 0 0 2px var(--input-label);
    transform: translateY(-1px);
  }
  
  .bg-price { background: var(--input-bg-price); }
  .bg-amount { background: var(--input-bg-amount); }
  .bg-count { background: var(--input-bg-count); color: #11616B; text-align: center; }
  @media (prefers-color-scheme: dark) {
      .bg-count { color: var(--input-text); } 
  }

  /* Right: 3D Action Button */
  .print-btn {
    width: 68px;
    height: auto; 
    background: var(--btn-main);
    border: var(--border-width) solid var(--btn-text);
    border-radius: var(--r-lg);
    color: var(--btn-text);
    cursor: pointer;
    position: relative;
    
    box-shadow: 
      0px var(--btn-press-y) 0px var(--btn-shadow),
      0px 8px 10px rgba(0,0,0,0.2);
    
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
    margin-bottom: 6px;
  }
  
  .print-btn:active, .print-btn.animate {
    transform: translateY(var(--btn-press-y));
    box-shadow: 
      0px 0px 0px var(--btn-shadow),
      inset 0px 2px 4px rgba(0,0,0,0.2);
  }

  .print-btn:disabled {
    filter: grayscale(0.8) opacity(0.7);
  }
`;
