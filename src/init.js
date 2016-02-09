import {app} from './Application'
import {QueryBuilder} from './ui/query_builder/QueryBuilder'

// Startup application
app.start();

// Initialize QueryBuilder surface
let qbRef = null;
let qbElement = <QueryBuilder ref={component => {qbRef = component}} />;

// Switch to QueryBuilder initially
app.pageManager.switchPage(qbElement);
// Pass QueryBuilder as reference
app.pageManager.queryBuilder = qbRef;