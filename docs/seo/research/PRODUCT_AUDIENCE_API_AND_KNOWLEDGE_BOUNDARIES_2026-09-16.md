# Octoport audience, analytics, advertising and knowledge-source boundaries

Date: 2026-09-16.
Status: CURRENT STRATEGY RESEARCH NOTE.

## Product framing

Octoport is **not the AI employee itself**. Octoport is the access/control layer that turns a user's chosen supported AI/LLM into a marketplace employee by giving that AI governed access to the seller's Ozon/Wildberries data and supported working capabilities.

The product is therefore not another proprietary AI assistant, dashboard-only analytics service, card-image generator, or real-time bid-management bot. The user's AI remains the intelligence/conversation layer; Octoport gives it the marketplace context, data and tools required to work as the seller's AI employee.

Conceptual positioning: `your AI -> Octoport -> marketplace cabinet/data/tools -> your AI can work as an employee`.

The SEO acquisition layer should capture people searching for existing problem/solution language even when they do not yet know the new category or the Octoport mechanism. Existing searches for AI agents, analytics, seller reports, marketplace assistance and LLM-to-store connection can all be acquisition entrances when the underlying user job matches the product.

## Priority acquisition intents

Include as potentially relevant search demand:

1. AI agent/assistant for Ozon/Wildberries and connection of ChatGPT/other LLMs to seller data.
2. Seller-cabinet analytics, seller reports, sales/profit/stock/search-query analytics and services that aggregate marketplace reports.
3. Help with daily marketplace work: understanding the cabinet, reports, products/cards, supplies, orders, reviews, pricing and other operational tasks.
4. Product-card work when the task is operational/content assistance (structure, attributes, descriptions, SEO, compliance, checking/filling), not stand-alone image/infographic generation.
5. Advertising analysis/assistance: reports, campaign statistics, diagnostics, explanations, recommendations and planning. Exclude the separate real-time bid-bot/repricer-like intent whose primary value is continuous automatic bid management.
6. Marketplace/search/niche analytics where the official marketplace API actually exposes such data.

## Exclude from core product demand

- stand-alone AI image/photo/infographic/card generators;
- generic neural-network courses;
- pure creative generators with no seller-cabinet workflow;
- real-time automatic advertising bid bots as a separate product category;
- unsupported market-intelligence claims not actually available through Ozon/WB sources.

## Wildberries evidence

Official WB seller documentation states that the WB API `Analytics` category can provide sales-funnel data, buyer search queries, stock reports, regional sales, brand share in overall sales, returns, paid storage and other seller analytics. It explicitly lists a use case of connecting an analytics service and automatically receiving reports for business decisions.

Source: https://seller.wildberries.ru/instructions/en/kz/material/wb-api-data-categories-kz

WB official search-analytics help states that the `Поисковые запросы` report is available through the public API.

Source: https://seller.wildberries.ru/instructions/ru/ru/subcategory/search-analytics

WB's seller portal documentation also states that analytics reports can compare card metrics, analyze marketplace search queries and help find promising niches. This confirms that at least part of marketplace-level/search/niche analytics exists in the WB seller ecosystem, not only private account totals.

Source: https://seller.wildberries.ru/instructions/ru/uz/material/how-to-work-with-portal-data-securely-uzbekistan

The WB API `Promotion` category supports campaign creation/management, bid changes, budget monitoring and ad-efficiency statistics. For Octoport launch positioning, use the analytical/read-only part and do not position the product as a 24/7 bid bot.

Source: https://seller.wildberries.ru/instructions/en/kz/material/wb-api-data-categories-kz

WB API also has a `Content` category for creating/editing product cards, confirming that product-card workflow is an API-addressable seller-cabinet task. Current Octoport launch scope remains read-only, so SEO copy must describe help/analysis/preparation unless write capability is explicitly released later.

Source: https://seller.wildberries.ru/instructions/en/kz/material/wb-api-data-categories-kz

## Wildberries knowledge/help evidence

Wildberries itself now ships a seller `Помощник` that answers free-form questions about analytics and work in WB Partners. WB explicitly says its answers are formed from available analytical reports and materials of the help center.

Sources:
- https://seller.wildberries.ru/instructions/ka/ru/material/wbot-analytics-in-the-app
- https://seller.wildberries.ru/instructions/hy/kz/material/wbot-analytics-in-the-app

This is strong market validation for the combined mechanic `seller data + official help knowledge + conversational AI`.

However, the current public WB API data-category list does not contain a dedicated knowledge-base/help-center category. Therefore do not claim that the WB knowledge base itself is retrievable through Seller API. Treat official help-center content as a separate authoritative public knowledge source from operational API data.

## Ozon evidence

Ozon Seller API exposes seller analytics and report workflows. Current public developer material confirms dedicated search-query analytics methods `/v1/analytics/product-queries` and `/v1/analytics/product-queries/details`, described as API analogues of Seller Cabinet `Аналитика -> Товары в поиске -> Запросы моего товара`.

Source: https://dev.ozon.ru/news/512-Novye-metody-dlia-raboty-s-analitikoi-po-zaprosam-tovarov-v-Seller-API/

Seller API also exposes analytics/report surfaces for store metrics, stock, products, postings and finance. Current official docs site is difficult to crawl directly, but Ozon developer materials and current OpenAPI-derived surfaces confirm these operation families.

Ozon's seller UI has broader analytics tooling, including search-query analytics and seller/business analytics. Current public evidence proves API access to seller/product search analytics; it does not yet prove that every broader market/niche/competitor view from the Ozon UI is available through Seller API. Do not promise full external-market analytics from Ozon until endpoint-level audit proves it.

Ozon Performance API is the separate advertising API. Its current OpenAPI surface contains Campaign, Statistics, Ad, Product, Search-Promo and Vendor sections, including campaign/statistics and bid-related operations. This supports ad analysis and, where later product scope allows, campaign actions. It does not justify positioning Octoport as a continuous bid-management bot.

Source (current OpenAPI mirror built from official Ozon Swagger): https://github.com/MissiaL/ozon-api/blob/main/references/ozon-performance-openapi.json

## Ozon knowledge/help boundary

Ozon has a public seller education/knowledge-base ecosystem (`seller-edu.ozon.ru`) and an Ozon for dev documentation/community ecosystem. Current evidence does not show a dedicated Seller API endpoint whose purpose is to return the seller knowledge base/help-center articles.

Therefore use the same architectural distinction as for WB:

- marketplace API = live seller/shop/advertising/report truth;
- official seller help/knowledge pages = procedural/product knowledge about how the cabinet works;
- the user's AI can combine both through Octoport only when each source is independently authoritative/current.

Do not describe knowledge-base answers as coming `through Seller API` unless a dedicated API is later found and verified.

## Strategic consequence for SEO

The semantic universe should not be inflated to millions of phrases. The goal is to capture a bounded set of human jobs around one product mechanism:

`turn the user's chosen AI into a marketplace employee`.

Existing search language can enter through older categories — AI agents, analytics services, seller reports, marketplace help, product-card work, ad analytics — while Octoport explains the newer mechanism after acquisition: the user does not buy another proprietary AI; Octoport equips the AI they choose with marketplace data and tools.

The key distinction is task-level fit, not exact vocabulary match.