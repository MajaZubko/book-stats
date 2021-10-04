import { some } from 'lodash';
import { ChartObject, DataObject } from '../types';
import { monthsPrefixes } from '../constants/monthPrefixes';

interface Props {
    data: DataObject;
    year: string;
}

export default ({ data, year }: Props): ChartObject[] => {
    const keysFromDataForThisYear = Object.keys(data).filter((key) => key.includes(year));
    const lackingMonthsPrefixes = monthsPrefixes.filter((prefix) => !some(keysFromDataForThisYear, (key) => key.includes(prefix)));
    const lackingMonthsKeys = lackingMonthsPrefixes.map((prefix) => `${prefix}${year}`);
    const allMonthKeys = [...keysFromDataForThisYear, ...lackingMonthsKeys].sort();

    return allMonthKeys.map((key) => ({ monthYear: key, value: data[key] || 0 }));
};
