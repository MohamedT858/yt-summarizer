(function () {
	const addSummarizeButton = () => {
		if (document.querySelector('button#summarize-button')) {
			console.log('Summarize button already added');
			return;
		}

		const shareButton = document.querySelector('div#top-level-buttons-computed yt-button-view-model');

		if (!shareButton) {
			console.error('Share button not found');
			return;
		}

		const summarizeButton = document.createElement('button');
		summarizeButton.innerText = 'Summarize';
		summarizeButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading';
		summarizeButton.id = 'summarize-button';
		summarizeButton.style.marginLeft = '10px';

		shareButton.parentNode.insertBefore(summarizeButton, shareButton.nextSibling);

		summarizeButton.addEventListener('click', async () => {
			try {
				if (document.querySelector('div#summary')) {
					console.log('Summary section already added');
					return;
				}
				const summarySection = document.createElement('div');
				summarySection.id = 'description';
				summarySection.className = 'style-scope ytd-watch-metadata summary-section';
				summarySection.innerHTML = getInitialSummaryHTML();

				const descriptionSection = document.querySelector('div#middle-row');
				if (descriptionSection) {
					descriptionSection.parentNode.insertBefore(summarySection, descriptionSection.nextSibling);
				} else {
					console.error('Description section not found');
					return;
				}

				let summary = await summarize();
				if (summary) {
					summary = formatSummary(summary);
				} else {
					summary = 'No summary found!';
				}

				summarySection.innerHTML = getFormattedSummaryHTML(summary);
				addShowLessButton(summarySection);
				addGoogleKeepButton();
				addCopyButton();

			} catch (error) {
				console.error('Error summarizing video:', error);
			}
		});
	};

	const getInitialSummaryHTML = () => {
		return `
				<div id="info-container" class="style-scope ytd-watch-info-text" style="padding: 10px; display: flex; flex-direction: column; margin-top: 15px;">
					<h2 id="summary" style="margin-bottom: 5px; font-size: 1.8rem">Summary</h2>
					<ytd-continuation-item-renderer class="style-scope ytd-item-section-renderer">
						<div id="ghost-cards" class="style-scope ytd-continuation-item-renderer"></div>
						<tp-yt-paper-spinner id="spinner" class="style-scope ytd-continuation-item-renderer" active="">
							<div id="spinnerContainer" class="active style-scope tp-yt-paper-spinner">
								<div class="spinner-layer layer-1 style-scope tp-yt-paper-spinner">
									<div class="circle-clipper left style-scope tp-yt-paper-spinner"><div class="circle style-scope tp-yt-paper-spinner"></div></div>
									<div class="circle-clipper right style-scope tp-yt-paper-spinner"><div class="circle style-scope tp-yt-paper-spinner"></div></div>
								</div>
								<div class="spinner-layer layer-2 style-scope tp-yt-paper-spinner">
									<div class="circle-clipper left style-scope tp-yt-paper-spinner"><div class="circle style-scope tp-yt-paper-spinner"></div></div>
									<div class="circle-clipper right style-scope tp-yt-paper-spinner"><div class="circle style-scope tp-yt-paper-spinner"></div></div>
								</div>
								<div class="spinner-layer layer-3 style-scope tp-yt-paper-spinner">
									<div class="circle-clipper left style-scope tp-yt-paper-spinner"><div class="circle style-scope tp-yt-paper-spinner"></div></div>
									<div class="circle-clipper right style-scope tp-yt-paper-spinner"><div class="circle style-scope tp-yt-paper-spinner"></div></div>
								</div>
								<div class="spinner-layer layer-4 style-scope tp-yt-paper-spinner">
									<div class="circle-clipper left style-scope tp-yt-paper-spinner"><div class="circle style-scope tp-yt-paper-spinner"></div></div>
									<div class="circle-clipper right style-scope tp-yt-paper-spinner"><div class="circle style-scope tp-yt-paper-spinner"></div></div>
								</div>
							</div>
						</tp-yt-paper-spinner>
						<div id="button" class="style-scope ytd-continuation-item-renderer" hidden=""></div>
					</ytd-continuation-item-renderer>
				</div>
			`;
	};

	const getFormattedSummaryHTML = (summary) => {
		return `
			<div id="info-container" class="style-scope ytd-watch-info-text" style="padding: 10px; display: flex; flex-direction: column; ">
			<div id="summary" style="margin-bottom: 5px; font-size: 1.8rem; display: flex; align-items: center;">
			<span>Summary</span>

			<button id="add-to-google-keep-button" 
			style="cursor:pointer; background-color: #ffffffdb;border: 1px solid #ccc;border-radius: 35%;display: inline-block;margin-left: 15px;overflow: hidden;padding: 0px;width: 28px;height: 28px;"
			>
			<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48"><path fill="#ffc107" d="M9,42h23l10-10V9c0-1.7-1.3-3-3-3H9C7.3,6,6,7.3,6,9v30C6,40.7,7.3,42,9,42z"/><path fill="#ffecb3" d="M32,42V32h10L32,42z"/><path fill="#fff" d="M28,36h-8v-7.9c-3.1-1.5-5-4.6-5-8.1c0-5,4-9,9-9c5,0,9,4,9,9c0,3.5-1.9,6.5-5,8.1V36z M22,34h4 v-7.3l0.6-0.3c2.7-1.1,4.4-3.6,4.4-6.5c0-3.9-3.1-7-7-7c-3.9,0-7,3.1-7,7c0,2.9,1.7,5.4,4.4,6.5l0.6,0.3V34z"/><path fill="#fff" d="M22 35h4v3h-4V35zM21 30H27V32H21z"/></svg>
			</button>


			<button id="copy-button"
			style="cursor:pointer; display: inline-block;margin-left: auto;overflow: hidden;padding: 2px;width: 28px;height: 28px; justify-self: flex-end; margin-right: 20px; background-color: #ffffff00;border:none;">
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
			<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
			</svg>
			</button>

			
			</div>
			<p id="summary-text" style="font-size: 1.4rem; margin-right: 20px; line-height: 1.7; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto; box-sizing: border-box;">
					${summary}
			</p>
			<tp-yt-paper-button id="show-less-button" class="button style-scope ytd-text-inline-expander" style-target="host" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" style="
			width: min-content;
			">Show Less</tp-yt-paper-button>
			</div>
			`;
	};

	const addCopyButton = () => {
		const copyButton = document.querySelector('button#copy-button');
		const summaryText = document.querySelector('p#summary-text');

		copyButton.addEventListener('click', () => {
			navigator.clipboard.writeText(summaryText.innerText)
		});

		copyButton.addEventListener('mousedown', () => {
			copyButton.style.opacity = '0.5';
		});

		copyButton.addEventListener('mouseup', () => {
			copyButton.style.opacity = '1';
		});
	};

	const addGoogleKeepButton = () => {
		const googleKeepButton = document.getElementById('add-to-google-keep-button');
		googleKeepButton.addEventListener('click', () => {
			console.log('Google Keep button clicked')
			chrome.runtime.sendMessage({ action: 'authorizeGoogleKeep' }, (response) => {
				if (response && response.token) {
					const summaryText = document.querySelector('div#description p').innerText;
					saveToGoogleKeep(response.token, summaryText);
				} else {
					console.error('Authorization failed or token not received');
				}
			});
		});
	};

	const saveToGoogleKeep = (token, summaryText) => {
		const apiUrl = 'https://keep.googleapis.com/v1/notes';
		const requestBody = {
			title: 'Video Summary',
			textContent: {
				text: summaryText
			}
		};

		fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		})
			.then(response => {
				if (response.ok) {
					alert('Summary saved to Google Keep!');
				} else {
					throw new Error('Failed to save summary to Google Keep');
				}
			})
			.catch(error => {
				console.error('Error saving to Google Keep:', error);
			});
	};

	const addShowLessButton = (summarySection) => {
		const showLessButton = summarySection.querySelector('tp-yt-paper-button#show-less-button');
		const summaryText = summarySection.querySelector('p#summary-text');

		showLessButton.addEventListener('click', () => {
			if (summaryText.style.webkitLineClamp === '1') {
				summaryText.style.display = '-webkit-box';
				summaryText.style.webkitLineClamp = '1000';
				summaryText.style.webkitBoxOrient = 'vertical';
				summaryText.style.overflow = 'hidden';
				showLessButton.innerText = 'Show Less';
			} else {
				summaryText.style.display = '-webkit-box';
				summaryText.style.webkitLineClamp = '1';
				summaryText.style.webkitBoxOrient = 'vertical';
				summaryText.style.overflow = 'hidden';
				showLessButton.innerText = 'Show More';
			}
		});
	};

	const getSubs = async (langCode = 'en') => {
		try {
			const response = await fetch(window.location.href);
			const text = await response.text();
			const ytInitialPlayerResponse = JSON.parse(text.split('ytInitialPlayerResponse = ')[1]?.split(';var')[0]);

			const ct = ytInitialPlayerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
			if (!ct || ct.length === 0) {
				console.error('No captions found!');
				return null;
			}

			const findCaptionUrl = x => ct.find(y => y.vssId.includes(x))?.baseUrl;
			const firstChoice = findCaptionUrl("." + langCode);
			const url = firstChoice ? firstChoice + "&fmt=json3" : (findCaptionUrl(".") || findCaptionUrl("a." + langCode) || ct[0].baseUrl) + "&fmt=json3&tlang=" + langCode;

			if (!firstChoice) console.warn(`No captions found for language code "${langCode}". Using the first available caption instead.`);

			const subsResponse = await fetch(url);
			const subsJson = await subsResponse.json();
			return subsJson.events.map(x => ({
				...x,
				text: x.segs?.map(seg => seg.utf8).join(" ").replace(/\n/g, ' ').replace(/♪|'|"|\.{2,}|\<[\s\S]*?\>|\{[\s\S]*?\}|\[[\s\S]*?\]/g, '').trim() || ''
			}));
		} catch (error) {
			console.error('Error fetching captions:', error);
			return null;
		}
	};

	const logSubs = async (langCode) => {
		const subs = await getSubs(langCode);
		const text = subs?.map(x => x.text).join('\n').replace(/\n{2,}/g, '\n').trim();
		console.log(text);
		return text;
	};

	const summarize = async () => {
		try {
			const videoTitle = document.querySelector('h1.title.style-scope.ytd-video-primary-info-renderer yt-formatted-string').innerText;
			const channelName = document.querySelector('ytd-channel-name yt-formatted-string').innerText;
			const text = await logSubs('en');

			if (!text) {
				console.error('No captions found');
				return null;
			}

			const geminiApiKey = 'AIzaSyAz6yzq9xEC-ZNoMuQUOxY2wlhsUL16grQ';
			const prompt = `Summarize the video bearing in mind that your response should be a brief and concise summary of the video as it's going to be used directly in a section in the website itself (add bullet points as needed to make it as clear as possible). Summarize in less than 100 words making sure to only reply with the summarization. Here's the title "${videoTitle}", and here's the video caption from the channel "${channelName}":\n\n${text}`;

			const generationConfig = {
				temperature: 1,
				topP: 0.95,
				topK: 64,
				responseMimeType: "text/plain",
			};

			const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
					safetySettings: [
						{ category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: 'BLOCK_NONE' },
						{ category: "HARM_CATEGORY_HATE_SPEECH", threshold: 'BLOCK_NONE' },
						{ category: "HARM_CATEGORY_HARASSMENT", threshold: 'BLOCK_NONE' },
						{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: 'BLOCK_NONE' }
					],
					generationConfig,
				}),
			});

			const json = await response.json();
			const summary = json.candidates[0]?.content?.parts[0]?.text;
			console.log('Summary:', summary);
			return summary;
		} catch (error) {
			console.error('Error summarizing video:', error);
			return null;
		}
	};

	const formatSummary = (summary) => {
		return summary
			.replace(/(\s[-*]\s)/g, '<br>• ')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
	};

	const resetSummary = () => {
		const summarySection = document.querySelector('div.summary-section');
		if (summarySection) {
			summarySection.remove();
		}
	};

	const observeDOMChanges = () => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length > 0 && document.querySelector('div#top-level-buttons-computed yt-button-view-model') && !document.querySelector('button#summarize-button')) {
					addSummarizeButton();
				}
			});
		});

		const config = { childList: true, subtree: true };
		observer.observe(document.body, config);

		addSummarizeButton();
	};

	observeDOMChanges();

	window.addEventListener('yt-navigate-finish', () => {
		console.log('yt-navigate-finish event');
		resetSummary();
		init();
	});

	const init = () => {
		addSummarizeButton();
	};

})();