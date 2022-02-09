const randomValue = (minIncluded: number, maxIncluded: number) => {
    return Math.floor(Math.random() * (maxIncluded - minIncluded + 1) + minIncluded);
}

export default randomValue;