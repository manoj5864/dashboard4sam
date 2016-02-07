import {app} from './Application'
import {QueryBuilder} from './ui/query_builder/QueryBuilder'
app.start();

var qbRef = null;
let qbElement = <QueryBuilder ref={component => {qbRef = component}} />;
app.pageManager.switchPage(qbElement);
app.pageManager.queryBuilder = qbRef;