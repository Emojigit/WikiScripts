/*
 * Advanced Rollback script for rollbackers (Cantonese)
 * 
 * This script asks the user to supply an optional rollback summary.
 * After the rollback is complete, the user is taken to the diff page.
 * The diff page will open in a new window if the user is on Special:RecentChanges.
 * 
 * Add the following line to your common.js or global.js to load this script:
 * mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/zh-yue.js&action=raw&ctype=text/javascript" );
 * 
 * This script is made by 1F616EMO on zhwiki, licensed under CC BY-SA 4.0.
 * 
 * 225-02-16 forked from https://zh.wikipedia.org/wiki/MediaWiki:Gadget-rollback-summary.js
 * 
 */
// <nowiki>

mw.messages.set({
    'rollback-window-title': '回退響[[$1]]作出嘅編輯',
    'rollback-fieldset-label': '回退[[Special:Contributions/$1|$1]]嘅編輯',
    'rollback-intention-unspecified': '唔知',
    'rollback-intention-good': '好心',
    'rollback-intention-vandalism': '破壞',

    'rollback-summary-user-string': '[[Special:Contributions/$1|$1]]（[[User talk:$1|傾偈]]）',
    'rollback-summary-revdel-user-string': '隱藏用户',

    'rollback-summary-intention': '動機',
    'rollback-summary-unspecified': '回退$1嘅編輯',
    'rollback-summary-good': '回退$1出於[[WP:AGF|好心]]而做嘅編輯',
    'rollback-summary-vandalism': '回退$1嘅[[WP:VAND|好心]]嘅破壞性編輯',

    'rollback-summary-presets': '預設摘要',
    'rollback-summary-prompt': '請輸入自訂摘要',
    'rollback-summary-custom': '自訂摘要',

    'rollback-processing': '回退緊',
    'rollback-done': '回退咗',
    'rollback-failed': '回退失敗：$1',

    'rolback-failed-href-error': '參數錯咗',
            
    'advanced-rollback-tag': '// [[w:zh:U:1F616EMO/AdvancedRollback|AdvancedRollback]]',
});

mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/core.js&action=raw&ctype=text/javascript" );

// </nowiki> Nya~!