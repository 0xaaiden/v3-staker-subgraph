import { Address } from '@graphprotocol/graph-ts'
import { V3Staker } from '../../generated/schema'

export function getV3Staker(contract: Address): V3Staker {
  let v3Staker = V3Staker.load(contract.toHex())

  if (v3Staker == null) {
    // call contract to get data
    
    v3Staker = new V3Staker(contract.toHex())
    v3Staker.save()
  }

  return v3Staker as V3Staker
}