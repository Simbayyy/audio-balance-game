import { Button, Flex, Text } from '@radix-ui/themes'
import { Segment } from './Segment'
import { useMediaQuery } from "react-responsive";

export const VariableSlider: React.FunctionComponent<{
  leftText:string,
  rightText:string,
  name:string,
  maxValue:number,
  setFunction:React.Dispatch<React.SetStateAction<number>> | null
  stateVariable:number
}> = ({leftText,rightText,maxValue,setFunction,stateVariable,name}) => {
  const crementValue = (crement:number) => {
    let newValue = Math.max(-maxValue/2,Math.min(maxValue/2,stateVariable + crement)) 
    if (setFunction) setFunction(newValue)
    
  }

  const CrementButton: React.FunctionComponent<{value:number}> = ({value}) => {
    return <Button
              className={setFunction === null ? "button_to_disable_on_win" : ""}
              size="2"
              onClick={() => crementValue(value)}
              style={{width:"4rem"}}
              >
              {(value<0 ? "-" : "+").repeat(Math.abs(value))}
            </Button>}
  
  const SideButtons: React.FunctionComponent<{text:string | null,side:'left' | 'right'}> = ({text,side}) => {
      if (side === 'left') {
        return <Flex gap="3" justify={{initial:"start",sm:"center"}} width={{initial:"100%",sm:"auto"}}>
          {text && <Text align={"right"} style={{width:"12rem"}}>{text}</Text>}
          <CrementButton value={-2} />
          <CrementButton value={-1} />
        </Flex>
      }
      else {
        return <Flex gap="3" justify={{initial:"start",sm:"center"}} width={{initial:"100%",sm:"auto"}}>
          <CrementButton value={1} />
          <CrementButton value={2} />
          {text && <Text align={"left"} style={{width:"12rem"}}>{text}</Text>}
        </Flex>
      }

  }

  const SliderBar: React.FunctionComponent = () => {
      return <Flex 
                style={{
                  height:"2rem",
                  width:"50rem",
                  maxWidth:"90vw",
                  backgroundColor:'grey',
                  borderRadius:"1rem"
                }}>
        {[...Array(maxValue)]
          .map((_, index) => {
            return <Segment key={index} index={index - maxValue/2} value={stateVariable} setValue={setFunction} side={index == 0 ? "first" : index == maxValue - 1 ? "last" : "middle"}/>
                  }
                )
        }
      </Flex>
  }

  const isDesktop = useMediaQuery({
    query: '(min-width:768px)'
  })
    return <Flex direction={"column"} gap={"1"}>
        <Text align={"center"} size={"5"} weight={"medium"}>{name}</Text>
        <Flex align={"center"} gap={"3"} wrap={"nowrap"} direction={{initial:"column",sm:"row"}} px={"1"}>
              {isDesktop 
              ? [<SideButtons text={leftText} side='left' />,
              <SliderBar />,
              <SideButtons text={rightText} side='right' />]
              : [<SliderBar />,
              <Flex direction={"row"} gap={"5"}>
                 <SideButtons text={null} side='left' />
                 <SideButtons text={null} side='right' />
              </Flex>
            ]}
        </Flex>
    </Flex>
}