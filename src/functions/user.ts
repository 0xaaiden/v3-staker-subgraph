import { Address } from '@graphprotocol/graph-ts'
import { User } from '../../generated/schema'

export function getUser(addy: Address): User {
  let user = User.load(addy.toHex())

  if (user == null) {
    user = new User(addy.toHex())
    user.save()
  }

  return user as User
}