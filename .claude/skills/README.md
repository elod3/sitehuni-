# Skill-uri: reclame AI și agenți

Skill-uri pentru Claude Code (și pentru orice agent care citește formatul SKILL.md): prompturi pentru video și imagini AI, reclame pe nișe și agentul care produce reclame cu Higgsfield CLI.

Folderul `.claude/` nu e publicat pe GitHub Pages (workflow-ul copiază doar `*.html` și `assets/`).

## Ce conține

| Skill | Pentru ce |
|---|---|
| `prompturi-video-ai` | formula de prompt video, image-to-video, @image1, multi-shot, cameră, audio, depanare, note pe modele |
| `prompturi-imagini-ai` | prompturi de imagine, text în imagine, editări, vocabular foto pe nișe, prompturi JSON + `scripts/din_json.py` |
| `reclame-imobiliare` | reclame off-plan, animarea randărilor, hook-uri, Meta Housing, fapte Arcadian + prompturi gata făcute |
| `reclame-brutarie` | food cinematography, cadre-semnătură, concepte locale, calendar lunar |
| `reclame-magazin-muzica` | instrumente, atenție la branduri, concepte |
| `agent-reclame-higgsfield` | fluxul agentului: brief → cost → generare → QA → registru → livrare; `scripts/registru.py`; system prompt |
| `realism-si-lumina` | cum faci AI-ul să pară fotografie reală: lumină, aparat, imperfecțiuni, semnele de AI și reparația lor, scheme de lumină gata de copiat |
| `asseturi-web-ai` | asset-uri pentru site: style lock, hero, bucle video, carduri, iconițe, OG, 3D; `scripts/optimizeaza.sh` (WebP, srcset, MP4 + WebM, poster, tag HTML) |
| `aparare-prompt-injection` | cum funcționează prompt injection și cum te aperi: reguli pentru AI, agenți siguri (trifecta, Rule of Two, tipare), Claude Code (permisiuni, sandbox, hook), teste; `scripts/scan_injectie.py` (scanner + hook) |
| `cercetare-edge-trading` | metodologia de testare a strategiilor: edge scan, drift, costuri, IS/OOS, walk-forward, |t|>3, DSR, capcane, concepte din literatură; `scripts/statistici.py` (verdict statistic) |
| `risc-si-dimensionare` | risc per trade, vol targeting, Kelly fracționat, limite automate, levier și lichidare pe futures; `scripts/dimensionare.py` (calculator de poziție) |
| `agent-trading` | ce face și ce nu face LLM-ul în trading, arhitectura motor determinist + agent, chei de bursă, backtest → paper → live, producție, system prompt, impozite RO |
| `carti-in-ipoteze` | cărți și cursuri de trading → fișe de ipoteze testabile + registru de încercări, cu verificarea fișierelor înainte de citire |
| `scriere-prompturi-agenti` | cum scrii prompturi, system prompts și skill-uri pentru Claude și agenți |

## Instalare (Arch)

În acest proiect, skill-urile funcționează deja (Claude Code citește `.claude/skills/`). Ca să le ai peste tot:

```bash
mkdir -p ~/.claude/skills
cp -r .claude/skills/*/ ~/.claude/skills/

# Higgsfield CLI + skill-urile oficiale (generate, product-photoshoot, soul-id…)
npm i -g @higgsfield/cli          # sau: curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh
higgsfield auth login
npx skills add higgsfield-ai/skills

# pentru optimizeaza.sh
sudo pacman -S ffmpeg

# sandbox pentru Claude Code (vezi aparare-prompt-injection/reference/claude-code.md)
sudo pacman -S bubblewrap socat
```

Skill-urile de aici se bazează pe cele oficiale pentru execuție. Instalează-le pe amândouă.

## Surse (research, septembrie 2026)

- Higgsfield CLI: https://github.com/higgsfield-ai/cli · https://higgsfield.ai/cli
- Skill-uri oficiale Higgsfield: https://github.com/higgsfield-ai/skills
- Seedance 2.0: https://higgsfield.ai/blog/seedance-prompting-guide · Seedance 2.5: https://higgsfield.ai/blog/seedance-2-5-on-higgsfield-2026
- Seedance 2.5 @image/@video/@audio: https://openart.ai/blog/seedance-2-5-prompt-guide/ · https://dreamina.capcut.com/seedance/seedance-2-5-prompt
- Veo 3.1 (Google): https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1
- Kling 3.0: https://blog.fal.ai/kling-3-0-prompting-guide/ · https://kling.ai/quickstart/klingai-video-3-model-user-guide
- GPT Image (OpenAI): https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide
- Nano Banana Pro (Google): https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/
- Test JSON vs. proză (Nano Banana): https://chasejarvis.com/blog/does-json-prompting-actually-work-tested-with-nano-banana/
- Realism fotografic: https://roo.beehiiv.com/p/why-photorealistic-doesn-t-work-in-ai-prompts-and-what-to-write-instead
- Video hero pentru web: https://johnbeales.com/2025/performant-video-hero-backgrounds/ · https://www.gomasuga.com/articles/best-practices-for-html-background-videos
- Prompt injection: https://genai.owasp.org/llmrisk/llm01-prompt-injection/ · https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html · https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ · https://ai.meta.com/blog/practical-ai-agent-security/ · https://arxiv.org/abs/2506.08837 · https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks · https://www.anthropic.com/news/prompt-injection-defenses · https://code.claude.com/docs/en/sandboxing
- Trading: Deflated Sharpe (Bailey, López de Prado) https://www.davidhbailey.com/dhbpapers/deflated-sharpe.pdf · lookahead în LLM-uri https://arxiv.org/pdf/2512.23847 · benchmark agenți LLM cu memorie controlată https://arxiv.org/html/2605.28359v1 · kill switch și chei API https://cryptoadventure.com/bot-deployment-checklist-for-crypto-traders-sub-accounts-api-permissions-and-kill-switches/ · impozit cripto 2026 https://contapp.ro/blog/impozitarea-veniturilor-din-criptomonede/
- Anthropic, skill-uri: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Anthropic, prompting: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Etichete AI în reclamele Meta: https://coinis.com/blog/meta-ai-content-labeling-facebook-instagram-ads-2026
- Reclame imobiliare pe Meta: https://adlibrary.com/posts/best-real-estate-meta-ads-examples

Modelele și parametrii Higgsfield se schimbă des. Când ceva nu se potrivește, `higgsfield model list` și `higgsfield model get <id>` au întotdeauna dreptate față de aceste fișiere.
