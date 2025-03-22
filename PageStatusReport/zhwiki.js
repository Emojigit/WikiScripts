/**
 * PageStatusReport: Show page status on page links
 * Chinese Wikipedia (zhwiki) adoption
 * 
 * Implements: CSD, XFD, Copyvio, Notability
 */

{
    const core = (conv) => {
        delete core;

        window.PageStatusReportItems = {
            '快速删除候选': {
                'class': 'csd',
            },
            '所有刪除候選': {
                'class': 'afd',
            },
            '怀疑侵犯版权页面': {
                'class': 'copyvio',
                'except': [
                    'Wikipedia:頁面存廢討論/疑似侵權', // CV noticeboard
                    'Category:內容疑似拷貝後貼上的頁面', // Suspected copyvio
                    'Category:内容疑似拷贝后贴上但无来源的页面', // Suspected copyvio without source
                ],
            },
            '所有主題不滿足收錄標準的條目': {
                'class': 'notability',
            },
        };

        mw.util.addCSS(`
            .page-status-report-csd::after {
                color: red;
                content: '速';
            }

            .page-status-report-afd::after {
                color: red;
                content: '刪';
            }

            .page-status-report-copyvio::after {
                color: #ff5521;
                content: '侵';
            }

            .page-status-report-notability::after {
                color: #ff5521;
                content: '${conv({
                    hant: '關',
                    hans: '关',
                })}';
            }
        `);

        mw.loader.load("https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/PageStatusReport/core.js&action=raw&ctype=text/javascript");
    };

    mw.loader.using('ext.gadget.HanAssist').then((require) => {
        core(require('ext.gadget.HanAssist').conv);
    });
}