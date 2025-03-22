/**
 * Script for highlighting a user's edit on RecentChanges, Watchlist, etc.
 */

$.when(mw.loader.using([
    'mediawiki.api',
]), $.ready).then(() => {
    let WatchUserList;

    // Retrieve from mediawiki.storage
    {
        const storage = mw.storage.getObject('WatchUserList');
        if (storage === null || storage === false) {
            WatchUserList = {};
        } else {
            WatchUserList = storage;
        }
    }
});