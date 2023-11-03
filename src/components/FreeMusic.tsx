import { Button, Dialog, Flex, HoverCard, Text } from "@radix-ui/themes"
import hall from '../assets/kevinmcleod/Hall of the Mountain King.mp3'
import gymno1 from '../assets/kevinmcleod/Gymnopedie No 1.mp3'
import aquarium from '../assets/kevinmcleod/Aquarium.mp3'
import toccata from '../assets/kevinmcleod/Toccata and Fugue in D Minor.mp3'
import ritz from '../assets/Puttin on the Ritz.mp3' 
import internationale from "../assets/L'Internationale.mp3" 

export const FreeMusic:React.FunctionComponent<{
    setAudioFiles:React.Dispatch<React.SetStateAction<File[]>>,
    setAudio:React.Dispatch<React.SetStateAction<File | null | undefined>>,
    audioFiles:File[],
}> = ({
    setAudio,
    setAudioFiles,
    audioFiles,
}) => {
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
                              style={{
                                padding:"1rem 0", 
                                borderTop:"0.1rem solid grey"
                              }} 
                              gap={"3"} 
                              align={"center"}>
                    <Text style={{width:"50%"}} size={"4"}>{cleanName}</Text>
                    <Flex direction={"column"} gap={"1"}>
                        <Button
                        size={"2"} 
                        onClick={() => {
                            fetch(elt)
                                .then((data) => {return data.blob()})
                                .then((blob) => {
                                    var file = new File([blob], cleanName)
                                    setAudio(file)
                                })
                        }}>
                            Jouer maintenant
                        </Button>
                        <Button 
                        size={"2"} 
                        onClick={() => {
                            fetch(elt)
                                .then((data) => {return data.blob()})
                                .then((blob) => {
                                    var file = new File([blob], cleanName)
                                    setAudioFiles([file,...audioFiles])
                                })
                        }}>
                            Jouer après
                        </Button>
                        <Button 
                        size={"2"} 
                        onClick={() => {
                            fetch(elt)
                                .then((data) => {return data.blob()})
                                .then((blob) => {
                                    var file = new File([blob], cleanName)
                                    setAudioFiles([...audioFiles,file])
                                })
                        }}>
                            Ajouter à la playlist
                        </Button>
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