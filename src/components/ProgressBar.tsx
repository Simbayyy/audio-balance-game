import * as Progress from '@radix-ui/react-progress'
import { MutableRefObject, useEffect, useState } from 'react'

export const ProgressBar: React.FunctionComponent<{
    progress:MutableRefObject<number>
}> = ({
    progress
}) => {

    const [percent, setPercent] = useState(progress.current)

    useEffect(() => {
        setPercent(progress.current)
        console.log(progress.current)
    }, [progress.current])

    return <Progress.Root
            className="ProgressRoot" value={percent}
            style={{display:progress.current === 0 ? 'none' : 'initial'}}>
      <Progress.Indicator
        className="ProgressIndicator"
        style={{ 
            transform: `translateX(-${100 - percent}%)`,
        }}
      />
    </Progress.Root>
}