export default (startNumber: number, endNumber: number): number[] => {
    return Array(endNumber - startNumber + 1)
        .fill(startNumber)
        .map((number, index) => number + index);
};
