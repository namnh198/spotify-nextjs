import {HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon} from '@heroicons/react/outline'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { playlistIdState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
 
export default function Sidebar() {
  const spotifyApi = useSpotify()
  const {data:session} = useSession()
  const [playlists, setPlayLists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
  
  useEffect(() => {
    if(spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlayLists(data.body.items)
      })
    }
  }, [session, spotifyApi])
  
  return (
    <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36'>
      <div className='space-y-4'>
        <button className='flex flex-row items-center space-x-2 hover:text-white' onClick={() => signOut()}>
          <span>Logout</span>
        </button>
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
          <HomeIcon className='h-5 w-5'/>
          <span>Home</span>
        </button>
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
          <SearchIcon className='h-5 w-5'/>
          <span>Search</span>
        </button>
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
          <LibraryIcon className='h-5 w-5'/>
          <span>Your Library</span>
        </button>
        <hr className='border-top-{0.1px} border-gray-900' />
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
          <PlusCircleIcon className='h-5 w-5'/>
          <span>Create Playlist</span>
        </button>
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
          <HeartIcon className='h-5 w-5'/>
          <span>Liked songs</span>
        </button>
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
          <RssIcon className='h-5 w-5'/>
          <span>Your episodes</span>
        </button>
        <hr className='border-top-{0.1px} border-gray-900' />

        {/* Playlists */}
        {playlists.map((playlist) => (
          <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className='cursor-pointer hover:text-white'>{playlist.name}</p>
        ))}
      </div>
    </div>
  )
}