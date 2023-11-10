import { useState, useEffect, useRef } from "react";
// @ts-ignore
import { GrainPlayer, Transport, loaded, start } from 'tone'
import { Counter } from "./Counter";
import { Box, Button, Flex, Text, Popover, TextField } from "@radix-ui/themes";
import { VariableSlider } from "./VariableSlider";
import { HowToPlay } from "./HowToPlay";
import { Playlist } from "./Playlist";
import { FreeMusic } from "./FreeMusic";
import { ProgressBar } from "./ProgressBar";
import { Difficulty, DifficultyKey, Score, difficulties } from "./Page";
import { useMediaQuery } from 'react-responsive'

const AudioContext = window.AudioContext;
const audioContext = new AudioContext();

const AudioPlayer: React.FunctionComponent<{
  audio: File | null | undefined
  audioFiles: File[]
  setAudio: React.Dispatch<React.SetStateAction<File | null | undefined>>
  setAudioFiles: React.Dispatch<React.SetStateAction<File[]>>
  scoreList: Score[]
  setScoreList: React.Dispatch<React.SetStateAction<Score[]>>
  difficulty: DifficultyKey
}> = ({
  audio,
  audioFiles,
  setAudio,
  setAudioFiles,
  scoreList,
  setScoreList,
  difficulty
}) => {
  const [buttonName, setButtonName] = useState("Jouer");
  const [pitchShift, setPitchShift] = useState(0);
  const [tempoShift, setTempoShift] = useState(0);
  const [musicTime, setMusicTime] = useState(-1)
  const [basePitch, setBasePitch] = useState(0)
  const [baseTempo, setBaseTempo] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [win, setWin] = useState<'win' | 'lose' | null>(null)
  const [title, setTitle] = useState("Bienvenue ! Lance un fichier son pour commencer")
  const [time, setTime] = useState(-1)
  const [score, setScore] = useState(0)
  const [music, setMusic] = useState<GrainPlayer | null>(null)
  const [nextMusic, setNextMusic] = useState<GrainPlayer | null>(null)
  const [progress, setProgress] = useState<'hidden' | 'started' | 'ended' >('hidden');
  const [url, setUrl] = useState('');
  const [youtubeError, setYoutubeError] = useState(false);
  const [diffParams, setDiffParams] = useState<Difficulty>(difficulties[difficulty]);
  const buttonNameRef = useRef('Jouer')
  const isDesktop = useMediaQuery({
    query: '(min-width:1024px)'
  })


  let isLoading = false
  let nextSongTimeout: NodeJS.Timeout
  
  useEffect(() => {
    start();
  }, [])

  useEffect(() => {
    if (music) {
      music.stop();
      audioContext.resume()
      music.dispose()
      setButtonName("Chargement...");
      buttonNameRef.current = "Chargement...";
    }
    if (audio) {
      startAudio(audio)
      audioContext.resume()
    }
  }, [audio]);

  useEffect(() => {
    if (win !== null || title === "Bienvenue ! Lance un fichier son pour commencer") {
      nextSong()
    }
  }, [audioFiles])

  useEffect(() => {
    if (win !== null || title === "Bienvenue ! Lance un fichier son pour commencer") {
      setDiffParams(difficulties[difficulty])
    }
  }, [difficulty])

  const startAudio = async (audio:File, refresh=false) => {
    clearTimeout(nextSongTimeout)
    isLoading = true
    let reader = new FileReader()
    let loadingMusic: GrainPlayer | null
    if (nextMusic && !refresh) {
      loadingMusic = nextMusic
      setNextMusic(null)
      preloadNextSong(audioFiles.length != 0 ? audioFiles[0] : null)
    } else {
      setProgress('started')
      reader.readAsArrayBuffer(audio)
      loadingMusic = await audio.arrayBuffer().then((buffer) => {
        return audioContext.decodeAudioData(buffer)
        .then(async (data) => {
          let newLoadingMusic = new GrainPlayer({url:data})
          await loaded();
          return newLoadingMusic
        })
      })
      .catch((err) => {
        console.error("something went wrong loading file:\n" + `${err}` )
        return null
      })
      setProgress('ended')
      setTimeout(() => {setProgress("hidden")}, 1000)
      preloadNextSong(audioFiles.length != 0 ? audioFiles[0] : null)
    }
    if (loadingMusic) {
        let newDiffParams = difficulties[difficulty]
        setDiffParams(newDiffParams)
        setPitchShift(0)
        setTempoShift(0)
        if (music) music.dispose()
        loadingMusic.toDestination();
        loadingMusic.loopEnd = loadingMusic.buffer.duration
        loadingMusic.loopStart = 0
        loadingMusic.loop = true
        let newBasePitch = Math.floor(Math.random() * (newDiffParams.pitchStepNumber + 1) - newDiffParams.pitchStepNumber / 2) 
        setBasePitch(newBasePitch)
        let newBaseTempo = Math.floor(Math.random() * (newDiffParams.tempoStepNumber + 1) - newDiffParams.tempoStepNumber / 2) 
        setBaseTempo(newBaseTempo)
        if (Math.floor(loadingMusic.buffer.duration) === musicTime) {
          setMusicTime(musicTime + 1)
        } else {
          setMusicTime(Math.floor(loadingMusic.buffer.duration))
        }
        setWin(null)
        setTitle(`En écoute : ${audio.name}`)
        setAttempts(0)
        setScore(0)
        loadingMusic.detune = 1 + (newBasePitch + pitchShift) * newDiffParams.pitchStep
        loadingMusic.sync().start()
        Transport.start()
        setTimeout(() => {
          if (buttonNameRef.current = 'Pause') Transport.start()
        }, 100)
        loadingMusic.playbackRate = 0.999 * newDiffParams.tempoStep**(-newBaseTempo-tempoShift)
        setMusic(loadingMusic)
        setButtonName("Pause");
        buttonNameRef.current = 'Pause'
      }
    isLoading = false
  }

  const handleClick = () => {
    if(!(audioContext.state === 'running' || audioContext.state === 'closed' )) {
      audioContext.resume()
    }

    if (music) {
        if (buttonName === "Jouer") {
          if (win !== null) {
            nextSong(true)
          } else {
            Transport.start()
          }
          setButtonName("Pause");
          buttonNameRef.current = 'Pause'
        } else {
          Transport.pause()
          setButtonName("Jouer");
          buttonNameRef.current = 'Jouer'
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
      music?.stop("+15")
      clearTimeout(nextSongTimeout)
      nextSongTimeout = setTimeout(() => nextSong(), 15000)
    } 
  }, [win])

  const nextSong = (force?: boolean) => {
    if (audioFiles.length !== 0 && !isLoading && (buttonNameRef.current === "Pause" || title === "Bienvenue ! Lance un fichier son pour commencer" || force)) {
      let newAudioFiles = audioFiles
      setAudio(newAudioFiles.shift())
      setAudioFiles(newAudioFiles)
    }
  }

  const preloadNextSong = (nextSong: File | null) => {
    if (nextSong) {
      nextSong.arrayBuffer().then((buffer) => {
        audioContext.decodeAudioData(buffer)
        .then(async (data) => {
          let loadingMusic = new GrainPlayer({url:data})
          loaded().then(() => {
            setNextMusic(loadingMusic)
          })
        })
    })
    }
  }

  const addFile = (e:React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files) {
      let filesToAdd = [...e.target.files]
        if (filesToAdd.length !== 0) {
          let newAudio = filesToAdd.shift()
          if (newAudio === audio && audio) {
            startAudio(audio,true)
          } else {
            setAudio(newAudio);
          }
          let nextAudioFiles = audioFiles.concat(filesToAdd)
          setAudioFiles(nextAudioFiles)
          setNextMusic(null)
          setTitle("Chargement")
        }
    }
  };

  const addNextFile = (e:React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files) {
      let filesToAdd = [...e.target.files]
        if (filesToAdd.length !== 0) {
          let nextAudioFiles = filesToAdd.concat(audioFiles)
          setAudioFiles(nextAudioFiles)
          if (win == null) preloadNextSong(nextAudioFiles.length != 0 ? nextAudioFiles[0] : null)

        }
    }
  };

  const addLastFile = (e:React.ChangeEvent<HTMLInputElement> ) => {
    if (e.target.files) {
      let filesToAdd = [...e.target.files]
        if (filesToAdd.length !== 0) {
          let nextAudioFiles = audioFiles.concat(filesToAdd)
          setAudioFiles(nextAudioFiles)
          if (win == null) preloadNextSong(nextAudioFiles.length != 0 ? nextAudioFiles[0] : null)
        }
    }
  };

  const checkWin = (a:GrainPlayer | null) => {
    if (win === null) {
      if (a && a.detune === 1 && a.playbackRate === 0.999) {
        setWin("win")
        let coeffAttempts = Math.exp(-attempts/8)
        let coeffTime = Math.exp(-Math.max(musicTime - time - 10,0)/200)
        let newScore = Math.floor((990 * coeffAttempts * coeffTime + 10) * diffParams.scoreMultiplier)
        setScore(newScore)
        let newScoreList = [{
          score:newScore,
          title:title
            .replace(/^En écoute : /, "")
            .replace(/\.[^.]{1,5}$/, "")
        },...scoreList]
        setScoreList(newScoreList)
        setAttempts(0)
        const url = `${
          import.meta.env.VITE_ENV === "prod" ? "http://localhost:3000" : ""
        }/api/store-score`;    
        fetch(url,
          {
            body: JSON.stringify({ score:newScore, name:audio ? audio.name : "" }),
            method: "POST",
            headers: { "Content-Type": "application/json" },  
          }) 
      } else {
        setAttempts(attempts + 1)
      }
    }
  }

  const handleUrlChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const fetchYoutube = async (url:string) => {
    try {
      let name:string
      let newAudio = await fetch(`${
        import.meta.env.VITE_ENV === "prod" ? "http://localhost:3000" : ""
      }/api/find-mp3-link`,
      {
        method:'POST',
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify({ url:url })
      }).then((res) => {
          name = res.headers.get('Name') ?? "Nom non trouvé"
          return res.blob()
        })
        .then((blob) => {
          return new File([blob], name)
        })
        .catch(() => {
          throw Error('Could not fetch audio from youtube URL')
        })
      setYoutubeError(false)
      return newAudio
    } catch (err) {
      setYoutubeError(true)
      console.error(err)
      return null
    }
  } 

  useEffect(() => {
    if (music) music.detune = 1 + (basePitch + pitchShift) * diffParams.pitchStep
  }, [pitchShift])

  useEffect(() => {
    if (music) music.playbackRate = 0.999 * diffParams.tempoStep**(-baseTempo-tempoShift)
  }, [tempoShift])

  return (
    <Flex py={"6"} direction={"column"} grow={"1"} style={isDesktop ?{height:'100vh',overflowY:'auto',scrollbarWidth:'thin'} : {}} align={"center"} gap={"6"}>
      <Text align={"center"} weight={"bold"}>{title}</Text>
      <Counter initTime={musicTime} pause={buttonNameRef} win={win} setWin={setWin} time={time} setTime={setTime}/>
      {win !== null && <Text size={"6"}>Score : {score}</Text>}
      {progress !== 'hidden' && <ProgressBar progress={progress} />}
      {progress === 'hidden' && <Flex gap={"4"} px={"2"} align={"center"}>
            <Button className={win === null ? "" : "button_to_disable_on_win"} onClick={() => checkWin(music)}>Vérifier la réponse</Button>
            {attempts !== 0 && <Text align={"center"}>{`Essaye encore ! Déjà ${attempts} essai${attempts != 1 ? 's' :""}`}</Text>}
          </Flex>}
      <Flex direction={"column"} gap={"4"}>
        <VariableSlider name={"Ton"} maxValue={diffParams.pitchStepNumber} stateVariable={pitchShift} setFunction={win === null ? setPitchShift : null} rightText="Plus aigu" leftText="Plus grave" />
        <VariableSlider name={"Tempo"} maxValue={diffParams.tempoStepNumber} stateVariable={tempoShift} setFunction={win === null ? setTempoShift : null} rightText="Plus rapide" leftText="Plus lent"/>
      </Flex>
      <Flex gap={"2"} align={"center"} direction={"column"}>
        {music && 
        <Flex gap={"2"}>
          {win === null ? <Button 
            className={win === null ? "" : "button_to_disable_on_win"} 
            size={"2"} 
            onClick={handleClick}
            >
              {buttonName}
          </Button>
          : audioFiles.length !== 0 && <Button 
            size={"2"} 
            onClick={() => {nextSong()}}
            >
              Suivante
          </Button>}
          {win === null ? <Button 
            className={win === null ? "" : "button_to_disable_on_win"} 
            size={"2"} 
            onClick={() => setWin("lose")}
            >
              Abandonner
          </Button>
          : <Button 
            size={"2"} 
            onClick={() => {if (audio) startAudio(audio,true)}}
            >
              Réessayer
          </Button>
}
        </Flex>
          }

        <Flex gap={"2"} direction={{initial:"column",sm:"row"}} align={"center"}>  
          <Box className="custom-audio-upload">
            <input 
              type="file" 
              multiple
              onChange={addFile}
              id="audioFileInput"
              accept="audio/*" />
              <label className="audio-label" rel="audioFileInput">{music ? win !== null ? "Nouvelle musique" : "Remplacer la musique" : "Envoyer un fichier"}</label>
          </Box> 
          {music && <Box className="custom-audio-upload">
            <input 
              type="file" 
              multiple
              onChange={addNextFile}
              id="audioFileInput"
              accept="audio/*" />
              <label className="audio-label" rel="audioFileInput">Jouer juste après</label>
          </Box>} 
          {music && <Box className="custom-audio-upload">
            <input 
              type="file" 
              multiple
              onChange={addLastFile}
              id="audioFileInput"
              accept="audio/*" />
              <label className="audio-label" rel="audioFileInput">Ajouter à la playlist</label>
          </Box>} 
        </Flex>
        <Flex gap={"2"} direction={{initial:"column",sm:"row"}} align={"center"}>  
          <Popover.Root>
              <Popover.Trigger>
                <Box className="custom-audio-upload">
                  <Text className="audio-label">Ajouter depuis YouTube</Text>
                </Box>
              </Popover.Trigger>
              <Popover.Content>
                  <TextField.Root>
                      <TextField.Input
                       placeholder='https://www.youtube.com/watch?v='
                       type="text"
                       value={url}
                       onChange={handleUrlChange}
                       />
                  </TextField.Root>
                  <Flex direction={"column"}>
                    <Text size={"2"} style={{fontStyle:'italic',padding:"0.5rem"}}>{`${youtubeError ? "Une erreur est survenue, merci de réessayer" : "Entre un lien YouTube pour jouer cette chanson"}`}</Text>
                    <Flex direction={"row"} justify={"between"}>
                      <Popover.Close>
                        <Button onClick={() => {
                          fetchYoutube(url).then((res) => {
                            if (res) setAudio(res)
                          })
                          }}>
                          Jouer
                        </Button>
                      </Popover.Close>
                      <Popover.Close>
                        <Button onClick={() => {
                          fetchYoutube(url).then((res) => {
                            if (res) {
                              let nextAudioFiles = [res].concat(audioFiles)
                              setAudioFiles(nextAudioFiles)
                              if (win == null) preloadNextSong(nextAudioFiles.length != 0 ? nextAudioFiles[0] : null)                  
                            }
                          })
                          }}>
                          Jouer après
                        </Button>
                      </Popover.Close>
                      <Popover.Close>
                        <Button onClick={() => {
                          fetchYoutube(url).then((res) => {
                            if (res) {
                              let nextAudioFiles = audioFiles.concat([res])
                              setAudioFiles(nextAudioFiles)
                              if (win == null) preloadNextSong(nextAudioFiles.length != 0 ? nextAudioFiles[0] : null)                  
                            }
                          })
                          }}>
                          Jouer à la fin
                        </Button>
                      </Popover.Close>
                    </Flex>
                  </Flex>
              </Popover.Content>
          </Popover.Root>
        </Flex>
        <FreeMusic setAudioFiles={setAudioFiles} audioFiles={audioFiles} setAudio={setAudio} win={win}/>
        <Flex gap={"2"} direction={{initial:"column",sm:"row"}} align={"center"}>
          <HowToPlay />
          {audio && <Playlist audio={audio} audioFiles={audioFiles}/>}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AudioPlayer;