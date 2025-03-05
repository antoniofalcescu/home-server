import { ChmodFlags } from '../../../../../../common/helpers/command-helper/types';

export const ON_DOWNLOAD_FINISHED = {
  ACL: 'jellyfin allow read,execute',
  FLAGS: ['-R', '+a'] as ChmodFlags[],
};
