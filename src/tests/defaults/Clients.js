import {SocioCortexApi} from '../../service/api/SocioCortexApi'

let cortexClient = new SocioCortexApi(
    'sayan.mnit@gmail.com',
    '16rz3ulpit60k',
    'http://vmmatthes21.informatik.tu-muenchen.de/api/v1'
)

let workspace = cortexClient.getWorkspace('16eh5j1cwrrny')

export {cortexClient, workspace}