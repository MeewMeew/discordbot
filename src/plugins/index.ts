import { FilePlugin } from '@distube/file';
import { SpotifyPlugin } from '@distube/spotify'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { YouTubePlugin } from '@distube/youtube'
import { YtDlpPlugin } from '@distube/yt-dlp'
import { DirectLinkPlugin } from '@distube/direct-link'
import { DeezerPlugin } from '@distube/deezer'
import { TidalPlugin } from 'distube-tidal'
import { AppleMusicPlugin } from 'distube-apple-music'

export const plugins = [
  new FilePlugin(),
  new SpotifyPlugin(),
  new SoundCloudPlugin(),
  new YouTubePlugin(),
  new YtDlpPlugin({
    update: true,
  }),
  new DirectLinkPlugin(),
  new DeezerPlugin(),
  new TidalPlugin(),
  new AppleMusicPlugin()
]