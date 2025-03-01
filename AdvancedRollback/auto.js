/*
 * Advanced Rollback script for rollbackers (Automatic language selection)
 * 
 * This script asks the user to supply an optional rollback summary.
 * After the rollback is complete, the user is taken to the diff page.
 * The diff page will open in a new window if the user is on Special:RecentChanges.
 * 
 * Add the following line to your common.js or global.js to load this script:
 * mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/auto.js&action=raw&ctype=text/javascript" );
 * 
 * This script is made by 1F616EMO on zhwiki, licensed under CC BY-SA 4.0.
 * 
 */
// <nowiki>

(() => {
    const wgContentLanguage = mw.config.get('wgContentLanguage');
    let scriptLanguage = 'en';

    if (wgContentLanguage === 'yue') {
        scriptLanguage = 'yue';
    } else if (
        wgContentLanguage === 'zh' ||
        wgContentLanguage === 'lzh' ||
        wgContentLanguage.startsWith('zh-')) {
        scriptLanguage = 'zh';
    }

    mw.loader.load(`https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/${scriptLanguage}.js&action=raw&ctype=text/javascript`);
})();

// </nowiki> Nya~