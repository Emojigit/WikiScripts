/*
 * Advanced Rollback script for rollbackers (English)
 * 
 * This script asks the user to supply an optional rollback summary.
 * After the rollback is complete, the user is taken to the diff page.
 * The diff page will open in a new window if the user is on Special:RecentChanges.
 * 
 * Add the following line to your common.js or global.js to load this script:
 * mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/en.js&action=raw&ctype=text/javascript" );
 * 
 * This script is made by 1F616EMO on zhwiki, licensed under CC BY-SA 4.0.
 * 
 * 225-02-16 forked from https://zh.wikipedia.org/wiki/MediaWiki:Gadget-rollback-summary.js
 * 
 */
// <nowiki>

mw.messages.set({
    'rollback-window-title': 'Reverting edits on [[$1]]',
    'rollback-fieldset-label': 'Reverting edits by [[Special:Contributions/$1|$1]]',
    'rollback-intention-unspecified': 'Unspecified',
    'rollback-intention-good': 'AGF',
    'rollback-intention-vandalism': 'Vandalism',

    'rollback-summary-user-string': '[[Special:Contributions/$1|$1]] ([[User talk:$1|talk]])',
    'rollback-summary-revdel-user-string': 'a user whose name is hidden',

    'rollback-summary-intention': 'Intention',
    'rollback-summary-unspecified': 'Reverted edit(s) by $1',
    'rollback-summary-good': 'Reverted [[WP:AGF|good faith]] edit(s) by $1',
    'rollback-summary-vandalism': 'Reverted [[WP:VAND|vandalism]] edit(s) by $1',

    'rollback-summary-presets': 'Presets',
    'rollback-summary-prompt': 'Please enter a custom rollback summary',
    'rollback-summary-custom': 'Custom summary',

    'rollback-processing': 'Rollbacking',
    'rollback-done': 'Done',
    'rollback-failed': 'Rolback failed: $1',

    'rolback-failed-href-error': 'Parameter error',
            
    'advanced-rollback-tag': '// [[w:zh:U:1F616EMO/AdvancedRollback|AdvancedRollback]]',
});

mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/core.js&action=raw&ctype=text/javascript" );

// </nowiki> Nya~!