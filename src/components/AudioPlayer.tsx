import { useState, useEffect } from "react";
// @ts-ignore
import * as Tone from 'tone'
import { Counter } from "./Counter";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { VariableSlider } from "./VariableSlider";

const AudioContext = window.AudioContext;
const audioContext = new AudioContext();

let a : Tone.GrainPlayer | null ;
const AudioPlayer = () => {
  const [buttonName, setButtonName] = useState("Play");
  const [pitchShift, setPitchShift] = useState(0);
  const [tempoShift, setTempoShift] = useState(0);
  const [musicTime, setMusicTime] = useState(-1)
  const [basePitch, setBasePitch] = useState(0)
  const [baseTempo, setBaseTempo] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [win, setWin] = useState<'win' | 'lose' |null>(null)
  const [title, setTitle] = useState("Bienvenue ! Lance un fichier son pour commencer")
  const [audio, setAudio] = useState<File | null>();


  useEffect(() => {
    Tone.start();
  }, [])

  useEffect(() => {
    if (a) {
      a.stop();
      a = null;
      setButtonName("");
    }
    if (audio) {
      let reader = new FileReader()
      reader.readAsArrayBuffer(audio)
      audio.arrayBuffer().then((buffer) => {
        console.log("Chargement de l'audio")
        audioContext.decodeAudioData(buffer)
          .then(async (data) => {
            console.log("Création du buffer")
            setPitchShift(0)
            setTempoShift(0)
            let newBasePitch = Math.floor(Math.random() * 11 - 5) 
            setBasePitch(newBasePitch)
            let newBaseTempo = Math.floor(Math.random() * 11 - 5) 
            setBaseTempo(newBaseTempo)
            a = new Tone.GrainPlayer({url:data})
            a.detune = (newBasePitch + pitchShift) * 100
            await Tone.loaded();
            a.toDestination();
            a.onstop = () => {console.log(buttonName)}
            setMusicTime(Math.floor(a.buffer.duration))
            setWin(null)
            setTitle(`En écoute : ${audio.name}`)
            setAttempts(0)
            a.sync().start()
            Tone.Transport.start()
            a.playbackRate = 0.95**(-newBaseTempo-tempoShift)
            setButtonName("Stop");
          })
          .catch(() => {
            console.log("something went wrong loading file")
          })
      })
    }
  }, [audio]);


  const handleClick = () => {
    if (a) {
        if (buttonName === "Play") {
          Tone.Transport.start()
          console.log("Lancement de l'audio")
          setButtonName("Pause");
        } else {
          Tone.Transport.pause()
          setButtonName("Play");
        }
    }
  };

  useEffect(() => {
    if (win === 'win') setTitle("Félicitations, le son est bien réajusté !")
    else if (win === 'lose') setTitle("C'est perdu pour cette fois...")
  }, [win])

  const addFile = (e:React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files) {
        if (e.target.files[0]) {
          setAudio(e.target.files[0]);
        }
    }
  };

  const checkWin = (a:Tone.GrainPlayer | null) => {
    if (a && a.detune === 0 && a.playbackRate === 1) {
      setWin("win")
    } else {
      setAttempts(attempts + 1)
    }
  }

  useEffect(() => {
    if (a) a.detune = (basePitch + pitchShift) * 100
  }, [pitchShift])

  useEffect(() => {
    if (a) a.playbackRate = 0.95**(-baseTempo-tempoShift)
  }, [tempoShift])

  return (
    <Flex direction={"column"} align={"center"} gap={"6"}>
      <Text>{title}</Text>
      <Counter initTime={musicTime} win={win} setWin={setWin}/>
      <Flex gap={"4"} align={"center"}>
        <Button onClick={() => checkWin(a)}>Vérifier la réponse</Button>
        {attempts !== 0 && <Text>{`Essaye encore ! Déjà ${attempts} essai${attempts != 1 ? 's' :""}`}</Text>}
      </Flex>
      <Flex  direction={"column"} gap={"4"}>
        <VariableSlider maxValue={10} stateVariable={pitchShift} setFunction={setPitchShift} rightText="Plus aigu" leftText="Plus grave" />
        <VariableSlider maxValue={10} stateVariable={tempoShift} setFunction={setTempoShift} rightText="Plus rapide" leftText="Plus lent"/>
      </Flex>
      <Flex gap={"2"} align={"center"}>
        <Box className="custom-audio-upload">
          <input 
            type="file" 
            onChange={addFile}
            id="audioFileInput"
            accept="audio/*" />
            <label rel="audioFileInput">{a ? "Remplacer la musique" : "Envoyer un fichier"}</label>
        </Box> 
        {a && <Button size={"2"} onClick={handleClick}>{buttonName}</Button>}
      </Flex>
    </Flex>
  );
};

export default AudioPlayer;