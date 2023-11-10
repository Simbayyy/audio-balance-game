import { Text, Flex, Popover, Button, TextField, Select, HoverCard } from '@radix-ui/themes'
import * as Toggle from '@radix-ui/react-toggle';
import { PersonIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { DifficultyKey, difficulties } from './Page';

export const LeftBar: React.FunctionComponent<{
    setDifficulty: React.Dispatch<React.SetStateAction<DifficultyKey>>
    difficulty: DifficultyKey  
}> = ({
    setDifficulty,
    difficulty
}) => {
    const [text, setText] = useState("Mode sombre")
    const isDesktop = useMediaQuery({
        query: '(min-width:1024px)'
      })

    const changeTheme = (pressed: boolean) => {
        if (pressed) {
            setText('Mode clair')
            document.body.classList.add('dark-theme')
            localStorage.setItem("theme", "dark")
        } else {
            setText('Mode sombre')
            document.body.classList.remove('dark-theme')    
            localStorage.setItem("theme", "light")
        }
    }

    useEffect(() => {
        localStorage.getItem('theme') === 'light' 
            ? changeTheme(false)
            : changeTheme(true)
    }, [])

    const diffKeys = Object.keys(difficulties) as DifficultyKey[]

    return <Flex 
            grow={"0"}
            style={{borderRight:false ? '0.1rem solid grey' : "",height:isDesktop ? "100%" : ""}} 
            justify={{initial:"center",md:"start"}}
            position={{initial:"relative",md:"absolute"}}
            px={"2"} 
            py={"2"}
            gap={"1"} 
            direction={{initial:'row',md:"column-reverse"}}>
        <Toggle.Root className='ToggleGroupItem' defaultPressed={localStorage.getItem('theme') === 'dark'} onPressedChange={(pressed) => changeTheme(pressed)}>
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
        {import.meta.env.VITE_DIFFICULTY === "on" && 
        <Select.Root 
            defaultValue={difficulty} 
            onValueChange={(value) => {
                setDifficulty(value as DifficultyKey)
                localStorage.setItem('difficulty', value)
            }}
            >
            <Select.Trigger />
            <Select.Content>
                <Select.Group>
                <Select.Label>
                    <HoverCard.Root>
                        <HoverCard.Trigger>
                            <Text>Difficulté</Text>
                        </HoverCard.Trigger>
                        <HoverCard.Content>
                        <Flex>
                            <Text size={"2"} style={{fontStyle:"italic"}}>La difficulté sera changée au lancement de la prochaine musique</Text>
                        </Flex>
                        </HoverCard.Content>
                    </HoverCard.Root>
                </Select.Label>
                {diffKeys.map((elt,index) => {
                    return <Select.Item key={index} value={elt}>{difficulties[elt].name}</Select.Item>
                })}
                </Select.Group>
            </Select.Content>
        </Select.Root>
        }
    </Flex>
}
