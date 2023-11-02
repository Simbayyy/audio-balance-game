import { Button, Flex, Text } from '@radix-ui/themes'
import { Segment } from './Segment'

export const VariableSlider: React.FunctionComponent<{
  leftText:string,
  rightText:string,
  maxValue:number,
  setFunction:React.Dispatch<React.SetStateAction<number>> | null
  stateVariable:number
}> = ({leftText,rightText,maxValue,setFunction,stateVariable}) => {
    const crementValue = (crement:number) => {
      let newValue = Math.max(-maxValue/2,Math.min(maxValue/2,stateVariable + crement)) 
      if (setFunction) setFunction(newValue)
      
    }
    return <Flex align={"center"} gap={"3"} direction={{initial:"column",md:"row"}} style={{padding:"0 1rem"}}>
              <Flex gap="3" justify={{initial:"start",md:"center"}} width={{initial:"100%",md:"auto"}}>
                <Text align={"right"} style={{width:"12rem"}}>{leftText}</Text>
                <Button className={setFunction === null ? "button_to_disable_on_win" : ""} size={"2"} onClick={() => crementValue(-2)}>--</Button>
                <Button className={setFunction === null ? "button_to_disable_on_win" : ""} size={"2"} onClick={() => crementValue(-1)}>-</Button>
              </Flex>
              <Flex style={{height:"2rem",width:"50rem",maxWidth:"90vw",backgroundColor:'grey',borderRadius:"1rem"}}>
                {[...Array(maxValue)]
                  .map((_, index) => {
                    return <Segment index={index - maxValue/2} value={stateVariable} setValue={setFunction} side={index == 0 ? "first" : index == maxValue - 1 ? "last" : "middle"}/>
                          }
                        )
                }
              </Flex>
              <Flex gap="3" justify={{initial:"end",md:"center"}} width={{initial:"100%",md:"auto"}}>
                <Button className={setFunction === null ? "button_to_disable_on_win" : ""} size={"2"} onClick={() => crementValue(1)}>+</Button>
                <Button className={setFunction === null ? "button_to_disable_on_win" : ""} size={"2"} onClick={() => crementValue(2)}>++</Button>
                <Text align={"left"} style={{width:"12rem"}}>{rightText}</Text>
              </Flex>
        </Flex>
}