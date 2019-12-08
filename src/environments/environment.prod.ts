import { VERSION as version_info } from './version-info';

export const environment = {
  production: true,
  api_base_url: `${location.protocol}//api.${location.hostname}`,
  version_info
};
