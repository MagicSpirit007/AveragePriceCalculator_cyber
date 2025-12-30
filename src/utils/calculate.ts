/**
 * 安全计算数学表达式
 * 支持 +, -, ×, ÷ 运算符
 * @param input 用户输入的表达式字符串
 * @returns 计算结果，无效输入返回 NaN
 */
export const safeCalculate = (input: string): number => {
    try {
        // 将中文符号替换为标准符号，并过滤非法字符
        const sanitized = input
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/[^0-9+\-*/.]/g, '');

        if (!sanitized) return NaN;

        // eslint-disable-next-line no-new-func
        return Function(`'use strict'; return (${sanitized})`)();
    } catch (e) {
        return NaN;
    }
};
