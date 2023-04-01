import { BigInt } from '@graphprotocol/graph-ts'
import { Position } from '../../generated/schema'

export function getPosition(tokenId: BigInt): Position {
  let position = Position.load(tokenId.toString())
  if (position == null) {
    position = new Position(tokenId.toString())
  }
  return position as Position
}