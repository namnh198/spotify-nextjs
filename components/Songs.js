import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"

import Song from "./Song"

export default function Songs() {
  const playlist = useRecoilValue(playlistState)

  return (
    <div className="flex flex-col px-8 pb-2 space-y-1 text-white">
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i}/>
      ))}
    </div>
  )
}