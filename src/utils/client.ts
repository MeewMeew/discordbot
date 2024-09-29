import xior from 'xior';
import { encode } from 'qss';
import config from '../../config.json';
import logger from './logger';

const log = logger.scope('utils:client');

export type File = { attachment: string; name: string };

export type Ameme = {
  aweme_list: {
    video: { play_addr_h264: { uri: string; url_list: string[] } };
    image_post_info: { images: { display_image: { uri: string; url_list: string[] } }[] };
  }[];
};

export type PublerResponse = {
  payload: { path: string; error: string; type: 'video' | 'photo' }[];
  status: string;
};

const publerHeaders = {
  authority: 'app.publer.io',
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
};

const tiktokHeaders = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
  referer: 'https://www.tiktok.com/',
  origin: 'https://www.tiktok.com',
  cookie: 'CykaBlyat=XD',
  'x-ladon': "Hello From MewTheDev!",
};

const tiktokQueries = {
  iid: '7318518857994389254',
  device_id: '7318517321748022790',
  channel: 'googleplay',
  app_name: 'musical_ly',
  version_code: '300904',
  device_platform: 'android',
  device_type: 'SM-ASUS_Z01QD',
  os_version: '9',
};

const tiktokDomain = 'https://api22-normal-c-alisg.tiktokv.com';
const tiktokFeed = `${tiktokDomain}/aweme/v1/feed/`;

const makeTikTokRequest = (url: string, headers: Record<string, string> = {}) =>
  xior.get<Ameme>(url, { headers: { ...tiktokHeaders, ...headers } });

const extractTiktokURL = async (url: string): Promise<{ id: string; type: 'video' | 'photo' }> => {
  const regexVideoID = /tiktok\.com(.*)\/(video|photo)\/(\d+)/gm;
  const matchFirst = regexVideoID.exec(url);
  const regexCode = /^https:\/\/(vt|vm)\.tiktok\.com\/[a-zA-Z0-9]+\/?$/gm;
  const matchSecond = regexCode.exec(url);

  if (matchFirst) {
    return { id: matchFirst[3], type: matchFirst[2] as 'video' | 'photo' };
  } else if (matchSecond) {
    const res = await xior.get(matchSecond[0]);
    const matchThird = regexVideoID.exec(res.response.url);
    return { id: matchThird![3], type: matchThird![2] as 'video' | 'photo' };
  }
  throw new Error('Invalid URL');
};

const socialWorking = async (jobId: string): Promise<File[]> => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const { data: { payload, status } } = await xior.get<PublerResponse>(`https://app.publer.io/api/v1/job_status/${jobId}`, {
        headers: { ...publerHeaders, method: 'GET', path: `/api/v1/job_status/${jobId}` },
      });
      if (status === 'complete') {
        clearInterval(interval);
        resolve(payload[0]?.error ? [] : payload.map(({ path, type }, i) => ({
          attachment: path,
          name: `${jobId + i}.${type === 'video' ? 'mp4' : 'jpg'}`,
        })));
      }
    }, 1000);
  });
};

export const socialPublicMedia = async (url: string): Promise<File[]> => {
  if (!url) return [];
  const { data: { job_id } } = await xior.post<{ job_id: string }>('https://app.publer.io/hooks/media', { url }, {
    headers: { ...publerHeaders, method: 'POST', path: '/hooks/media', 'content-type': 'application/json' },
  });
  return socialWorking(job_id);
};

export const tiktokPublicMedia = async (url: string): Promise<File[]> => {
  if (!url) return [];
  const { id, type } = await extractTiktokURL(url);
  if (!id) return [];
  const queries = encode({ ...tiktokQueries, aweme_id: id }, '?');
  config.debug && log.debug('TikTok Queries:', `${tiktokFeed}${queries}`);
  const { data: { aweme_list } } = await makeTikTokRequest(`${tiktokFeed}${queries}`);
  if (!aweme_list) return [];
  const { video, image_post_info } = aweme_list[0];

  return type === 'video' ? [{
    attachment: video.play_addr_h264.url_list[1],
    name: video.play_addr_h264.uri.replace(/\//g, '_') + '.mp4',
  }] : image_post_info.images.map(({ display_image: { uri, url_list } }) => ({
    attachment: url_list[1],
    name: uri.replace(/\//g, '_') + '.jpg',
  }));
};
