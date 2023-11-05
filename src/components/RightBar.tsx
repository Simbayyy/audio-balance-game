import { Flex, Button, Table } from '@radix-ui/themes'
import { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible'
import { Cross2Icon, ColumnSpacingIcon, RowSpacingIcon } from '@radix-ui/react-icons'
import { useMediaQuery } from 'react-responsive'
import { Score } from './Page';

export const RightBar: React.FunctionComponent<{
    audio: File | null | undefined
    audioFiles: File[]
    scoreList: Score[]
}> = ({
    audio,
    audioFiles,
    scoreList,
}) => {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery({
        query: '(min-width:1024px)'
      })

    return <Flex 
            direction={{initial:'row',md:'column-reverse'}}
            px={"2"}
            py={"2"}
            grow={"0"}
            style={{
                borderLeft:(open && isDesktop) ? '0.1rem solid grey' : "",
                maxWidth: (open && isDesktop) ? "20vw" : "",
                maxHeight: isDesktop ? '100vh' : "",
                overflowY: 'scroll',
            }}>
        <Collapsible.Root 
          className="CollapsibleRoot"
          open={open}
          onOpenChange={setOpen}
          style={{flexDirection:isDesktop ? "column-reverse" : "column"}}>
            <Collapsible.Trigger asChild>
                <Button style={{width:"5rem",marginBottom:"1rem",height:"5rem"}} radius='full'>
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
                    {(audio || audioFiles.length !== 0) && <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Playlist</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {(audio ? [audio] : [])
                                .concat(audioFiles)
                                .map((elt,index) => {return <Table.Row key={index}>
                                <Table.Cell>{elt.name.replace(/\.[^.]{1,5}$/, "")}</Table.Cell>
                            </Table.Row>})}
                        </Table.Body>
                    </Table.Root>}
                    {scoreList.length !== 0 && <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Chanson</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {scoreList.map((elt,index) => {return <Table.Row key={index}>
                                <Table.Cell >{elt.title}</Table.Cell>
                                <Table.Cell >{elt.score}</Table.Cell>
                            </Table.Row>})}
                        </Table.Body>
                    </Table.Root>}
                </Flex>
            </Collapsible.Content>
        </Collapsible.Root>
    </Flex>
}