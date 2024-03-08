import { chronocat } from '@chronocat/shell'
import { apply as ccApi } from '@chronocat/engine-chronocat-api'
import { version as ccApiVersion } from '@chronocat/engine-chronocat-api/package.json'
import { version as ccEventVersion } from '@chronocat/engine-chronocat-event/package.json'
import { apply as ccEvent } from '@chronocat/engine-chronocat-event'

void chronocat().then(x => {
  x?.load({
    name: 'engine-chronocat-api',
    version: ccApiVersion,
    apply: ccApi
  })

  x?.load({
    name: 'engine-chronocat-event',
    version: ccEventVersion,
    apply: ccEvent
  })
})
