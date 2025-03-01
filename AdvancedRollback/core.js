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

"use strict";

$.when(mw.loader.using([
    'mediawiki.api',
    'mediawiki.jqueryMsg',
    'oojs-ui-core',
    'oojs-ui-windows',
]), $.ready)
    .then(() => new mw.Api().loadMessagesIfMissing([
        'rollbacklinkcount',
        'rollbacklinkcount-morethan',
        'rollback',
        'colon-separator',
        'cancel',
    ]))
    .then(() => {
        const api = new mw.Api();
        const windowManager = new OO.ui.WindowManager();
        $(document.body).append(windowManager.$element);

        const rvlimit = Math.min((window.AdvancedRollBackRevisionLimit || 10) + 1, 50);
        const rollbackTag = mw.message('advanced-rollback-tag').plain();

        const rollbackDialog = window.AdvancedRollbackDialog = function (config) {
            rollbackDialog.super.call(this, config);
        }
        OO.inheritClass(rollbackDialog, OO.ui.ProcessDialog);

        rollbackDialog.static.name = 'rollbackDialog';
        rollbackDialog.static.title = mw.message('rollback').plain();
        rollbackDialog.static.actions = [
            {
                action: 'rollback',
                label: mw.message('rollback').plain(),
                flags: ['primary', 'progressive'],
            },
            {
                flags: 'safe',
                label: mw.message('cancel').plain(),
                flags: ['safe', 'close']
            }
        ];
        rollbackDialog.prototype.initialize = function () {
            rollbackDialog.super.prototype.initialize.apply(this, arguments);

            this.panel = new OO.ui.PanelLayout({
                padded: true,
                expanded: false
            });

            const fieldset = this.content = new OO.ui.FieldsetLayout({
                // label: () => mw.message('rollback-fieldset-label', this.data ? this.data.from : 'Example').parseDom(),
            });

            const menuItems = [];
            menuItems.push({
                data: 'custom',
                label: mw.message('rollback-summary-custom').plain(),
            });

            window.AdvancedRollbackSummaryPresets = window.AdvancedRollbackSummaryPresets || {};
            const OptionGroups = {};
            for (const key in window.AdvancedRollbackSummaryPresets) {
                if (typeof window.AdvancedRollbackSummaryPresets[key] === 'string') {
                    window.AdvancedRollbackSummaryPresets[key] = {
                        description: window.AdvancedRollbackSummaryPresets[key],
                        text: window.AdvancedRollbackSummaryPresets[key],
                    }
                }
                if (window.AdvancedRollbackSummaryPresets[key].optgroup) {
                    if (typeof window.AdvancedRollbackSummaryPresets[key].items !== 'object') {
                        console.warn('Invalid AdvancedRollbackSummaryPresets Option Group: ',
                            key, window.AdvancedRollbackSummaryPresets[key].optgroup);
                        continue;
                    }
                    if (typeof window.AdvancedRollbackSummaryPresets[key].optgroup !== 'string') {
                        window.AdvancedRollbackSummaryPresets[key].optgroup = key;
                    }

                    OptionGroups[key] = window.AdvancedRollbackSummaryPresets[key];
                    delete window.AdvancedRollbackSummaryPresets[key];
                } else {
                    menuItems.push({
                        data: key,
                        label: window.AdvancedRollbackSummaryPresets[key].description,
                    });
                }
            }

            // Due to how OOUI works, create option groups later here
            for (const key in OptionGroups) {
                menuItems.push({
                    optgroup: OptionGroups[key].optgroup,
                });

                const items = OptionGroups[key].items;
                for (const itemKey in items) {
                    if (typeof items[itemKey] === 'string') {
                        items[itemKey] = {
                            description: items[itemKey],
                            text: items[itemKey],
                        };
                    }
                    window.AdvancedRollbackSummaryPresets[key + "-" + itemKey] = items[itemKey];
                    menuItems.push({
                        data: key + "-" + itemKey,
                        label: items[itemKey].description,
                    });
                }
            }

            // (1) Select intention (default: unspecified)
            //    Note: Not AGF cuz rollback is usually for combatting vandalism
            //          embarrasing if AGF'ed
            // (2) Choose from summary presets (first element: custom -> blankern input)
            // (3) Input custom summary

            this.summaryDropdown = new OO.ui.DropdownInputWidget({
                required: true,
                value: 'custom',
                options: menuItems,
            });

            // this.summaryDropdown.dropdownWidget.menu.getClosestScrollableElementContainer = () => $(document.body);

            this.summaryInput = new OO.ui.MultilineTextInputWidget({
                placeholder: mw.message('rollback-summary-prompt').plain(),
                rows: 5,
                allowLinebreaks: false,
            });

            this.intentionSelection = new OO.ui.ButtonSelectWidget({
                items: [
                    new OO.ui.ButtonOptionWidget({
                        data: 'unspecified',
                        label: mw.message('rollback-intention-unspecified').plain(),
                    }).setSelected(true),
                    new OO.ui.ButtonOptionWidget({
                        icon: 'success',
                        data: 'good',
                        label: mw.message('rollback-intention-good').plain(),
                    }),
                    new OO.ui.ButtonOptionWidget({
                        icon: 'clear',
                        data: 'vandalism',
                        label: mw.message('rollback-intention-vandalism').plain(),
                    }),
                ],
            });

            fieldset.addItems([
                new OO.ui.FieldLayout(this.intentionSelection, {
                    align: 'top'
                }),

                new OO.ui.FieldLayout(this.summaryDropdown, {
                    label: mw.message('rollback-summary-presets').plain(),
                    align: 'top',
                }),

                new OO.ui.FieldLayout(this.summaryInput, {
                    label: mw.message('rollback-summary-custom').plain(),
                    align: 'top',
                }),
            ]);

            this.panel.$element.append(fieldset.$element);
            this.$body.append(this.panel.$element);

            this.summaryDropdown.on('change', this.onSummaryDropdownChange.bind(this));
        };

        rollbackDialog.prototype.getSetupProcess = function (data) {
            data = data || {};
            this.setData(data);
            return rollbackDialog.super.prototype.getSetupProcess.call(this, data)
                .next(() => {
                    this.intentionSelection.selectItemByData('unspecified');
                    this.summaryDropdown.setValue('custom');
                    this.summaryInput.setValue('');
                });
        };

        rollbackDialog.prototype.onSummaryDropdownChange = function (value) {
            if (value === 'custom') {
                this.summaryInput.setValue('');
            } else {
                this.summaryInput.setValue(window.AdvancedRollbackSummaryPresets[value].text || '');
            }
        };

        rollbackDialog.prototype.getActionProcess = function (action) {
            if (action === 'rollback') {
                const data = this.data;
                const rollbackRequestTable = {
                    action: 'rollback',
                    title: data.pagetitle,
                    token: data.token,
                };

                const $this = data.elem;
                const from = data.from;

                $this.addClass('advancedrollback-clicked');

                if (from)
                    rollbackRequestTable.user = from;

                const summary = this.summaryInput.getValue();
                const intentionItem = this.intentionSelection.findSelectedItem();
                const intention = intentionItem ? intentionItem.data : 'unspecified';
                const fromString = from
                    ? mw.message('rollback-summary-user-string', from).plain()
                    : mw.message('rollback-summary-revdel-user-string').plain();

                rollbackRequestTable.summary = mw.message('rollback-summary-' + intention, fromString).plain();

                if (summary !== '') {
                    rollbackRequestTable.summary += mw.message('colon-separator').plain() + summary;
                }

                rollbackRequestTable.summary += " " + rollbackTag;

                $this.text(mw.message('rollback-processing'));

                return rollbackDialog.super.prototype.getActionProcess.call(this, action)
                    .next(function () {
                        return api.post(rollbackRequestTable)
                            .then((rtnData) => {
                                this.rtnData = rtnData;
                            })
                            .catch((err) => {
                                this.err = err;
                                // this.close();
                            })
                    }, this)
                    .next(function () {
                        if (this.err) {
                            console.warn("Rolback failed: ", this.err);
                            $this.text(mw.message('rollback-failed', this.err));
                            this.close();
                            return rollbackDialog.super.prototype.getActionProcess.call(this, action);
                            // return new OO.ui.Error(mw.message('rollback-failed', this.err).plain(), { recoverable: false });
                        }

                        const rtnData = this.rtnData;
                        $this.text(mw.message('rollback-done'));

                        // Valid diff display modes:
                        // 1. 'default' ('newtab' in Recentchanges and Watchlist, 'this' in other pages)
                        // 2. 'newtab' (always open in new tab)
                        // 3. 'this' (always open in current tab)
                        // 4. 'inpageedit' (Use InPageEdit's quick diff, fallback to 'default' if not available)
                        // 5. 'none' (do not open diff page)

                        let DiffMode = window.AdvancedRollBackDiffMode || 'default';

                        if (DiffMode === 'inpagedit' && !(InPageEdit && InPageEdit.quickDiff)) {
                            console.warning('InPageEdit is not available, fallback to default diff display mode.');
                            DiffMode = 'default';
                        }

                        const diff = rtnData.rollback.revid; // after rollback
                        const oldid = rtnData.rollback.old_revid; // before rollback

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

                        const diff_page = new mw.util.getUrl('Special:Diff/' + oldid + '/' + diff);
                        if (DiffMode === 'newtab') {
                            window.open(diff_page);
                        } else if (DiffMode === 'this') {
                            window.location.href = diff_page;
                        }
                    }, this)
                    .next(() => this.close());

            } else {
                return rollbackDialog.super.prototype.getActionProcess.call(this, action);
            }
        };

        let doRollbackDialog;

        const onRollbackClick = function (e) {
            e.preventDefault();
            const $this = $(this);
            if ($this.hasClass('advancedrollback-clicked'))
                return;

            const href = this.href;

            const title = mw.util.getParamValue('title', href);
            const from = mw.util.getParamValue('from', href);
            const token = mw.util.getParamValue('token', href);

            if (!(title && token)) {
                $this.text(mw.message('rollback-failed', mw.message('rolback-failed-href-error')));
                return;
            }

            if (!doRollbackDialog) {
                window.AdvancedRollbackDialogInstance = doRollbackDialog = new rollbackDialog();
                windowManager.addWindows([doRollbackDialog]);
            }

            windowManager.openWindow(doRollbackDialog, {
                title: mw.message('rollback-window-title', title).parseDom(),
                pagetitle: title,
                from: from,
                token: token,
                elem: $this,
            });
        };

        mw.util.addCSS( '.advancedrollback-processed { color: #099 !important; }' );

        const process = function ($content) {
            const $found = $content.find('.mw-rollback-link:not(.advancedrollback-processed) a')
            $found
                .off('click')
                .on('click', onRollbackClick)
                .addClass('advancedrollback-processed');
            

            if (!window.AdvancedRollbackNoCountRevision && (!(
                mw.config.get('wgAction') === 'histiory' ||
                mw.config.get('wgCanonicalSpecialPageName') === 'Contributions'
            ) || rvlimit > 11)) {
                $found.each(function () {
                    const $this = $(this);
                    const href = this.href;
                    const title = mw.util.getParamValue('title', href);
                    const from = mw.util.getParamValue('from', href);
                    if (!(title && from))
                        return;

                    api.get({
                        action: 'query',
                        prop: 'revisions',
                        titles: title,
                        rvprop: 'user',
                        rvlimit: rvlimit,
                    }).then((data) => {
                        const page = Object.values(data.query.pages)[0];
                        if (!page)
                            return;

                        let edit_count = 0;
                        for (const rev of page.revisions) {
                            if (rev.user !== from || rev.userhidden)
                                break;
                            edit_count++;
                        }

                        if ($this.hasClass('advancedrollback-clicked'))
                            return;

                        if (edit_count >= rvlimit)
                            $this.text(mw.message('rollbacklinkcount-morethan', edit_count - 1));
                        else
                            $this.text(mw.message('rollbacklinkcount', edit_count));
                    })
                })
            }
        };

        mw.hook('wikipage.content').add(process);
        process($("#mw-content-text")); // HACK: Sometimes the above fail on Special:Diff
    })
    .fail(console.warn)

// </nowiki> Nya~!
