import { Button, Flex, Text } from '@radix-ui/themes'
import { Segment } from './Segment'

export const VariableSlider: React.FunctionComponent<{
  leftText:string,
  rightText:string,
  maxValue:number,
  setFunction:React.Dispatch<React.SetStateAction<number>>
  stateVariable:number
}> = ({leftText,rightText,maxValue,setFunction,stateVariable}) => {
    const crementValue = (crement:number) => {
      let newValue = Math.max(-maxValue/2,Math.min(maxValue/2,stateVariable + crement)) 
      setFunction(newValue)
      
    }
    return <Flex align={"center"} gap={"3"}>
            <Text align={"right"} style={{width:"20rem"}}>{leftText}</Text>
            <Button size={"2"} onClick={() => crementValue(-2)}>--</Button>
            <Button size={"2"} onClick={() => crementValue(-1)}>-</Button>
              <Flex style={{height:"2rem",width:"50rem",backgroundColor:'grey',borderRadius:"1rem"}}>
                {[...Array(maxValue)]
                  .map((_, index) => {
                    return <Segment index={index - maxValue/2} value={stateVariable} setValue={setFunction} side={index == 0 ? "first" : index == maxValue - 1 ? "last" : "middle"}/>
                          }
                        )
                }
              </Flex>
            <Button size={"2"} onClick={() => crementValue(1)}>+</Button>
            <Button size={"2"} onClick={() => crementValue(2)}>++</Button>
            <Text align={"left"} style={{width:"20rem"}}>{rightText}</Text>
        </Flex>
}