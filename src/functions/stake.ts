import { BigInt } from '@graphprotocol/graph-ts'
import { Stake } from "../../generated/schema";

export function getStake(tokenId: BigInt, incentiveId: string): Stake {
  const id = tokenId.toString().concat('-').concat(incentiveId.toString())
  
  let stake = Stake.load(id)

  if (stake == null) {
    stake = new Stake(id)
  }

  return stake as Stake
}