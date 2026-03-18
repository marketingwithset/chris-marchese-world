-- ============================================================
-- Seed Data — Initial content for Chris Marchese World
-- ============================================================

-- ART GALLERY
INSERT INTO content_items (zone_id, title, subtitle, description, media_type, media_url, metadata, price, purchasable, sort_order) VALUES
('art_gallery', 'Golden Hour', 'Oil on Canvas — Art by Marchese', 'A study in light and shadow capturing the essence of the golden hour across an urban landscape. Part of the Art by Marchese collection, exhibited at Art Basel Miami and galleries in Toronto, Miami, and NYC. Available on Artsy.', 'image', NULL, '{"artist": "Chris Marchese", "medium": "Oil on Canvas", "year": "2024", "size": "48\" x 36\"", "gallery": "Art Basel Miami"}', 12000, TRUE, 1),
('art_gallery', 'Concrete Dreams', 'Mixed Media — Pop-Culture Series', 'An exploration of urban architecture through mixed media, blending photography with painted elements.', 'image', NULL, '{"artist": "Chris Marchese", "medium": "Mixed Media", "year": "2024", "size": "36\" x 24\"", "collection": "Pop-Culture Series"}', 8500, TRUE, 2),
('art_gallery', 'The Observer', 'Acrylic on Panel', 'A bold portrait piece exploring themes of perception and identity in the modern digital age.', 'image', NULL, '{"artist": "Chris Marchese", "medium": "Acrylic on Panel", "year": "2025", "size": "40\" x 30\"", "platform": "Artsy"}', 15000, TRUE, 3),
('art_gallery', 'Velocity', 'Digital Print — Automotive Series', 'A high-contrast composition inspired by automotive culture and the beauty of speed.', 'image', NULL, '{"artist": "Chris Marchese", "medium": "Digital Print", "year": "2025", "size": "60\" x 40\""}', 5000, TRUE, 4),
('art_gallery', 'Set The Pace', 'Photography', 'A defining image from the Setting The Pace series — movement, intention, and vision captured in a single frame.', 'image', NULL, '{"artist": "Chris Marchese", "medium": "Photography", "year": "2025", "size": "30\" x 20\""}', 3500, TRUE, 5);

-- FILM STUDIO
INSERT INTO content_items (zone_id, title, subtitle, description, media_type, media_url, metadata, sort_order) VALUES
('film_studio', 'The Martini Shot', 'Feature Film (2023)', 'Associate Producer. Starring Matthew Modine and John Cleese. A compelling drama about the final days of a legendary director.', 'embed', 'https://player.vimeo.com/video/1174206252?autoplay=1&loop=1&autopause=0&muted=1', '{"role": "Associate Producer", "cast": "Matthew Modine, John Cleese", "year": "2023", "format": "Feature Film"}', 1),
('film_studio', 'This Mortal Coil', 'Feature Film (2026)', 'Actor & Associate Producer. Filmed in Iceland. An epic existential journey exploring the boundaries between life and legacy.', 'embed', 'https://player.vimeo.com/video/1173874678?autoplay=1&loop=1&autopause=0&muted=1', '{"role": "Actor & Associate Producer", "location": "Iceland", "year": "2026", "format": "Feature Film"}', 2),
('film_studio', 'Campaign Reel 2025', 'Director''s Cut', 'The complete campaign reel showcasing creative direction across fashion, automotive, and lifestyle projects.', 'embed', 'https://player.vimeo.com/video/1173874041?autoplay=1&loop=1&autopause=0&muted=1', '{"type": "Reel", "duration": "3:42", "format": "4K", "production": "SET Marketing"}', 3);

-- AUTOMOTIVE
INSERT INTO content_items (zone_id, title, subtitle, description, media_type, media_url, metadata, sort_order) VALUES
('automotive', 'BMW Partnership', 'Brand Campaign', 'Exclusive editorial series produced for BMW through SET Marketing. Featuring blacked-out luxury vehicles shot against minimalist architectural backdrops.', 'embed', 'https://player.vimeo.com/video/1173872281?autoplay=1&loop=1&autopause=0&muted=1', '{"client": "BMW", "project": "Brand Campaign", "year": "2025"}', 1);

-- FASHION
INSERT INTO content_items (zone_id, title, subtitle, description, media_type, metadata, price, purchasable, sort_order) VALUES
('fashion_runway', 'Midnight Gold Jacket', 'Outerwear Collection', 'Premium leather jacket with gold hardware accents. Tailored fit with signature lining.', 'image', '{"collection": "FW25", "material": "Italian Leather"}', 2800, TRUE, 1),
('fashion_runway', 'Essential Black Tee', 'Core Collection', 'Heavyweight cotton tee with embossed logo detail. The foundation of every outfit.', 'image', '{"collection": "Core", "material": "300gsm Cotton"}', 120, TRUE, 2),
('fashion_runway', 'Pace Setter Trousers', 'Tailored Collection', 'Slim-cut tailored trousers with subtle gold stitching. Designed to move.', 'image', '{"collection": "FW25", "material": "Wool Blend"}', 680, TRUE, 3);

-- CAPITAL
INSERT INTO content_items (zone_id, title, subtitle, description, media_type, metadata, sort_order) VALUES
('capital_deals', 'Deal Origination', 'SET Ventures Pipeline', 'SET Ventures (est. 2021) sources, evaluates, and closes private equity and strategic investment opportunities.', 'image', '{"founded": "2021", "focus": "Private Equity & Funding", "pipeline": "4-Stage Process"}', 1),
('capital_services', 'Investment Advisory', 'SET Ventures', 'Comprehensive investment advisory services for high-net-worth individuals and institutional partners.', 'image', '{"service": "Investment Advisory", "division": "SET Ventures"}', 1),
('capital_services', 'Private Equity', 'SET Ventures', 'Direct private equity investments in high-growth companies.', 'image', '{"service": "Private Equity", "division": "SET Ventures"}', 2),
('capital_services', 'Strategic Capital', 'SET Ventures', 'Strategic capital deployment for businesses at inflection points.', 'image', '{"service": "Strategic Capital", "division": "SET Ventures"}', 3),
('capital_clients', 'Portfolio Companies', 'SET Ventures Portfolio', 'Active portfolio of companies across technology, real estate, consumer brands, and services.', 'image', '{"division": "SET Ventures", "type": "Portfolio Overview"}', 1);

-- INFRASTRUCTURE
INSERT INTO content_items (zone_id, title, subtitle, description, media_type, metadata, sort_order) VALUES
('infra_projects', 'Development', 'Real Estate & Infrastructure', 'SET Enterprises identifies and develops real estate opportunities in key markets including Toronto and Miami.', 'image', '{"service": "Development", "markets": "Toronto, Miami"}', 1),
('infra_projects', 'Construction Management', 'Project Delivery', 'End-to-end construction management services from pre-construction planning through final delivery.', 'image', '{"service": "Construction", "type": "Full-Cycle Management"}', 2),
('infra_projects', 'Renovation & Repositioning', 'Value-Add Projects', 'Strategic renovation and repositioning of underperforming assets.', 'image', '{"service": "Renovation", "strategy": "Value-Add"}', 3),
('infra_projects', 'Design & Architecture', 'Creative Direction', 'Architectural design and creative direction for infrastructure projects.', 'image', '{"service": "Design", "type": "Architecture & Interiors"}', 4),
('infra_systems', 'Systems & Technology', 'Infrastructure Tech Stack', 'Proprietary technology systems that power SET Enterprises operations.', 'image', '{"service": "Technology", "type": "Systems Integration"}', 1),
('infra_tech', 'Blueprint & Planning', 'Pre-Development', 'Comprehensive pre-development planning including feasibility studies, market analysis, and zoning review.', 'image', '{"service": "Planning", "phase": "Pre-Development"}', 1);

-- GROWTH / MARKETING
INSERT INTO content_items (zone_id, title, subtitle, description, media_type, metadata, sort_order) VALUES
('growth_services', 'Strategic Advisory', 'SET Marketing', 'High-level strategic advisory for brands looking to scale. $500M+ in client revenue since 2019.', 'image', '{"service": "Strategic Advisory", "division": "SET Marketing", "founded": "2019"}', 1),
('growth_services', 'Fractional CMO', 'SET Marketing', 'Executive-level marketing leadership on a fractional basis.', 'image', '{"service": "Fractional CMO", "division": "SET Marketing"}', 2),
('growth_services', 'Creative & Brand Development', 'SET Marketing', 'Full-service creative and brand development from identity design to campaign execution.', 'image', '{"service": "Creative & Brand Dev", "division": "SET Marketing"}', 3),
('growth_services', 'BPO Solutions', 'SET Marketing', 'Business Process Outsourcing solutions that enable companies to scale operations efficiently.', 'image', '{"service": "BPO Solutions", "division": "SET Marketing"}', 4),
('growth_results', '$500M+ Client Revenue', 'Proven Results', 'SET Marketing has generated over $500 million in revenue for clients since 2019.', 'image', '{"revenue": "$500M+", "cpaReduction": "27%", "clients": "BMW, Wynn, Huawei", "rating": "5.0 Stars (29 Reviews)"}', 1),
('growth_social', '@thechrismarchese', '340K+ Followers', 'Social media presence spanning 340K+ followers. Content covers entrepreneurship, luxury lifestyle, and business insights.', 'embed', '{"handle": "@thechrismarchese", "followers": "340K+", "platform": "Instagram"}', 1),
('growth_social', 'SET Sales Consulting & Academy', '2-3x ROI Guaranteed', 'Sales training, process optimization, and consulting that delivers 2-3x return on investment.', 'image', '{"division": "SET Sales Consulting & Academy", "founded": "2020", "roi": "2-3x"}', 2);

-- CONTACT
INSERT INTO content_items (zone_id, title, description, media_type, metadata, sort_order) VALUES
('telephone_booth', 'Get In Touch', 'For collaborations, bookings, and inquiries. Canadian producer, actor, entrepreneur, and contemporary artist based in Toronto and Miami.', 'image', '{"email": "chris@marketingbyset.com", "instagram": "@thechrismarchese", "followers": "340K+", "linkedin": "Chris Marchese", "location": "Toronto / Miami"}', 1);

-- CHECKOUT
INSERT INTO content_items (zone_id, title, description, media_type, metadata, sort_order) VALUES
('money_pile', 'Your Cart', 'Review your selections and proceed to checkout.', 'image', '{"note": "Secure checkout powered by Stripe"}', 1);

-- TESTIMONIALS
INSERT INTO testimonials (client_name, client_title, client_company, quote, rating, is_featured, sort_order) VALUES
('Mahmoud Elminawi', 'CEO', NULL, 'SET Marketing transformed our digital presence and drove measurable results from day one. Chris and his team understand the intersection of brand and performance in a way that few agencies do.', 5, TRUE, 1),
('Sean Huley', 'Founder', NULL, 'Working with SET Marketing was a game-changer for our business. The fractional CMO model gave us executive-level marketing leadership at a fraction of the cost.', 5, TRUE, 2),
('George Pintilie', 'Managing Director', NULL, 'Chris Marchese and the SET team brought a level of sophistication and creativity to our brand that we hadn''t seen from other agencies. Their understanding of luxury positioning and performance marketing is unmatched.', 5, TRUE, 3);
