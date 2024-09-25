import xior from 'xior'
import { Signale } from 'signale'
const log = new Signale({ scope: "client request" })
import { encode } from 'qss'
import config from '../../config.json'

export type File = { attachment: string; name: string }

export type Ameme = {
  aweme_list: {
    video: {
      play_addr_h264: {
        uri: string
        url_list: string[]
      }
    }
    image_post_info: {
      images: {
        display_image: {
          uri: string
          url_list: string[]
        }
      }[]
    }
  }[]
}

export type PublerResponse = {
  payload: {
    path: string,
    error: string,
    type: 'video' | 'photo',
  }[],
  status: string
}

const publerHeaders = {
  'authority': 'app.publer.io',
  Origin: 'https://publer.io',
  Referer: 'https://publer.io/',
  DNT: '1',
  'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
}

const tiktokHeaders = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
  'referer': 'https://www.tiktok.com/',
  'origin': 'https://www.tiktok.com',
  'cookie': 'CykaBlyat=XD',
  'x-ladon': "Hello From MewTheDev!",
}

const tiktokQueries = {
  iid: '7318518857994389254',
  device_id: '7318517321748022790',
  channel: 'googleplay',
  app_name: 'musical_ly',
  version_code: '300904',
  device_platform: 'android',
  device_type: 'SM-ASUS_Z01QD',
  os_version: '9',
}

const tiktokDomain = 'https://api22-normal-c-alisg.tiktokv.com'
const tiktokFeed = `${tiktokDomain}/aweme/v1/feed/`

function makeTikTokRequest(url: string, headers: Record<string, string> = {}) {
  return xior.get<Ameme>(url, {
    headers: {
      ...tiktokHeaders,
      ...headers,
    }
  })
}

function extractTiktokURL(url: string): Promise<{ id: string, type: 'video' | 'photo' }> {
  return new Promise(resolve => {
    const regexVideoID = /tiktok\.com(.*)\/(video|photo)\/(\d+)/gm
    const matchFirst = regexVideoID.exec(url)

    const regexCode = /^https:\/\/(vt|vm)\.tiktok\.com\/[a-zA-Z0-9]+\/?$/gm
    const matchSecond = regexCode.exec(url)

    if (matchFirst) {
      return resolve({
        id: matchFirst[3],
        type: matchFirst[2] as 'video' | 'photo',
      })
    } else if (matchSecond) {
      xior.get(matchSecond[0]).then((res) => {
        const matchThird = regexVideoID.exec(res.response.url)
        return resolve({
          id: matchThird![3],
          type: matchThird![2] as 'video' | 'photo',
        })
      })
    }
  })
}

function working(jobId: string): Promise<File[]> {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const { data: { payload, status } } = await xior.get<PublerResponse>(`https://app.publer.io/api/v1/job_status/${jobId}`, {
        headers: {
          ...publerHeaders,
          'method': 'GET',
          'path': `/api/v1/job_status/${jobId}`,
        }
      })
      if (status === 'complete') {
        resolve(
          payload[0]?.error ? [] :
            payload.map(({ path, type }) => {
              return ({ attachment: path, name: `${jobId}.${type === 'video' ? 'mp4' : 'jpg'}` })
            })
        )
        clearInterval(interval)
      }
    }, 1e3)
  })
}

export async function facebookPublicVideo(url: string): Promise<File[]> {
  if (!url) return []
  const { data: { job_id } } = await xior.post<{ job_id: string }>('https://app.publer.io/hooks/media', { url: url }, {
    headers: {
      ...publerHeaders,
      'method': 'POST',
      'path': '/hooks/media',
      'content-type': 'application/json',
    },
  })
  return working(job_id)
}

export async function tiktokPublicMedia(url: string): Promise<File[]> {
  if (!url) return []
  const { id, type } = await extractTiktokURL(url)
  if (!id) return []
  const queries = encode({ ...tiktokQueries, aweme_id: id }, '?')
  config.debug && log.debug('TikTok Queries:', `${tiktokFeed}${queries}`)
  const { data: { aweme_list } } = await makeTikTokRequest(`${tiktokFeed}${queries}`)
  if (!aweme_list) return []
  const { video, image_post_info } = aweme_list[0]
  if (type === 'video') {
    return [{ attachment: video.play_addr_h264.url_list[1], name: video.play_addr_h264.uri.replace(/\//g, '_') + '.mp4' }]
  } else {
    return image_post_info.images.map(({ display_image: { uri, url_list } }) => {
      return { attachment: url_list[1], name: uri.replace(/\//g, '_') + '.jpg' }
    })
  }
}