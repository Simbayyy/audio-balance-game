import { Button, Dialog, Flex, HoverCard, Text } from "@radix-ui/themes"
import hall from '../assets/kevinmcleod/Hall of the Mountain King.mp3'
import gymno1 from '../assets/kevinmcleod/Gymnopedie No 1.mp3'
import aquarium from '../assets/kevinmcleod/Aquarium.mp3'
import toccata from '../assets/kevinmcleod/Toccata and Fugue in D Minor.mp3'
import ritz from '../assets/Puttin on the Ritz.mp3' 
import internationale from "../assets/L'Internationale.mp3" 
import React from "react"

export const FreeMusic:React.FunctionComponent<{
    setAudioFiles:React.Dispatch<React.SetStateAction<File[]>>,
    setAudio:React.Dispatch<React.SetStateAction<File | null | undefined>>,
    audioFiles:File[],
}> = ({
    setAudio,
    setAudioFiles,
    audioFiles,
}) => {
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
                    {text}
            </Button>
        </Dialog.Close> 
    }

    return <Dialog.Root>
        <Dialog.Trigger>
            <Button>Musiques libres</Button>
        </Dialog.Trigger>
        <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title align={"center"}>Musiques libres</Dialog.Title>
                {[internationale,hall,gymno1,aquarium,toccata,ritz]
                .map((elt,index) => { 
                    let cleanName = elt
                                        .replace(/.*\//,"")
                                        .replace(/.mp3/,"")
                                        .replace(/-[\w\d]+$/, "")
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
                            stuffToDo={(file) => setAudioFiles([file,...audioFiles])} 
                            text="Jouer après"
                            elt={elt} 
                            />
                        <AddButton 
                            stuffToDo={(file) => setAudioFiles([...audioFiles,file])} 
                            text="Ajouter à la playlist"
                            elt={elt} 
                            />                    
                    </Flex>
                    {elt.match(/kevinmcleod/) &&  
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