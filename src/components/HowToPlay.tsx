import { Button, Dialog, Flex, Text } from "@radix-ui/themes"

export const HowToPlay = () => {
    return <Dialog.Root>
        <Dialog.Trigger>
            <Button>Comment jouer ?</Button>
        </Dialog.Trigger>
        <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Comment jouer ?</Dialog.Title>
            <Flex direction={"column"} py={"1"}>
            <Text>
                Pour jouer, envoie le fichier d'une musique (ou choisis parmis les quelques musiques libres de droit disponibles). Le site va modifier le tempo et le ton du morceau, et tu devras essayer de retrouver le son original en jouant avec les paramètres.
            </Text>
            <Text>
                Quand tu penses avoir trouvé, vérifie avec le bouton juste en dessous du compteur !
            </Text>

            </Flex>

            <Flex direction={"column"}>
                <Text size={"2"}>Un site de Simon Baillet</Text>
                <Text size={"2"}>Lien du repo (TOFIX)</Text>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
}