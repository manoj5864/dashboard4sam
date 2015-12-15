import {app} from './Application'
import {QueryBuilder} from './ui/query_builder/QueryBuilder'
app.start()

app.pageManager.switchPage(<QueryBuilder />)