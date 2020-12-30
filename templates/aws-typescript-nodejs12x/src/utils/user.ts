import { parseUserId } from '../auth/utils'


/**
 * While we develope everything we use a default offline user to test CRUD Operations.
 * @param auth
 */
export function getUser(auth: string) {
  const split: any = auth.split(' ')
  if (split.length < 2) {
    return 'offline-user'
  } else {
    return parseUserId(split[1])

  }

}