import { Button, Dialog, Flex, Text } from "@radix-ui/themes"

export const HowToPlay = () => {
    return <Dialog.Root>
        <Dialog.Trigger>
            <Button>Comment jouer ?</Button>
        </Dialog.Trigger>
        <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Comment jouer ?</Dialog.Title>
            <Dialog.Description style={{padding:"1rem 0"}}>
                Pour jouer, envoie une musique. Le site va modifier le tempo et le ton du morceau, et tu devras essayer de retrouver le son original en jouant avec les paramètres.

                Quand tu penses avoir trouvé, vérifie avec le bouton juste en dessous du compteur !
            </Dialog.Description>

            <Flex direction={"column"}>
                <Text size={"2"}>Un site de Simon Baillet</Text>
                <Text size={"2"}>Lien du repo (TOFIX)</Text>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}