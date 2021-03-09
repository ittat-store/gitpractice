import SIMSlotManager from 'simslot-manager';
import SimCardHelper from '../util/sim_card_helper';

// This is the map that determines which sim-slot
// should be used to make the emergency calls.
export const slotMap = [
  // Cases when slot-0 is absent.
  { slot0: 'absent', slot1: 'absent', outgoingCall: 0 },
  { slot0: 'absent', slot1: 'not_ready', outgoingCall: 0 },
  { slot0: 'absent', slot1: 'ready', outgoingCall: 1 },

  // Cases when slot-0 isn't ready yet.
  { slot0: 'not_ready', slot1: 'absent', outgoingCall: 0 },
  { slot0: 'not_ready', slot1: 'not_ready', outgoingCall: 0 },
  { slot0: 'not_ready', slot1: 'ready', outgoingCall: 1 },

  // Cases when slot-0 is ready.
  { slot0: 'ready', slot1: 'absent', outgoingCall: 0 },
  { slot0: 'ready', slot1: 'not_ready', outgoingCall: 0 },

  // Cases when both slots are ready,
  // we will need to refer to the user preference (defaultServiceId).
  { slot0: 'ready', slot1: 'ready', defaultServiceId: -1, outgoingCall: 0 },
  { slot0: 'ready', slot1: 'ready', defaultServiceId: 0, outgoingCall: 0 },
  { slot0: 'ready', slot1: 'ready', defaultServiceId: 1, outgoingCall: 1 },
];

export function selectByCurrentStatus() {
  const slotStates = getSlotStates();
  const defaultServiceId = SimCardHelper.cardIndex;
  return slotMap.find((rule) => {
    if (slotStates[0] === rule.slot0 &&
      slotStates[1] === rule.slot1) {
      if (Number.isInteger(rule.defaultServiceId)) {
        return defaultServiceId === rule.defaultServiceId;
      }
      return true;
    }
    return false;
  });
}

export function getSlotStates() {
  return SIMSlotManager.getSlots()
    .map((slot) => {
      if (slot.isAbsent()) {
        return 'absent';
      } else {
        return 'ready' === slot.getCardState() ? 'ready' : 'not_ready';
      }
    });
}
