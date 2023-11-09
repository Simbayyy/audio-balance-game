import { Button, Dialog, Box, Flex, HoverCard, Text } from "@radix-ui/themes"
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import React, {useState} from "react"

import hall from '../assets/kevinmcleod/KevinMcLeod-Hall of the Mountain King.mp3'
import gymno1 from '../assets/kevinmcleod/KevinMcLeod-Gymnopedie No 1.mp3'
import aquarium from '../assets/kevinmcleod/KevinMcLeod-Aquarium.mp3'
import toccata from '../assets/kevinmcleod/KevinMcLeod-Toccata and Fugue in D Minor.mp3'
import duck from '../assets/kevinmcleod/KevinMcLeod-Fluffing a Duck.mp3'
import snitch from '../assets/kevinmcleod/KevinMcLeod-Sneaky Snitch.mp3'
import monkeys from '../assets/kevinmcleod/KevinMcLeod-Monkeys Spinning Monkeys.mp3'
import macabre from '../assets/kevinmcleod/KevinMcLeod-Danse Macabre.mp3'
import ritz from '../assets/Puttin on the Ritz.mp3' 
import internationale from "../assets/L'Internationale.mp3" 
import horology from '../assets/Horology.mp3'
import tetra from '../assets/Tetrachromacy.mp3'
import castle from '../assets/The Castle In The Air.mp3'


export const FreeMusic:React.FunctionComponent<{
    setAudioFiles:React.Dispatch<React.SetStateAction<File[]>>,
    setAudio:React.Dispatch<React.SetStateAction<File | null | undefined>>,
    audioFiles:File[],
    win:'win' | 'lose' | null
}> = ({
    setAudio,
    setAudioFiles,
    audioFiles,
    win,
}) => {
    type Genre = "jazz"|"meme"|"trad"|"classical"|"rock"
    const allGenres = ["jazz","meme","trad","classical","rock"]
    const [filters, setFilters] = useState<Genre[]>(allGenres as Genre[])

    const AddButton: React.FunctionComponent<{
        elt:string,
        stuffToDo:(file:File) => void,
        text:string
    }> = ({
        elt,
        stuffToDo,
        text
    }) => {
        let cleanName = elt
            .replace(/.*\//,"")
            .replace(/.mp3/,"")
            .replace(/-[\w\d]+$/, "")

        return <Dialog.Close>
            <Button
                size={"2"}
                style={{
                    height:"fit-content",
                    minHeight:"4rem",
                    textAlign:"center"
                }} 
                onClick={() => {
                    fetch(elt)
                        .then((data) => {return data.blob()})
                        .then((blob) => {
                            var file = new File([blob], cleanName)
                            stuffToDo(file)
                        })
                }}>
                    <Text>{text}</Text>
            </Button>
        </Dialog.Close> 
    }

    let musicObject = {
        "jazz":[ritz],
        "meme":[monkeys,duck,snitch],
        "trad":[internationale],
        "classical":[toccata,gymno1,hall,macabre,aquarium],
        "rock":[tetra,castle,horology]
    }

    return <Dialog.Root>
        <Dialog.Trigger>
            <Box
              className="custom-audio-upload">
                <Text className="audio-label">
                Musiques libres
                </Text>
            </Box>
        </Dialog.Trigger>
        <Dialog.Content style={{ maxWidth: 450, maxHeight:"80vh" }}>
            <Dialog.Title align={"center"}>Musiques libres</Dialog.Title>
            <ToggleGroup.Root
              className="ToggleGroup"
              type="multiple"
              defaultValue={["jazz","meme","trad","classical","rock"]}
              onValueChange={(value) => {setFilters(value as Genre[])}}
              aria-label="Text alignment"
            >
                <ToggleGroup.Item className="ToggleGroupItem" value="classical" aria-label="Musique classique">
                    <Text>Classique</Text>
                </ToggleGroup.Item>
                <ToggleGroup.Item className="ToggleGroupItem" value="jazz" aria-label="Jazz">
                    <Text>Jazz</Text>
                </ToggleGroup.Item>
                <ToggleGroup.Item className="ToggleGroupItem" value="meme" aria-label="Musique de meme">
                    <Text>Meme</Text>
                </ToggleGroup.Item>
                <ToggleGroup.Item className="ToggleGroupItem" value="trad" aria-label="Musique traditionnelle">
                    <Text>Traditionnelle</Text>
                </ToggleGroup.Item>
                <ToggleGroup.Item className="ToggleGroupItem" value="rock" aria-label="Musique rock">
                    <Text>Rock</Text>
                </ToggleGroup.Item>
            </ToggleGroup.Root>

                {filters
                .map((elt) => {return musicObject[elt]})
                .flat()
                .map((elt,index) => { 
                    let cleanName = elt
                                        .replace(/.*\//,"")
                                        .replace(/.mp3/,"")
                                        .replace(/-[\w\d]+$/, "")
                                        .replace(/KevinMcLeod-/,"")
                    return <Flex 
                              key={index}
                              py={"2"}
                              style={{
                                borderTop:"0.1rem solid grey"
                              }} 
                              gap={"3"} 
                              align={"center"}>
                    <Text style={{width:"50%"}} size={"4"}>{cleanName}</Text>
                    <Flex direction={"column"} gap={"1"}>
                        <AddButton 
                            stuffToDo={(file) => setAudio(file)} 
                            text="Jouer maintenant"
                            elt={elt} 
                            />
                        <AddButton 
                            stuffToDo={(file) => {
                                let newAudioFiles = [file,...audioFiles]
                                if (win !== null) {
                                    setAudio(newAudioFiles.shift())
                                    setAudioFiles(newAudioFiles) 
                                } else {
                                    setAudioFiles(newAudioFiles)
                                }
                            }} 
                            text="Jouer après"
                            elt={elt} 
                            />
                        <AddButton 
                            stuffToDo={(file) => {
                                let newAudioFiles = [...audioFiles,file]
                                if (win !== null) {
                                    setAudio(newAudioFiles.shift())
                                    setAudioFiles(newAudioFiles) 
                                } else {
                                    setAudioFiles(newAudioFiles)
                                }
                            }} 
                            text="Ajouter à la playlist"
                            elt={elt} 
                            />                    
                    </Flex>
                    {elt.match(/KevinMcLeod-/) &&  
                      <HoverCard.Root>
                      <HoverCard.Trigger>
                        <Text>?</Text>
                      </HoverCard.Trigger>
                      <HoverCard.Content>
                        <Flex gap="0" align={"center"} direction={"column"}>
                            <Text>{`"${cleanName}" Kevin MacLeod`}</Text>
                            <Text>{`(incompetech.com)`}</Text>
                            <Text>{`Licensed under Creative Commons: By Attribution 4.0 License`}</Text>
                            <Text>{`http://creativecommons.org/licenses/by/4.0/`}</Text>
                        </Flex>
                      </HoverCard.Content>
                    </HoverCard.Root>
                    }
                </Flex>})}
        </Dialog.Content>
    </Dialog.Root>
}
