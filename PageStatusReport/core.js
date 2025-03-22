/**
 * PageStatusReport: Show page status on page links
 * 
 * e.g. Notability, AFD, etc.
 */

$.when(mw.loader.using([
    'mediawiki.api',
    'mediawiki.jqueryMsg',
]), $.ready).then(() => {
    const api = new mw.Api();
    const wgArticlePath = mw.config.get('wgArticlePath').replace('$1', '');

    const process = function ($content) {
        const $links = $content.find('a:not(.page-status-report-processed)');

        const titles = {};
        $links.each(function () {
            const href = $(this).attr('href');
            if (href && href.startsWith(wgArticlePath)) {
                const title = decodeURIComponent(href.slice(wgArticlePath.length)).replace(/_/g, ' ');
                if (!title.startsWith('Special:')) {
                    titles[title] = titles[title] || [];
                    titles[title].push(this);
                }
            }
        });

        for (const title in titles) {
            $(titles[title]).addClass('page-status-report-processed');
        }

        const titleChunks = Object.keys(titles).reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 50);
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [];
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        }, []);

        const fetchPageStatus = (chunk) => {
            api.post({
                'action': 'query',
                'prop': 'categories',
                'titles': chunk.join('|'),
                'clcategories': Object.keys(window.PageStatusReportItems).map((item) => `Category:${item}`),
                'cllimit': 'max',
            }).then((data) => {
                for (const pageId in data.query.pages) {
                    const page = data.query.pages[pageId];
                    if (page.categories) {
                        for (const category of page.categories) {
                            const cat_name = category.title.slice('Category:'.length);
                            if (cat_name in window.PageStatusReportItems) {
                                const item = window.PageStatusReportItems[cat_name];
                                if (item.except && item.except.includes(page.title)) {
                                    continue;
                                }
                                $('<span>')
                                    .addClass('page-status-report')
                                    .addClass('page-status-report-' + item.class)
                                    .appendTo($(titles[page.title]));
                            }
                        }
                    }
                }
            });
        };

        titleChunks.forEach(fetchPageStatus);
    };

    mw.util.addCSS(`
        .page-status-report::after {
            vertical-align: super;
            font-size: smaller;
        }
    `);

    mw.hook('wikipage.content').add(process);
    process($("#mw-content-text")); // HACK: Sometimes the above fail on Special:Diff
});