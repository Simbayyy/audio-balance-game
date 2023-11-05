import AudioPlayer from "./AudioPlayer"
import { Flex } from '@radix-ui/themes'
import { LeftBar } from "./LeftBar"
import { RightBar } from "./RightBar"

export const Page = () => {
    return <Flex direction={{initial:'column',sm:'row'}}>
        <LeftBar />
        <AudioPlayer />
        <RightBar />
    </Flex>
} 