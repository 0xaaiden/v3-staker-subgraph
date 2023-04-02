import { Address } from '@graphprotocol/graph-ts'
import {
  DepositTransferred,
  IncentiveCreated,
  IncentiveEnded,
  TokenStaked,
  TokenUnstaked,
  RewardClaimed,
  V3Staker,
  EndIncentiveCall,
} from "../../generated/V3Staker/V3Staker";
import { getIncentive, computeIncentiveId, getV3Staker, getUser, getPosition, getStake } from '../functions'
import { BIG_INT_ONE, BIG_INT_ZERO } from '../constants'


export function handleIncentiveCreated(event: IncentiveCreated): void {
  // emit IncentiveCreated(key.rewardToken, key.pool, key.startTime, key.endTime, key.vestingPeriod, key.refundee, reward);
  
  const v3Staker = getV3Staker(event.address)
  const user = getUser(event.transaction.from)

  //compute incentive id w/ event params
  const incentiveId = computeIncentiveId(event.params.rewardToken, event.params.pool, event.params.startTime, event.params.endTime, event.params.vestingPeriod, event.params.refundee)

  // get & create the incentive entity
  const incentive = getIncentive(incentiveId.toHexString())
  incentive.staker = v3Staker.id
  incentive.creator = user.id
  incentive.rewardToken = event.params.rewardToken
  incentive.pool = event.params.pool
  incentive.startTime = event.params.startTime
  incentive.endTime = event.params.endTime
  incentive.vestingPeriod = event.params.vestingPeriod
  incentive.refundee = event.params.refundee
  incentive.initialRewardAmount = event.params.reward
  //incentive.rewardAmountLeft = event.params.reward
  incentive.rewardAmountRefunded = BIG_INT_ZERO
  incentive.ended = false
  incentive.save() 
}

export function handleIncentiveEnded(event: IncentiveEnded): void {
  // event IncentiveEnded(bytes32 indexed incentiveId, uint256 refund);
  const incentive = getIncentive(event.params.incentiveId.toHexString())
  //incentive.rewardAmountLeft = BIG_INT_ZERO
  incentive.rewardAmountRefunded = event.params.refund
  incentive.ended = true
  incentive.save()
}

export function handleDepositTransferred(event: DepositTransferred): void {
  // event DepositTransferred(uint256 indexed tokenId, address indexed oldOwner, address indexed newOwner);
  const position = getPosition(event.params.tokenId)
  position.owner = event.params.newOwner.toHex()
  position.save()
}

export function handleTokenStaked(event: TokenStaked): void {
  // event TokenStaked(uint256 indexed tokenId, bytes32 indexed incentiveId, uint128 liquidity);
  
  const v3Staker = getV3Staker(event.address)
  const position = getPosition(event.params.tokenId)
  const user = getUser(Address.fromString(position.owner))
  const incentive = getIncentive(event.params.incentiveId.toHexString())
  const stake = getStake(event.params.tokenId, event.params.incentiveId.toHexString())

  // initialize stake entity
  stake.staker = v3Staker.id
  stake.position = position.id
  stake.incentive = incentive.id
  stake.user = user.id
  stake.stakedTimestamp = event.block.timestamp
  //stake.claimed = 0
  stake.activeStake = true
  stake.save()

  // set position
  position.owner = user.id
  position.pool = incentive.pool
  position.liquidity = event.params.liquidity
  position.save()
}

export function handleTokenUnstaked(event: TokenUnstaked): void {
  // event TokenUnstaked(uint256 indexed tokenId, bytes32 indexed incentiveId);

  const stake = getStake(event.params.tokenId, event.params.incentiveId.toHexString())

  // update stake
  stake.activeStake = false
  stake.save()
}

export function handleRewardClaimed(event: RewardClaimed): void {
  // event RewardClaimed(IERC20Minimal indexed rewardToken, address indexed to, uint256 reward);

}