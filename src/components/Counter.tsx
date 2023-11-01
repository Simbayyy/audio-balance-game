import { useEffect, useState } from "react"

export const Counter: React.FunctionComponent<{initTime:number}> = ({initTime}) => {
    const [time, setTime] = useState(initTime)

    useEffect(() => {
        setTime(initTime)
    }, [initTime])

    useEffect(() => {
        const interval = setInterval(() => {
            time > 0 && setTime(time-1)
        }, 1000)
        return () => clearInterval(interval);
    }, [time])
    
    return <div>{time}</div>
}