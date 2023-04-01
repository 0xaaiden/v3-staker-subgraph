import { Address, ethereum, crypto, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Incentive } from '../../generated/schema'

export function getIncentive(incentiveId: string): Incentive {
  let incentive = Incentive.load(incentiveId)

  if (incentive == null) {
    incentive = new Incentive(incentiveId)
  }

  return incentive as Incentive
}


export function computeIncentiveId(
  rewardToken: Address,
  pool: Address,
  startTime: BigInt,
  endTime: BigInt,
  refundee: Address
): string {
  let incentiveIdTuple: Array<ethereum.Value> = [
    ethereum.Value.fromAddress(rewardToken),
    ethereum.Value.fromAddress(pool),
    ethereum.Value.fromUnsignedBigInt(startTime),
    ethereum.Value.fromUnsignedBigInt(endTime),
    ethereum.Value.fromAddress(refundee),
  ]
  
  let incentiveIdEncoded = ethereum.encode(
    ethereum.Value.fromTuple(incentiveIdTuple as ethereum.Tuple)
  )
  let incentiveId = crypto.keccak256(incentiveIdEncoded as Bytes)

  return incentiveId.toHexString()
}