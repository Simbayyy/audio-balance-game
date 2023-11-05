import * as Progress from '@radix-ui/react-progress'
import { useState } from 'react'

export const ProgressBar: React.FunctionComponent<{
    progress:string
}> = ({
    progress
}) => {
    const [value, setValue] = useState(progress === 'ended' 
        ? 80
        : 0)
    if (progress == 'started') {
        if (value !== 80 && value !== 55 ) {
            setTimeout(() => setValue(55),200)
            setTimeout(() => setValue(80),900)
        }
    }
    else if (progress == 'ended') {
        if (value !== 100) setValue(100)
    } 

    return <Progress.Root
            className="ProgressRoot" value={value}>
      <Progress.Indicator
        className="ProgressIndicator"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </Progress.Root>
}