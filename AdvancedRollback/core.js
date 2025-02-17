/*
 * Advanced Rollback script for rollbackers
 * 
 * This script asks the user to supply an optional rollback summary.
 * After the rollback is complete, the user is taken to the diff page.
 * The diff page will open in a new window if the user is on Special:RecentChanges.
 * 
 * Do not load this script directly. Load a localization script instead.
 * e.g. [[:zh:User:1F616EMO/AdvancedRollback/zh.js]].
 * 
 * Use the following line to load this script:
 * mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/core.js&action=raw&ctype=text/javascript" );
 * 
 * This script is made by 1F616EMO on zhwiki, licensed under CC BY-SA 4.0.
 * 
 * 225-02-16 forked from https://zh.wikipedia.org/wiki/MediaWiki:Gadget-rollback-summary.js
 * 
 */
// <nowiki>

$(() => {
    const api = new mw.Api();

    const onRollbackClick = function (e) {
        e.preventDefault();
        const $this = $(this);

        if ($this.hasClass('advancedrollback-processed'))
            return;
        $this.addClass('advancedrollback-processed');

        const href = this.href;

        const title = mw.util.getParamValue('title', href);
        const from = mw.util.getParamValue('from', href);
        const token = mw.util.getParamValue('token', href);

        if (!(title && token)) {
            $this.text(mw.message('rollback-failed', mw.message('rolback-failed-href-error')));
            return;
        }

        const rollbackRequestTable = {
            action: 'rollback',
            title: title,
            token: token
        }

        const summary = prompt(mw.message('rollback-summary-prompt'));

        if (summary === null)
            return;

        if (from)
            rollbackRequestTable.user = from;

        if (summary !== '') {
            rollbackRequestTable.summary = from
                ? (mw.message('rollback-summary-custom', from).plain() + summary)
                : (mw.message('rollback-summary-nouser').plain() + summary);
        } else {
            rollbackRequestTable.summary = summary;
        }

        $this.text(mw.message('rollback-processing'));

        api.post(rollbackRequestTable)
            .then((data) => {
                $this.text(mw.message('rollback-done'));

                // Valid diff display modes:
                // 1. 'default' ('newtab' in Recentchanges and Watchlist, 'this' in other pages)
                // 2. 'newtab' (always open in new tab)
                // 3. 'this' (always open in current tab)
                // 4. 'inpageedit' (Use InPageEdit's quick diff, fallback to 'default' if not available)
                // 5. 'none' (do not open diff page)

                const DiffMode = window.AdvancedRollBackDiffMode || 'default';

                if (DiffMode === 'inpagedit' && !(InPageEdit && InPageEdit.quickDiff)) {
                    console.warning('InPageEdit is not available, fallback to default diff display mode.');
                    DiffMode = 'default';
                }

                const diff = data.rollback.revid; // after rollback
                const oldid = data.rollback.old_revid; // before rollback

                if (DiffMode === 'inpageedit') {
                    InPageEdit.quickDiff({
                        fromrev: oldid,
                        torev: diff,
                    });
                    return;
                } else if (DiffMode === 'default') {
                    if (mw.config.get('wgCanonicalSpecialPageName') === 'Recentchanges'
                        || mw.config.get('wgCanonicalSpecialPageName') === 'Watchlist') {
                        DiffMode = 'newtab';
                    } else {
                        DiffMode = 'this';
                    }
                }

                if (DiffMode === 'newtab') {
                    window.open(diff_page.getUrl());
                } else if (DiffMode === 'this') {
                    window.location.href = diff_page.getUrl();
                }
            })
            .catch((data) => {
                $this.text(mw.message('rollback-failed', data));
            });
    };

    mw.hook('wikipage.content').add(function () {
        $('.mw-rollback-link a').off('click');
        $('.mw-rollback-link a')
            .on('click', onRollbackClick)
            .css('color', '#099');
    });
});

// </nowiki> Nya~!
