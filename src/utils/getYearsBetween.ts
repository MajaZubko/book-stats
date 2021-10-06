export default (startYear: number, endYear: number): number[] => {
    return Array(endYear - startYear + 1)
        .fill(startYear)
        .map((year, index) => year + index);
};
