import { DataObject, ChartObject } from '../types';

export default (data: DataObject): ChartObject[] => {
    return Object.keys(data).map((monthYearKey) => ({ monthYear: monthYearKey, value: data[monthYearKey] }));
};
