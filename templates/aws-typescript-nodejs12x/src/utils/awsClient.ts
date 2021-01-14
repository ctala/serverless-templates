/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Creates the proper AWS Client depending if we are offline.
 */
export function getAWSClient() {
  if (process.env.IS_OFFLINE) {
    return require('aws-sdk');
  } else {
    return require('aws-xray-sdk').captureAWS(require('aws-sdk'));
  }
}
