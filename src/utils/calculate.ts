/**
 * 安全计算数学表达式。
 * 支持数字、小数、一元正负号，以及 +, -, ×, ÷, *, /。
 */
export const safeCalculate = (input: string): number => {
    const expression = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s/g, '');

    if (!expression || /[^0-9+\-*/.]/.test(expression)) return NaN;

    let index = 0;

    const parseNumber = (): number => {
        const start = index;
        let hasDigit = false;
        let hasDot = false;

        while (index < expression.length) {
            const char = expression[index];
            if (char >= '0' && char <= '9') {
                hasDigit = true;
                index += 1;
                continue;
            }
            if (char === '.' && !hasDot) {
                hasDot = true;
                index += 1;
                continue;
            }
            break;
        }

        if (!hasDigit) return NaN;
        const value = Number(expression.slice(start, index));
        return Number.isFinite(value) ? value : NaN;
    };

    const parseFactor = (): number => {
        const char = expression[index];
        if (char === '+' || char === '-') {
            index += 1;
            const value = parseFactor();
            return char === '-' ? -value : value;
        }
        return parseNumber();
    };

    const parseTerm = (): number => {
        let value = parseFactor();
        while (index < expression.length && (expression[index] === '*' || expression[index] === '/')) {
            const operator = expression[index];
            index += 1;
            const nextValue = parseFactor();
            if (!Number.isFinite(value) || !Number.isFinite(nextValue)) return NaN;
            if (operator === '/' && nextValue === 0) return NaN;
            value = operator === '*' ? value * nextValue : value / nextValue;
        }
        return value;
    };

    const parseExpression = (): number => {
        let value = parseTerm();
        while (index < expression.length && (expression[index] === '+' || expression[index] === '-')) {
            const operator = expression[index];
            index += 1;
            const nextValue = parseTerm();
            if (!Number.isFinite(value) || !Number.isFinite(nextValue)) return NaN;
            value = operator === '+' ? value + nextValue : value - nextValue;
        }
        return value;
    };

    const result = parseExpression();
    return index === expression.length && Number.isFinite(result) ? result : NaN;
};
