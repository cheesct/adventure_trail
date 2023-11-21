export default class Helper
{
    static clamp(val: number, min: number, max: number)
    {
        if (min > max)
        {
            return val
        }
        return Math.min(Math.max(val, min), max);
    }

    static wrap(val: number, min: number, max: number)
    {
        max = max - min
        val = val / max
        val = val - Math.floor(val)
        return val * max + min
    };

    static randomRangeInt(min: number, max: number)
    {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static randomRange(min: number, max: number)
    {
        return Math.random() * (max - min) + min;
    }

    static choose(arr: Array<any>)
    {
        if(Array.isArray(arr) && arr.length)
        {
            return arr[Helper.randomRangeInt(0, arr.length - 1)]
        }
        return null
    }

    static middleIntersectRange(l1: number, l2: number, r1: number, r2: number)
    {
        let p = l1 + l2 + r1 + r2
        p -= Math.min(l1, l2, r1, r2)
        p -= Math.max(l1, l2, r1, r2)
        return p * 0.5
    }
}