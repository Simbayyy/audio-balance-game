import { Flex, Button, Text } from '@radix-ui/themes'
import { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible'
import { Cross2Icon, ColumnSpacingIcon, RowSpacingIcon } from '@radix-ui/react-icons'
import { useMediaQuery } from 'react-responsive'

export const RightBar = () => {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery({
        query: '(min-width:1024px)'
      })

    return <Flex 
            direction={{initial:'row',md:'column-reverse'}}
            px={"2"}
            py={"2"}
            grow={"0"}
            style={{borderLeft:(open && isDesktop) ? '0.1rem solid grey' : ""}}>
        <Collapsible.Root 
          className="CollapsibleRoot"
          open={open}
          onOpenChange={setOpen}
          style={{flexDirection:isDesktop ? "column-reverse" : "column"}}>
            <Collapsible.Trigger asChild>
                <Button style={{width:"5rem",height:"5rem"}} radius='full'>
                    {open
                    ? <Cross2Icon />
                    : isDesktop ? <ColumnSpacingIcon />
                                : <RowSpacingIcon />}</Button>
            </Collapsible.Trigger>
            <Collapsible.Content 
                style={{
                    paddingBottom:"1rem", 
                    justifySelf:"flex-end"
                }}>
                <Flex grow={"1"} gap={"5"} direction={"column"}>
                    <Text>Playlist</Text>
                    <Text>Score</Text>
                </Flex>
            </Collapsible.Content>
        </Collapsible.Root>
    </Flex>
}