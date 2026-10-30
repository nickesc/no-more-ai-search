# Extension Release Text

Name:

```txt
No More AI Search
```

Summary:

```txt
Remove AI Overview and the AI Mode button from Google Search results
```

Description:

```txt
No More AI Search hides AI Overviews and answers, and AI Mode buttons in Google Search. It also hides the AI promotion button in Google Docs.

Page checks run in your browser. The extension sends no page content to the developer and uses no analytics. Your browser may sync your saved options across devices if you enable browser sync.

Google changes its pages over time, so hiding may need updates. Report missed AI sections through the support link.

Based on Google AI Overviews Blocker by zbarnz. Source code is available on GitHub under the MIT License. See https://github.com/nickesc/no-more-ai-search for more information.
```

Support URL:

```txt
https://github.com/nickesc/no-more-ai-search/issues
```

Support Email:

```txt
info@nescobar.media
```

## Chrome

Homepage URL:

```txt
https://github.com/nickesc/no-more-ai-search
```

Privacy Policy URL:

```txt
https://github.com/nickesc/no-more-ai-search/blob/main/PRIVACY.md
```

Single purpose:

```txt
Let users hide AI features in Google Search and Google Docs, with separate controls for AI Overviews, AI Mode buttons, and the Docs AI button.
```

Storage Justification:

```txt
Save the user's preferences and apply them when Google pages load. The extension uses browser sync storage so preferences can follow the user's browser sync settings.
```

Host Justification:

```txt
Access Google pages to find and hide AI Overviews, answers, AI Mode buttons, and the AI promotion button in Google Docs. Google domain permissions cover Search across regional domains and Docs on docs.google.com. Page checks run in the browser.
```

## Firefox

Privacy Policy:

```txt
No More AI Search checks page content on Google pages to find AI features to hide. These checks run in your browser. The extension does not save page content or send it to the developer or external servers. The extension uses no analytics, tracking, advertising, or remote code. The developer does not sell or share user data.

The extension uses your browser's sync storage to save preferences. If you enable browser sync, your browser provider may sync these preferences across your devices.
```

Notes:

```txt
Build with Git, Node.js 24, and zip. This script replicates the test and packaging commands from the release workflow:

unzip no-more-ai-search-0.3.0.zip
cd no-more-ai-search-0.3.0
node --test tests/*.test.cjs
mkdir -p dist
zip -r "dist/no-more-ai-search-0.3.0.zip" manifest.json icons src LICENSE -x '*/.*' 'src/userscript.js'

Test on a Google search that shows an AI Overview, such as "how to swim". Change each option in the toolbar popup, click Save, and reload to compare. Testing the Docs option requires a Google account that shows the AI promotion button in the Docs editor.

No More AI Search is a fork of zbarnz/Google_AI_Overviews_Blocker with per-feature settings and Google Docs support.
```
