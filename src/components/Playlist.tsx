import { Button, Dialog, Flex, Text } from "@radix-ui/themes"

export const Playlist:React.FunctionComponent<{
    audio:File | null | undefined,
    audioFiles:File[]
}> = ({
    audio,
    audioFiles
}) => {
    return <Dialog.Root>
        <Dialog.Trigger>
            <Button>Voir la playlist</Button>
        </Dialog.Trigger>
        <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Musique en cours</Dialog.Title>
            <Dialog.Description>
                {audio ? audio.name.replace(/\.[^.]{1,5}$/, "") : "Aucune"}
            </Dialog.Description>
            <Dialog.Title style={{ paddingTop:"1rem"}}>Musiques suivantes</Dialog.Title>
            <Dialog.Description size={"2"}>
                {audioFiles.length != 0 ? 
                <Flex direction={"column"} gap={"1"}>
                    {audioFiles.map((elt,index) => {return <Text key={index}>{elt.name.replace(/\.[^.]{1,5}$/, "")}</Text>})}
                </Flex>
                : <Text>Aucune musique en attente</Text>}
            </Dialog.Description>

        </Dialog.Content>
    </Dialog.Root>
}