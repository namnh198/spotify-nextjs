import { useSession } from "next-auth/react"
import useSpotify from "../hooks/useSpotify"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import { useCallback, useEffect, useState } from "react"
import useSongInfo from "../hooks/useSongInfo"
import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline"
import { VolumeUpIcon } from "@heroicons/react/solid"
import { debounce } from "lodash"

export default function Player() {
  const spotifyApi = useSpotify()
  const {data: session} = useSession()
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)

  const songInfo = useSongInfo()

  const fetchCurrentSong =  () => {
    if(! songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data?.body?.item?.id)
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data?.body?.is_playing)
        })
      })
    }
  }

  useEffect(() => {
    if(spotifyApi.getAccessToken() && ! currentTrackId) {
      // fetch the song info
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if(volume > 0 && volume < 100) {
      debounceAdjustVolume(volume)
    }
  }, [volume])

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {})
    }, 500, [])
  )

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if(data?.body?.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play();
        setIsPlaying(true)
      }
    })
  }

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img className='rounded-md hidden md:inline h-10 w-10' src={songInfo?.album.images[0]?.url} />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button"/>
        <RewindIcon className="button"/>

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"/>
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"/>
        )}
        <FastForwardIcon className="button"/>
        <ReplyIcon className="button"/>
      </div>
      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end">
        <VolumeDownIcon className="button" onClick={() => volume > 0 && setVolume(volume - 10)}/>
        <input type="range" className="w-14 md:w-28" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))}/>
        <VolumeUpIcon className="button" onClick={() => volume < 100 && setVolume(volume + 10)}/>
      </div>    
    </div>
  )
}