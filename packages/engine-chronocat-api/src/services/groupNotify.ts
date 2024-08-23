import { getSingleScreenNotifies } from '../definitions/groupService'

const refresh = async () => {
  void getSingleScreenNotifies({
    doubt: false,
    startSeq: '',
    number: 16,
  })
  void getSingleScreenNotifies({
    doubt: true,
    startSeq: '',
    number: 16,
  })
}

export const groupNotify = {
  refresh,
}
