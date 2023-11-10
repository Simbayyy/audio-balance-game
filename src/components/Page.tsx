import AudioPlayer from "./AudioPlayer"
import { Flex } from '@radix-ui/themes'
import { LeftBar } from "./LeftBar"
import { RightBar } from "./RightBar"
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

export interface Score {
    title: string
    score: number
}

export interface Difficulty {
    name: string
    pitchStep: number
    pitchStepNumber: number
    tempoStep: number
    tempoStepNumber: number
    scoreMultiplier: number
}

export type DifficultyKey = 'easy' | 'medium' | 'hard' | 'impossible'

export interface DifficultyMap {
    easy: Difficulty
    medium: Difficulty
    hard: Difficulty
    impossible: Difficulty
}

export const difficulties: DifficultyMap = {
    easy:{
        name:'Facile',
        pitchStep:300,
        pitchStepNumber:6,
        tempoStep:0.90,
        tempoStepNumber:6,
        scoreMultiplier:0.2
    },
    medium: {
        name:'Moyen',
        pitchStep:200,
        pitchStepNumber:8,
        tempoStep:0.93,
        tempoStepNumber:8,
        scoreMultiplier:0.5
    },
    hard:{
        name:'Difficile',
        pitchStep:100,
        pitchStepNumber:10,
        tempoStep:0.95,
        tempoStepNumber:10,
        scoreMultiplier:1
    },
    impossible:{
        name:"Impossible",
        pitchStep:50,
        pitchStepNumber:12,
        tempoStep:0.96,
        tempoStepNumber:12,
        scoreMultiplier:3
    }
}

export const Page = () => {
    const [audio, setAudio] = useState<File | null | undefined>();
    const [audioFiles, setAudioFiles] = useState<File[]>([])
    const [scoreList, setScoreList] = useState<Score[]>([])
    const [difficulty, setDifficulty] = useState<DifficultyKey>('easy')
    const isDesktop = useMediaQuery({
        query: '(min-width:1024px)'
      })

    return <Flex style={{height:isDesktop ? "100vh" : ""}} direction={{initial:'column',md:'row'}}>
        <LeftBar 
            difficulty={difficulty}
            setDifficulty={setDifficulty}
        />
        <AudioPlayer 
            audio={audio}
            setAudio={setAudio}
            audioFiles={audioFiles}
            setAudioFiles={setAudioFiles}
            scoreList={scoreList}
            setScoreList={setScoreList}
            difficulty={difficulty}/>
        {(audio || audioFiles.length !== 0 || scoreList.length !== 0) && <RightBar 
            audio={audio}
            audioFiles={audioFiles}
            scoreList={scoreList}/>}
    </Flex>
} 