import { Address, ethereum, crypto, BigInt, Bytes, ByteArray, log } from '@graphprotocol/graph-ts'
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
  vestingPeriod: BigInt,
  refundee: Address
): ByteArray {
  log.debug(
    'Compute Incentive ID: {} {} {} {} {} {}',
    [
      rewardToken.toHexString(),
      pool.toHexString(),
      startTime.toString(),
      endTime.toString(),
      vestingPeriod.toString(),
      refundee.toHexString(),
    ]
  )
let tupleArray: Array<ethereum.Value> = [
    ethereum.Value.fromAddress(rewardToken),
    ethereum.Value.fromAddress(pool),
    ethereum.Value.fromUnsignedBigInt(startTime),
    ethereum.Value.fromUnsignedBigInt(endTime),
    ethereum.Value.fromUnsignedBigInt(vestingPeriod),
    ethereum.Value.fromAddress(refundee),
  ]

  let tuple = changetype<ethereum.Tuple>(tupleArray)

  let incentiveIdEncoded = ethereum.encode(
    ethereum.Value.fromTuple(tuple)
  )
  let incentiveId = crypto.keccak256(incentiveIdEncoded as ByteArray)

  return incentiveId
}
