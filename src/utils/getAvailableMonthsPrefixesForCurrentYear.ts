import { monthsPrefixes } from '../constants/monthPrefixes';

export default (): string[] => {
    return monthsPrefixes.filter((prefix) => {
        const currentMonth = new Date().getMonth() + 1;
        return +prefix.split('-')[0] <= currentMonth;
    });
};
