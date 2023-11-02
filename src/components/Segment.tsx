import { Box, Flex } from "@radix-ui/themes"
import { useEffect } from "react"


export const Segment: React.FunctionComponent<{
    index:number,
    value:number,
    setValue:React.Dispatch<React.SetStateAction<number>>
    side:string
}> = ({index,value,setValue,side}) => {
    let color = (value > index ? "orange" : "transparent")
    useEffect(() => {
        color  = (value > index ? "orange" : "transparent")
    }, [value])
    
    return <Flex 
                key={index+1} 
                grow={"1"} 
                style={{borderLeft:(side == "first" ? "" : "0.1rem solid black"),backgroundColor:color,borderTopLeftRadius:`${side == "first" ? "1" : "0"}rem`,borderBottomLeftRadius:`${side == "first" ? "1" : "0"}rem`,borderTopRightRadius:`${side == "last" ? "1" : "0"}rem`,borderBottomRightRadius:`${side == "last" ? "1" : "0"}rem`}}>
                <Box 
                grow={'1'}
                key={2*index+2} 
                onClick={() => {setValue(index)}} />
                <Box 
                grow={"1"}
                key={2*index + 3} 
                onClick={() => {setValue(index+1)}}/>
            </Flex>
    }