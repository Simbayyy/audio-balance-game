import AudioPlayer from "./AudioPlayer"
import { Flex } from '@radix-ui/themes'
import { LeftBar } from "./LeftBar"
import { RightBar } from "./RightBar"
import { useState } from 'react'

export interface Score {
    title: string
    score: number
}

export const Page = () => {
    const [audio, setAudio] = useState<File | null | undefined>();
    const [audioFiles, setAudioFiles] = useState<File[]>([])
    const [scoreList, setScoreList] = useState<Score[]>([])
  
    return <Flex style={{minHeight:"100vh"}} direction={{initial:'column',md:'row'}}>
        <LeftBar />
        <AudioPlayer 
            audio={audio}
            setAudio={setAudio}
            audioFiles={audioFiles}
            setAudioFiles={setAudioFiles}
            scoreList={scoreList}
            setScoreList={setScoreList}/>
        {(audio || audioFiles.length !== 0 || scoreList.length !== 0) && <RightBar 
            audio={audio}
            audioFiles={audioFiles}
            scoreList={scoreList}/>}
    </Flex>
} 