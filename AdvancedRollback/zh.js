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
            'rollback-window-title': {
                hans: '回退[[$1]]上的编辑',
                hant: '回退[[$1]]上的編輯',
            },
            'rollback-fieldset-label': {
                hans: '回退[[Special:Contributions/$1|$1]]的编辑',
                hant: '回退[[Special:Contributions/$1|$1]]的編輯',
            },
            'rollback-intention-unspecified': '未指定',
            'rollback-intention-good': {
                hans: '善意',
                hant: '善意',
            },
            'rollback-intention-vandalism': {
                hans: '破坏',
                hant: '破壞',
            },


            'rollback-summary-user-string': {
                hans: '[[Special:Contributions/$1|$1]]（[[User talk:$1|对话]]）',
                hant: '[[Special:Contributions/$1|$1]]（[[User talk:$1|對話]]）'
            },
            'rollback-summary-revdel-user-string': {
                hans: '隐藏用户',
                hant: '隱藏使用者'
            },

            'rollback-summary-intention': {
                hans: '编辑动机',
                hant: '編輯動機'
            },
            'rollback-summary-unspecified': {
                hans: '回退$1的编辑',
                hant: '回退$1的編輯'
            },
            'rollback-summary-good': {
                hans: '回退$1做出的出於[[WP:AGF|善意]]的编辑',
                hant: '回退$1做出的出於[[WP:AGF|善意]]的編輯'
            },
            'rollback-summary-vandalism': {
                hans: '回退$1做出的[[WP:VAND|破坏性]]编辑',
                hant: '回退$1做出的[[WP:VAND|破壞性]]編輯'
            },

            'rollback-summary-presets': {
                hans: '预设摘要',
                hant: '預設摘要'
            },
            'rollback-summary-prompt': {
                hans: '请输入自定义回退摘要',
                hant: '請輸入自定義回退摘要'
            },
            'rollback-summary-custom': {
                hans: '自定义摘要',
                hant: '自定義摘要'
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
            },

            'advanced-rollback-tag': '// [[U:1F616EMO/AdvancedRollback|AdvancedRollback]]',
        }));

        mw.loader.load("https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/core.js&action=raw&ctype=text/javascript");
    }

    // We can only make sure HanAssist exist on zhwiki
    if (mw.config.get('wgServerName') === 'zh.wikipedia.org') {
        mw.loader.using('ext.gadget.HanAssist').then((require) => {
            core(require('ext.gadget.HanAssist').batchConv);
        });
    } else {
        mw.hook('userscript.SunAfterRain.HanAssist.ready').add((HanAssist) => core(HanAssist.batchConv));
        mw.loader.getScript('https://meta.wikimedia.org/w/index.php?title=User:SunAfterRain/js/HanAssist.js&action=raw&ctype=text/javascript')
            .then(
                () => void 0,
                (e) => {
                    mw.notofy('Failed to load HanAssist for AdvancedRollback, falling back to English.');
                    delete core;
                    mw.loader.load("https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback/en.js&action=raw&ctype=text/javascript");
                });
    }
}

// </nowiki> Nya~!