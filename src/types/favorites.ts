import { ReceiptItem } from './index';

// 历史记录
export interface HistoryRecord {
    id: string;
    items: ReceiptItem[];       // 该次比价的所有商品
    bestItem: ReceiptItem;      // 最优价格商品
    createdAt: string;          // ISO Date string
    totalItemCount: number;
}

// 收藏夹
export interface Folder {
    id: string;
    name: string;
    icon?: string;              // 可选图标
    color?: string;             // 可选颜色 (hex or tailwind class)
    createdAt: string;
    updatedAt: string;
}

// 收藏项
export interface FavoriteItem extends ReceiptItem {
    dbId?: number;              // IndexedDB 自动生成的 ID (可选)
    tags: string[];             // 用户自定义标签
    folderId: string | null;    // null = 根目录
    favoriteAt: string;
    note?: string;              // 可选备注
}

// 价格册 (用于 UI 展示的数据结构)
export interface PriceBook {
    folders: Folder[];
    rootItems: FavoriteItem[];  // 根目录下的收藏
}
