// 小票商品类型定义
export interface ReceiptItem {
    id: number;
    price: number;
    perUnitAmount: number;
    count: number;
    totalAmount: number;
    unitPrice: number;
    timestamp: string;
    themeIndex: number;
}

// 主题数量常量
export const THEME_COUNT = 4;

// 输入框激活状态类型
export type ActiveField = 'price' | 'amount' | 'count';

// 主题模式类型
export type ThemeMode = 'light' | 'dark';

// 控制台输入框颜色主题类型
export type ConsoleInputColor = 'pink' | 'cyan' | 'yellow';
