/**
 * Append Wikipedia Linrary links to supported site links.
 * 
 * Use the following line to load this script:
 * mw.loader.load( "https://zh.wikipedia.org/w/index.php?title=User:1F616EMO/AutoWikiLib.js&action=raw&ctype=text/javascript" );
 * 
 * This script is made by 1F616EMO on zhwiki, licensed under CC BY-SA 4.0.
 * 
 */
// <nowiki>

// All WikiLib sites, without www.
window.WikiLibSites = [
    // Double-checked
    'science.org', // www.sciencemag.org

    // Needs double-checking for real target
    'fulcrum.org',
    'dl.acm.org',
    'pubs.asha.org',
    'platform.almanhal.com',
    'search.alexanderstreet.com',
    'jamanetwork.com',
    'anb.org',
    'psychiatryonline.org',
    'psycnet.apa.org',
    'ancestryinstitution.com',
    'annualreviews.org',
    'bmj.com',
    'brill.com',
    'bristoluniversitypressdigital.com',
    'microform.digital',
    'ceeol.com',
    'cairn.info',
    'cambridge.org',
    'cochranelibrary.com',
    'degruyter.com',
    'read.dukeupress.edu',
    'elibrary.duncker-humblot.com',
    'search.ebscohost.com',
    'publications.edpsciences.org',
    'dlib.eastview.com',
    'euppublishing.com',
    'elgaronline.com',
    'e-enlightenment.com',
    'sciencedirect.com',
    'fold3.com',
    'foreignaffairs.com',
    'galepages.com',
    'haaretz.com',
    'haaretz.co.il',
    'heinonline.org',
    'icevirtuallibrary.com',
    'ieeexplore.ieee.org',
    'iwaponline.com',
    'ipsj.ixsq.nii.ac.jp',
    'jstor.org',
    'loebclassics.com',
    'mohrsiebeck.com',
    'nature.com',
    'access.newspaperarchive.com',
    'nomos-elibrary.de',
    'numeriquepremium.com',
    'data.oecd.org',
    'oecd-gallery.org',
    'oecd-ilibrary.org',
    'openedition.org',
    'academic.oup.com',
    'oxfordartonline.com',
    'oxfordbibliographies.com',
    'oxforddnb.com',
    'oxfordmusiconline.com',
    'oxfordreference.com',
    'oxfordre.com',
    'pnas.org',
    'proquest.com',
    'muse.jhu.edu',
    'journals.sagepub.com',
    'spiedigitallibrary.org',
    'journals.co.za',
    'link.springer.com',
    'tandfonline.com',
    'themarker.com',
    'journals.uchicago.edu',
    'fulcrum.org',
    'wikilala.com',
    'onlinelibrary.wiley.com',
    'wwp.northeastern.edu',
    'worldscientific.com',
    'erudit.org',
];

$(() => {
    const isWikiLibSite = function (link) {
        for (const FQDN of window.WikiLibSites) {
            const regex = new RegExp(`^(https?:)?(\/\/)?(www\.)?${FQDN.replaceAll('.', '\.')}(\/.*)?$`);
            if (regex.test(link)) {
                return true;
            }
        }
        return false;
    }

    mw.util.addCSS(`
        .WikiLibLink::after {
            content: '[WikiLib]';
            vertical-align: super;
        }
    `);

    const addWikiLibLink = function ($link, targetLink) {
        // Why no encodeURLComponent? No idea what EZproxy is doing.
        const newLink = 'https://wikipedialibrary.idm.oclc.org/login?auth=production&url=' + targetLink;
        return $("<a>")
            .attr("href", newLink)
            .addClass("WikiLibLink")
            .insertAfter($link);
    }

    const doiRegex = new RegExp('^(https?:)?(\/\/)?(www\.)?(dx\.)?doi\.org\/?(.*)?$');

    const handleLink = function ($link) {
        const link = $link.attr("href");
        if (
            link === undefined || // href doesn't exist, probably old use of anchor
            !(link.startsWith("http://") || link.startsWith("https://") || link.startsWith("//")) // not an external link
        )
            return;

        if (link.startsWith("//")) {
            link = location.protocol + link;
        }

        // Check (www.)doi.org or (www.)dx.doi.org
        const match = link.match(doiRegex);
        if (match !== null && match[5] !== undefined) {
            const doi = match[5];

            return $.ajax({
                url: 'https://api.crossref.org/works/' + doi,
                dataType: 'json',
                success: function (data) {
                    if (data.status !== 'ok')
                        return;

                    let link = null;
                    const message = data.message;

                    if (message.resource && message.resource.primary && message.resource.primary.URL) {
                        link = message.resource.primary.URL;
                    } else if (message.link) {
                        for (const entry of message.link) {
                            if (entry.URL) {
                                link = entry.URL;
                                break;
                            }
                        }
                    }

                    if (link !== null && isWikiLibSite(link)) {
                        addWikiLibLink($link, link);
                    }
                }
            });
        }

        if (isWikiLibSite(link)) {
            addWikiLibLink($link, link);
        }
    }

    mw.hook('wikipage.content').add(function (e) {
        if (!e.is("#mw-content-text"))
            return;

        e.find("a").each(function () {
            handleLink($(this));
        });
    });
});

// </nowiki> Nya~