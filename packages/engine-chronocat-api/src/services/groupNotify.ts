import { getSingleScreenNotifies } from '../definitions/groupService'

let t = new Date().getTime()

const refresh = async () => {
  const nt = new Date().getTime()

  if (nt - t < 10000) return
  t = nt

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
