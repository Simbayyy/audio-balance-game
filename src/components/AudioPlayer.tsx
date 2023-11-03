import { useState, useEffect } from "react";
// @ts-ignore
import { GrainPlayer, Transport, loaded, start } from 'tone'
import { Counter } from "./Counter";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { VariableSlider } from "./VariableSlider";
import { HowToPlay } from "./HowToPlay";
import { Playlist } from "./Playlist";
import { FreeMusic } from "./FreeMusic";

const AudioContext = window.AudioContext;
const audioContext = new AudioContext();

let a : GrainPlayer | null ;
const AudioPlayer = () => {
  const [buttonName, setButtonName] = useState("Play");
  const [pitchShift, setPitchShift] = useState(0);
  const [tempoShift, setTempoShift] = useState(0);
  const [musicTime, setMusicTime] = useState(-1)
  const [basePitch, setBasePitch] = useState(0)
  const [baseTempo, setBaseTempo] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [win, setWin] = useState<'win' | 'lose' | null>(null)
  const [title, setTitle] = useState("Bienvenue ! Lance un fichier son pour commencer")
  const [audio, setAudio] = useState<File | null>();
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const [time, setTime] = useState(-1)
  const [score, setScore] = useState(0)

  useEffect(() => {
    start();
  }, [])

  useEffect(() => {
    if (a) {
      a.stop();
      a.dispose()
      setButtonName("");
    }
    if (audio) {
      startAudio(audio)
    }
  }, [audio]);

  const startAudio = (audio:File) => {
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
            if (a) a.dispose()
            a = new GrainPlayer({url:data})
            a.detune = (newBasePitch + pitchShift) * 100
            await loaded();
            a.toDestination();
            a.loopEnd = a.buffer.duration
            a.loopStart = 0
            a.loop = true
            a.onstop = () => {console.log(`a stopped`)}
            setMusicTime(Math.floor(a.buffer.duration))
            setWin(null)
            setTitle(`En écoute : ${audio.name}`)
            setAttempts(0)
            setScore(0)
            a.sync().start()
            Transport.start()
            a.playbackRate = 0.95**(-newBaseTempo-tempoShift)
            setButtonName("Pause");
          })
          .catch((err) => {
            console.log("something went wrong loading file:\n" + `${err}` )
          })
      })
  }

  const handleClick = () => {
    if (a) {
        if (buttonName === "Play") {
          Transport.start()
          console.log("Lancement de l'audio")
          setButtonName("Pause");
        } else {
          Transport.pause()
          setButtonName("Play");
        }
    }
  };

  useEffect(() => {
    if (win === 'win') {
      setTitle("Félicitations, le son est bien réajusté !")
    }
    else if (win === 'lose') {
      setTitle("C'est perdu pour cette fois...")
      setPitchShift(-basePitch)
      setTempoShift(-baseTempo)
    }
    if (win !== null) {
      a?.stop("+15")
      setTimeout(nextSong, 15000)
    } 
    if (a?.state == "stopped") console.log("Should pass to next song")

  }, [win])

  const nextSong = () => {
    if (audioFiles.length !== 0) {
      let newAudioFiles = audioFiles
      setAudio(newAudioFiles.shift())
      setAudioFiles(newAudioFiles) 
    }
  }


  const addFile = (e:React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files) {
      let filesToAdd = [...e.target.files]
        if (filesToAdd.length !== 0) {
          setAudio(filesToAdd.shift());
          setAudioFiles(audioFiles.concat(filesToAdd))
        }
    }
  };

  const addNextFile = (e:React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files) {
      let filesToAdd = [...e.target.files]
        if (filesToAdd.length !== 0) {
          setAudioFiles(filesToAdd.concat(audioFiles))
          if (win !== null) nextSong()
        }
    }
  };

  const addLastFile = (e:React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files) {
      let filesToAdd = [...e.target.files]
        if (filesToAdd.length !== 0) {
          setAudioFiles(audioFiles.concat(filesToAdd))
          if (win !== null) nextSong()
        }
    }
  };

  const checkWin = (a:GrainPlayer | null) => {
    if (win === null) {
      if (a && a.detune === 0 && a.playbackRate === 1) {
        setWin("win")
        console.log({attempts:attempts,time:time})
        setScore(Math.floor(time/(attempts*2+3)*10) + 10)
      } else {
        setAttempts(attempts + 1)
      }
    }
  }

  useEffect(() => {
    if (a) a.detune = (basePitch + pitchShift) * 100
  }, [pitchShift])

  useEffect(() => {
    if (a) a.playbackRate = 0.95**(-baseTempo-tempoShift)
  }, [tempoShift])

  return (
    <Flex py={"6"} direction={"column"} align={"center"} gap={"6"}>
      <Text align={"center"} weight={"bold"}>{title}</Text>
      <Counter initTime={musicTime} win={win} setWin={setWin} time={time} setTime={setTime}/>
      {win !== null && <Text size={"6"}>Score : {score}</Text>}
      <Flex gap={"4"} px={"2"} align={"center"}>
        <Button className={win === null ? "" : "button_to_disable_on_win"} onClick={() => checkWin(a)}>Vérifier la réponse</Button>
        {attempts !== 0 && <Text align={"center"}>{`Essaye encore ! Déjà ${attempts} essai${attempts != 1 ? 's' :""}`}</Text>}
      </Flex>
      <Flex direction={"column"} gap={"4"}>
        <VariableSlider name={"Ton"} maxValue={10} stateVariable={pitchShift} setFunction={win === null ? setPitchShift : null} rightText="Plus aigu" leftText="Plus grave" />
        <VariableSlider name={"Tempo"} maxValue={10} stateVariable={tempoShift} setFunction={win === null ? setTempoShift : null} rightText="Plus rapide" leftText="Plus lent"/>
      </Flex>
      <Flex gap={"2"} align={"center"} direction={"column"}>
        {a && <Button className={win === null ? "" : "button_to_disable_on_win"} size={"2"} onClick={handleClick}>{buttonName}</Button>}
        <Flex gap={"2"} direction={{initial:"column",sm:"row"}} align={"center"}>  
          <Box className="custom-audio-upload">
            <input 
              type="file" 
              multiple
              onChange={addFile}
              id="audioFileInput"
              accept="audio/*" />
              <label rel="audioFileInput">{a ? win !== null ? "Nouvelle musique" : "Remplacer la musique" : "Envoyer un fichier"}</label>
          </Box> 
          {a && <Box className="custom-audio-upload">
            <input 
              type="file" 
              multiple
              onChange={addNextFile}
              id="audioFileInput"
              accept="audio/*" />
              <label rel="audioFileInput">Jouer juste après</label>
          </Box>} 
          {a && <Box className="custom-audio-upload">
            <input 
              type="file" 
              multiple
              onChange={addLastFile}
              id="audioFileInput"
              accept="audio/*" />
              <label rel="audioFileInput">Ajouter à la playlist</label>
          </Box>} 
        </Flex>
        <Flex gap={"2"} direction={{initial:"column",sm:"row"}} align={"center"}>
          <HowToPlay />
          {audio && <Playlist audio={audio} audioFiles={audioFiles}/>}
          <FreeMusic setAudioFiles={setAudioFiles} audioFiles={audioFiles} setAudio={setAudio} win={win}/>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AudioPlayer;