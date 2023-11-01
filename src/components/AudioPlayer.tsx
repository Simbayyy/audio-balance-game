import { useState, useEffect } from "react";
// @ts-ignore
import * as Tone from 'tone'
import { Counter } from "./Counter";

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
  const [baseGrainSize, setBaseGrainSize] = useState(0)

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
        audioContext.decodeAudioData(buffer).then(async (data) => {
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
            a.sync().start()
            a.onstop = () => {console.log(buttonName)}
            let newBaseGrainSize = a.toSeconds(a.grainSize)
            setBaseGrainSize(newBaseGrainSize)
            setMusicTime(Math.floor(a.buffer.duration))
            Tone.Transport.start()
            a.grainSize = 0.95**(-newBaseTempo-tempoShift) * newBaseGrainSize
            setButtonName("Stop");
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

  const addFile = (e:React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files) {
        if (e.target.files[0]) {
          setAudio(e.target.files[0]);
        }
    }
  };
  const handlePitchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPitchShift(Number(e.target.value))

    if (a) a.detune = (basePitch + pitchShift) * 100
  }

  
  const handleTempoChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setTempoShift(Number(e.target.value))
    if (a) a.grainSize = 0.95**(-baseTempo-Number(e.target.value)) * baseGrainSize
  }

  const handleStatus = () => {
  }

  return (
    <div>
      <Counter initTime={musicTime} />
      <div>{basePitch}{baseTempo}</div>
      <div>
        <button onClick={handleClick}>{buttonName}</button>
        <button onClick={handleStatus}>Status</button>
        <input type="number" onChange={handlePitchChange} value={pitchShift} />
        <input type="number" onChange={handleTempoChange} value={tempoShift} />
        <input type="file" onChange={addFile} />
      </div>
    </div>
  );
};

export default AudioPlayer;