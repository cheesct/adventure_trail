export default class Singleton
{
    private static instance: Singleton;

    public transition_name: string;
    public transition_flag: number;

    private constructor() { }

    public static getInstance(): Singleton
    {
        if (!Singleton.instance)
        {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}