const BASE_URL = 'https://filelist.io';

export const SEARCH_ENDPOINT = `${BASE_URL}/browse.php`;
export const DOWNLOAD_ENDPOINT = `${BASE_URL}/download.php`;
export const TORRENT_MAPPING = {
  SEARCH_IN: {
    NAME: 1,
  },
  SORT: {
    DOWNLOAD: 4,
  },
};
