import { useEffect } from "react"
import { Text } from "@radix-ui/themes"

export const Counter: React.FunctionComponent<
    {
        initTime:number
        win:"win" | "lose" | null
        setWin:React.Dispatch<React.SetStateAction<"win" | "lose" | null>>
        time:number
        setTime:React.Dispatch<React.SetStateAction<number>>
    }> = ({initTime,win,setWin,time,setTime}) => {

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
    
    return <Text size={"8"} weight={"bold"}>
             {win 
                ? win === 'lose' 
                    ? "Perdu"
                    : "Gagné"
                : time > 0 && time}
        </Text>
}