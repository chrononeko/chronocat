import { throttle } from 'lodash-es'
import { getSingleScreenNotifies } from '../definitions/groupService'

const refreshIntl2 = async () => {
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

// const refreshIntl1 = debounce(refreshIntl2, 2000, {
//   maxWait: 2000,
// })

const refreshIntl1 = throttle(refreshIntl2, 4000, {
  leading: true,
  trailing: false,
})

const refresh = () => setTimeout(refreshIntl1, 2000)

export const groupNotify = {
  refresh,
}
