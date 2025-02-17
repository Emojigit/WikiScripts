/*
 * Advanced Rollback script for rollbackers (Chinese)
 * 
 * This script asks the user to supply an optional rollback summary.
 * After the rollback is complete, the user is taken to the diff page.
 * The diff page will open in a new window if the user is on Special:RecentChanges.
 * 
 * Add the following line to your common.js or global.js to load this script:
 * mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/zh.js&action=raw&ctype=text/javascript" );
 * 
 * This script is made by 1F616EMO on zhwiki, licensed under CC BY-SA 4.0.
 * 
 * 225-02-16 forked from https://zh.wikipedia.org/wiki/MediaWiki:Gadget-rollback-summary.js
 * 
 */
// <nowiki>

{
    const core = (batchConv) => {
        delete core;
        mw.messages.set(batchConv({
            'rollback-summary-custom': {
                hans: '回退[[Special:Contributions/$1|$1]]（[[User talk:$1|对话]]）的编辑：',
                hant: '回退[[Special:Contributions/$1|$1]]（[[User talk:$1|對話]]）的編輯：'
            },
            'rollback-summary-nouser': { hans: '回退隐藏用户的编辑：', hant: '回退隱藏使用者的編輯：' },
            'rollback-summary-prompt': {
                hans: '请输入自定义回退摘要（留空则使用系统默认摘要）',
                hant: '請輸入自定義回退摘要（留空則使用系統預設摘要）'
            },
    
            'rollback-processing': '正在回退',
            'rollback-done': '已回退',
            'rollback-failed': {
                hans: '回退失败：$1',
                hant: '回退失敗：$1'
            },
    
            'rolback-failed-href-error': {
                hans: '参数出错',
                hant: '參數出錯'
            }
        }));
    
        mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/core.js&action=raw&ctype=text/javascript" );
    }

    // We can only make sure HanAssist exist on zhwiki
    if (mw.config.get('wgServerName') === 'zh.wikipedia.org') {
        mw.loader.using('ext.gadget.HanAssist').then((require) => {
            core(batchConv = require('ext.gadget.HanAssist').batchConv);
        });
    } else {
        mw.loader.getScript('https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-HanAssist.js&action=raw&ctype=text/javascript')
            .then(
                () => {
                    core(mw.libs.HanAssist.batchConv);
                },
                (e) => {
                    mw.notofy('Failed to load HanAssist for AdvancedRollback, falling back to English.');
                    delete core;
                    mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/en.js&action=raw&ctype=text/javascript" );
                });
    }
}

// </nowiki> Nya~!