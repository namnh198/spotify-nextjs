import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

export default function useSpotify() {
  const {data: session} = useSession()
  
  useEffect(() => {
    if(session) {
        // If refresh access token attempt fails, redirect user to login...
        if(session.error == 'RefreshAccessTokenError') {
          signIn();
        }

        spotifyApi.setAccessToken(session.user.accessToken)
    }
  }, [session])

  return spotifyApi
}