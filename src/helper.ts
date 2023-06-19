
export default class Helper
{
    static clamp(val: number, min: number, max: number)
    {
        if (min >= max)
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

    static choose(arr: Array<any>)
    {
        if(Array.isArray(arr) && arr.length)
        {
            return arr[Helper.randomRangeInt(0, arr.length - 1)]
        }
        return null
    }
}