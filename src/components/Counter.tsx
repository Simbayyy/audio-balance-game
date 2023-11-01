import { useEffect, useState } from "react"

export const Counter: React.FunctionComponent<
    {
        initTime:number
        win:"win" | "lose" | null
        setWin:React.Dispatch<React.SetStateAction<"win" | "lose" | null>>
    }> = ({initTime,win,setWin}) => {
    const [time, setTime] = useState(initTime)

    useEffect(() => {
        setTime(initTime)
    }, [initTime])

    useEffect(() => {
        const interval = setInterval(() => {
            if (win === null) time > 0 && setTime(time-1)
            if (time === 1) setWin('lose')
        }, 1000)
        return () => clearInterval(interval);
    }, [time])
    
    return <div>
             {win 
                ? win === 'lose' 
                    ? "Perdu"
                    : "Gagné"
                : time}
        </div>
}