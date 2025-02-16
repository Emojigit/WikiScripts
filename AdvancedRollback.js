/*
 * Advanced Rollback script for rollbackers
 * 
 * This script asks the user to supply an optional rollback summary.
 * After the rollback is complete, the user is taken to the diff page.
 * The diff page will open in a new window if the user is on Special:RecentChanges.
 * 
 * Add the following line to your common.js to enable this script:
 * mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AdvancedRollback.js&action=raw&ctype=text/javascript" );
 * 
 * This script is made by 1F616EMO on zhwiki, licensed under CC BY-SA 4.0.
 * 
 */
// <nowiki>

mw.loader.using('ext.gadget.HanAssist').then((require) => {
    const batchConv = require('ext.gadget.HanAssist').batchConv;
    const api = new mw.Api();

    mw.messages.set(batchConv({
        'rollback-summary-custom': {
            hans: '回退[[Special:Contributions/$1|$1]]（[[User talk:$1|对话]]）的编辑：',
            hant: '回退[[Special:Contributions/$1|$1]]（[[User talk:$1|對話]]）的編輯：'
        },
        'rollback-summary-nouser': { hans: '回退已隐藏用户的编辑：', hant: '回退已隱藏使用者的編輯：' },
        'rollback-summary-prompt': {
            hans: '请输入自定义回退摘要（留空则使用系统默认摘要）',
            hant: '請輸入自定義回退摘要（留空則使用系統預設摘要）'
        },
        'rollback-failed-short': {
            hans: '回退失败',
            hant: '回退失敗'
        }
    }));

    const updateLinks = () => {
        $('.mw-rollback-link a').off('click');
        $('.mw-rollback-link a')
            .on('click', function (e) {
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
                    $this.text(mw.message('rollback-failed-short'));
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

                $this.text('正在回退');

                api.post(rollbackRequestTable)
                    .then((data) => {
                        $this.text('已回退');

                        const diff = data.rollback.revid;
                        const oldid = data.rollback.old_revid;
                        // Go to diff page, but on new tab if on Special:RecentChanges
                        const diff_page = new mw.Title('Special:Diff/' + oldid + '/' + diff);
                        if (mw.config.get('wgCanonicalSpecialPageName') === 'Recentchanges')
                            window.open(diff_page.getUrl());
                        else
                            window.location.href = diff_page.getUrl();
                    })
                    .catch((data) => {
                        $this.text(mw.message('rollback-failed-short') + '：' + data);
                    });
            })
            .css('color', '#099');
    };

    mw.hook('wikipage.content').add(function () {
        updateLinks();
    });
});

// </nowiki> Nya~!