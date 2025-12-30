/**
 * 深色模式 CSS 样式
 */
export const darkStyles = `
  .dark-cyber-app {
    background: radial-gradient(circle at 50% 30%, #1a1a2e, #050505);
    color: #e8ecff;
    font-family: 'JetBrains Mono', Consolas, monospace;
  }
  html {
    background: #050505;
    overscroll-behavior-y: none;
  }
  body.dark-mode {
    background: #050505;
    overflow: hidden;
    overscroll-behavior-y: none;
  }
  body.dark-mode #root {
    height: 100%;
  }
  .cyber-bg-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(145deg, rgba(0,240,255,0.05), rgba(255,0,92,0.05), rgba(252,238,10,0.02));
    filter: blur(70px);
    opacity: 0.6;
    pointer-events: none;
  }
  .cyber-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%);
    pointer-events: none;
    perspective: 500px;
    animation: grid-scroll 20s linear infinite;
  }
  .clip-tech-border {
     clip-path: polygon(
       10px 0, 100% 0, 
       100% calc(100% - 10px), calc(100% - 10px) 100%, 
       0 100%, 
       0 10px
     );
  }
  .clip-corner-input {
     clip-path: polygon(
       0 0, 
       100% 0, 
       100% calc(100% - 8px), 
       calc(100% - 8px) 100%, 
       0 100%,
       0 8px
     );
  }
  .console-3d-block {
     border-bottom: 8px solid #0a0a10;
     border-left: 4px solid #101015;
     border-right: 4px solid #101015;
     border-top: 1px solid rgba(255,255,255,0.1);
     box-shadow: 
       0 20px 50px rgba(0,0,0,0.8),
       inset 0 1px 0 rgba(255,255,255,0.1),
       inset 0 -2px 5px rgba(0,0,0,0.5);
     transform-origin: bottom center;
  }
  .hologram-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
    backdrop-filter: blur(8px);
  }
  .typing-effect { letter-spacing: 0.32em; text-align: center; line-height: 1.6; }
  .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; overscroll-behavior-y: contain; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  
  /* CRT and Particles */
  .particle {
     position: absolute;
     width: 2px; height: 2px;
     background: rgba(255,255,255,0.3);
     border-radius: 50%;
     animation: float 10s infinite;
  }
`;

/**
 * 运算符按钮样式配置
 */
export const operatorStyles: { [key: string]: string } = {
    '+': 'text-cyber-acid border-cyber-acid/20 hover:bg-cyber-acid/10 hover:border-cyber-acid/50 hover:shadow-neon-acid shadow-[0_4px_0_rgba(176,255,26,0.2)]',
    '-': 'text-cyber-pink border-cyber-pink/20 hover:bg-cyber-pink/10 hover:border-cyber-pink/50 hover:shadow-neon-pink shadow-[0_4px_0_rgba(255,0,150,0.2)]',
    '×': 'text-cyber-cyan border-cyber-cyan/20 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50 hover:shadow-neon-cyan shadow-[0_4px_0_rgba(0,240,255,0.2)]',
    '÷': 'text-cyber-violet border-cyber-violet/20 hover:bg-cyber-violet/10 hover:border-cyber-violet/50 hover:shadow-neon-violet shadow-[0_4px_0_rgba(176,38,255,0.2)]',
};

/**
 * 激活状态颜色映射
 */
export const activeColorMap = {
    price: { color: 'bg-cyber-pink', shadow: 'shadow-neon-pink', border: 'border-cyber-pink', text: 'text-cyber-pink' },
    amount: { color: 'bg-cyber-cyan', shadow: 'shadow-neon-cyan', border: 'border-cyber-cyan', text: 'text-cyber-cyan' },
    count: { color: 'bg-cyber-yellow', shadow: 'shadow-neon-yellow', border: 'border-cyber-yellow', text: 'text-cyber-yellow' },
};
