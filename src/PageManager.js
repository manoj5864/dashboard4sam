import {mixin} from './util/mixin'
import {TLoggable} from './util/logging/TLoggable'
import {Page} from './ui/main/Page'

export class PageManager extends mixin(null, TLoggable) {

    /**
     * Retrieves current window hash index.html#<Hash>
     * @returns {string}
     */
    get currentHash() {
        return window.location.hash
    }

    /**
     * Set the windows hash
     * @param {string} value
     */
    set currentHash(value) {
        window.location.hash = value
    }

    get queryBuilder() {
        return this._queryBuilder;
    }

    set queryBuilder(queryBuilder) {
        this._queryBuilder = queryBuilder;
    }

    /**
     * Apply page element to container for content
     * @param page
     */
    switchPage(page) {
        this._pageElement.contentSpot.currentPage = page;
    }

    /**
     * Method is triggered when hash is passed to URL
     * @param hash
     * @private
     */
    _handleHashChange(hash) {
        this.info(`Dealing with hash change ${hash}`);
        let hashParts = hash.split('/');
        hashParts.shift(); //throw out '#'
        if (hashParts.length < 2) {
            this.error('Invalid hash format');
            return;
        }

        const mainRoute = hashParts.shift();
        switch (mainRoute) {
            case 'query':
                this.debug(`Interpreting query...`);
                this._loadQuery(hashParts[0]);
                break;
            default:
                this.error(`Invalid target ${mainRoute}`);
                break;
        }
    }

    /**
     * Loads a query from Base64 encoded hash
     * @param base64Query
     * @private
     */
    _loadQuery(base64Query) {
        const state = atob(base64Query);
        if (this._queryBuilder) {
            this._queryBuilder.importState(state);
        }
    }

    /**
     * Initialize the PageManager
     * @private
     */
    _init() {
        // Check current hash
        let hash = this.currentHash;

        this._queryBuilder = null;
        this._pageElement = ReactDOM.render(<Page />, $('#wrapper')[0]);

        $(document).ready(() => {
            $(window).bind('hashchange', () => {
                this._handleHashChange(this.currentHash)
            });
            this._handleHashChange(this.currentHash)
        })
    }

    constructor() {
        super();
        this._init();
    }

}