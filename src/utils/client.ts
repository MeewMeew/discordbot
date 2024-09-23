import { request } from 'undici'
import { Signale } from 'signale'
const log = new Signale({ scope: "client request" })

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

function working(jobId: string): Promise<string | null> {
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
        resolve(payload?.[0]?.path)
        clearInterval(interval)
      }
    }, 1e3)
  })
}

export async function facebookPublicVideo(url: string): Promise<string | null> {
  if (!url) return null
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