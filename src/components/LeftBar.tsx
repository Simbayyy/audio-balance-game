import { Text, Flex, Popover, Button, TextField } from '@radix-ui/themes'
import * as Toggle from '@radix-ui/react-toggle';
import { PersonIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

export const LeftBar = () => {
    const [text, setText] = useState("Mode sombre")
    const isDesktop = useMediaQuery({
        query: '(min-width:1024px)'
      })

    const changeTheme = (pressed: boolean) => {
        if (pressed) {
            setText('Mode clair')
            document.body.classList.add('dark-theme')
        } else {
            setText('Mode sombre')
            document.body.classList.remove('dark-theme')    
        }
    }
    return <Flex 
            grow={"0"}
            style={{borderRight:isDesktop ? '0.1rem solid grey' : ""}} 
            justify={"center"} 
            px={"2"} 
            py={"2"}
            gap={"1"} 
            direction={{initial:'row',md:"column"}}>
        <Toggle.Root className='ToggleGroupItem' onPressedChange={(pressed) => changeTheme(pressed)}>
            <Text>{text}</Text>
        </Toggle.Root>
        {import.meta.env.VITE_PSEUDO === "on" && <Popover.Root>
            <Popover.Trigger>
                <Button>
                    <PersonIcon />
                    Pseudo
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <TextField.Root>
                    <TextField.Input placeholder='jaimelesmouflons44' />
                </TextField.Root>
                <Text size={"2"} style={{fontStyle:'italic',paddingTop:"2rem"}}>Choisis un pseudo pour participer au classement</Text>
            </Popover.Content>
        </Popover.Root>}
    </Flex>
}
