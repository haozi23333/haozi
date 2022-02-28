export default function lottery(items: {
    name: string,
    weight: number
}[]): number {
    let total = 0;
    items.forEach(item => total += item.weight);
    let random = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        random -= items[i].weight;
        if (random <= 0) {
            return i;
        }
    }
    return items.length - 1
}