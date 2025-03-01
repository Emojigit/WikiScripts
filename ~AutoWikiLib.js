window.WikiLibSites = [
	// Double-checked
	'www.science.org', // www.sciencemag.org

	// Needs double-checking for real target
	'www.fulcrum.org',
	'dl.acm.org',
	'pubs.asha.org',
	'platform.almanhal.com',
	'search.alexanderstreet.com',
	'jamanetwork.com',
	'www.anb.org',
	'psychiatryonline.org',
	'psycnet.apa.org',
	'www.ancestryinstitution.com',
	'www.annualreviews.org',
	'bmj.com',
	'brill.com',
	'bristoluniversitypressdigital.com',
	'microform.digital',
	'ceeol.com',
	'www.cairn.info',
	'www.cambridge.org',
	'www.cochranelibrary.com',
	'www.degruyter.com',
	'read.dukeupress.edu',
	'elibrary.duncker-humblot.com',
	'search.ebscohost.com',
	'publications.edpsciences.org',
	'dlib.eastview.com',
	'www.euppublishing.com',
	'www.elgaronline.com',
	'www.e-enlightenment.com',
	'www.sciencedirect.com',
	'fold3.com',
	'www.foreignaffairs.com',
	'www.galepages.com',
	'www.haaretz.com',
	'www.haaretz.co.il',
	'www.heinonline.org',
	'www.icevirtuallibrary.com',
	'ieeexplore.ieee.org',
	'www.iwaponline.com',
	'ipsj.ixsq.nii.ac.jp',
	'www.jstor.org',
	'www.loebclassics.com',
	'www.mohrsiebeck.com',
	'www.nature.com',
	'access.newspaperarchive.com',
	'www.nomos-elibrary.de',
	'www.numeriquepremium.com',
	'data.oecd.org',
	'www.oecd-gallery.org',
	'www.oecd-ilibrary.org',
	'www.openedition.org',
	'academic.oup.com',
	'www.oxfordartonline.com',
	'www.oxfordbibliographies.com',
	'www.oxforddnb.com',
	'www.oxfordmusiconline.com',
	'www.oxfordreference.com',
	'oxfordre.com',
	'www.pnas.org',
	'www.proquest.com',
	'muse.jhu.edu',
	'journals.sagepub.com',
	'www.spiedigitallibrary.org',
	'journals.co.za',
	'link.springer.com',
	'www.tandfonline.com',
	'www.themarker.com',
	'www.journals.uchicago.edu',
	'www.fulcrum.org',
	'www.wikilala.com',
	'onlinelibrary.wiley.com',
	'www.wwp.northeastern.edu',
	'www.worldscientific.com',
	'erudit.org',
];

$(() => {
	const doiRegex = '^(https?:)?(\/\/)?(www\.)?(dx\.)?doi\.org\/?(.*)?$';

	mw.hook('wikipage.content').add(function(e){
		if (!e.is("#mw-content-text"))
			return;
		
		const match_data = {};
		
		for (let domain of window.WikiLibSites) {
			const regex = '^(https?:)?(\/\/)?(www\.)?' + domain.replaceAll('.', '\.') + '\/?(.*)?$';
			const target = 'https://' + domain.replaceAll('.', '-') + '.wikipedialibrary.idm.oclc.org/';
			
			match_data[regex] = target;
		}
		
		const isWikiLib = function(link) {
			for (let [regex, target] of Object.entries(match_data)) {
				const match = link.match(regex);
				    
				if (match === null)
					continue;
		
				const path = match[4] || '';
				return target + path;
			}
			return null;
		};
		
		e.find("a").each(function() {
			const $this = $(this);
			
			if ($this.hasClass("WikiLibProcessed"))
				return;
			$this.addClass("WikiLibProcessed");
	
			const link = $this.attr("href");
			
			if (link === undefined)
				return;
			
			{
				const match = link.match(doiRegex);
				if (match !== null && match[5] !== undefined) {
					const doi = match[5];
					
					$.ajax({
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
							
							console.log(`DOI matching for ${doi}, found resource ${link || 'none'}`, data);
							
							if (link !== null) {
								const newLink = isWikiLib(link);
								console.log(`DOI matching for ${link}, found ${newLink || 'none'}`);
								if (newLink !== null) {
									$("<a>")
									    .text("[WikiLib]")
									    .attr("href", newLink)
									    .css("vertical-align", "super")
									    .insertAfter($this);
								}
							}
						},
					});
					return;
				}
			}
			
			const newLink = isWikiLib(link);
			console.log(`Normal matching for ${link}, found ${newLink || 'none'}`);
			if (newLink !== null) {
				$("<a>")
				    .text("[WikiLib]")
				    .attr("href", newLink)
				    .css("vertical-align", "super")
				    .insertAfter($this);
				return;
			}
		});
	});
});
