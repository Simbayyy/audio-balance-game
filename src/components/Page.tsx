import AudioPlayer from "./AudioPlayer"
import { Flex } from '@radix-ui/themes'
import { LeftBar } from "./LeftBar"
import { RightBar } from "./RightBar"

export const Page = () => {
    return <Flex style={{height:"100vh"}} direction={{initial:'column',md:'row'}}>
        <LeftBar />
        <AudioPlayer />
        <RightBar />
    </Flex>
} 