import { request } from 'undici'
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
  return request(url, {
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
      request(matchSecond[0]).then((res) => {
        const matchThird = regexVideoID.exec(res.headers.location as string)
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
      const { body } = await request(`https://app.publer.io/api/v1/job_status/${jobId}`, {
        headers: {
          ...publerHeaders,
          'method': 'GET',
          'path': `/api/v1/job_status/${jobId}`,
        }
      })
      const { payload, status } = await body.json() as { payload: { path: string }[], status: string }
      if (status === 'complete') {
        resolve(payload.map(({ path }) => ({ attachment: path, name: path.split('/').pop() as string })))
        clearInterval(interval)
      }
    }, 1e3)
  })
}

export async function facebookPublicVideo(url: string): Promise<File[]> {
  if (!url) return []
  const res = await request('https://app.publer.io/hooks/media', {
    method: 'POST',
    headers: {
      ...publerHeaders,
      'method': 'POST',
      'path': '/hooks/media',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
  const { job_id } = await res.body.json() as { job_id: string }
  log.info('Waiting Job ID:', job_id)
  return working(job_id)
}

export async function tiktokPublicMedia(url: string): Promise<File[]> {
  if (!url) return []
  const { id, type } = await extractTiktokURL(url)
  if (!id) return []
  const queries = encode({ ...tiktokQueries, aweme_id: id }, '?')
  config.debug && log.debug('TikTok Queries:', `${tiktokFeed}${queries}`)
  const res = await makeTikTokRequest(`${tiktokFeed}${queries}`)
  const data = await res.body.json()
  await Bun.write('tiktok.json', JSON.stringify(data, null, 2))
  const { aweme_list } = data as Ameme
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