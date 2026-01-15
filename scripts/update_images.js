const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../public/products_100.json');
const IMAGES_FILE = path.join(__dirname, '../public/images_url_data.json');

// Helper to tokenize text into comparable words
function tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ') // remove special chars
        .split(/\s+/)
        .filter(w => w.length > 2 && !/^\d+$/.test(w)); // ignore short words and numbers
}

function run() {
    // 1. Parse Image URLs
    const imageFileContent = fs.readFileSync(IMAGES_FILE, 'utf-8');
    const imageUrls = [];
    const lines = imageFileContent.split('\n');

    // Regex to extract URL from the line format: "image_url": "..."
    const urlRegex = /"image_url":\s*"(https?:\/\/[^"]+)"/;

    lines.forEach(line => {
        const match = line.match(urlRegex);
        if (match) {
            const url = match[1];
            // Extract keywords from filename
            // Example: .../thumb/biscuits-drinks-packaged-foods-20240620.png
            const parts = url.split('/');
            const filename = parts[parts.length - 1];

            // Remove extension
            let name = filename.split('.')[0];

            // Remove date patterns like -20240620 or just numbers at the end
            name = name.replace(/-\d{8}$/, ''); // Standard date format seen in file
            name = name.replace(/\d+$/, '');   // Trailing numbers
            name = name.replace(/[0-9]/g, ''); // Remove other digits to be safe? Maybe better to keep some if relevant, but usually noise here.
            // Actually, let's just replace the specific date pattern and then tokenize.

            const keywords = tokenize(name);

            imageUrls.push({
                url: url,
                keywords: keywords,
                originalName: name
            });
        }
    });

    console.log(`Found ${imageUrls.length} image URLs.`);

    // 2. Parse Products
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    let matchCount = 0;

    // 3. Match
    products.forEach(product => {
        const productKeywords = new Set([
            ...tokenize(product.subcategory),
            ...tokenize(product.category),
            ...tokenize(product.name)
        ]);

        // Priority weight: Name > Subcategory > Category
        // Let's simplified: check overlap count.

        let bestMatch = null;
        let maxScore = 0;

        imageUrls.forEach(img => {
            let score = 0;
            img.keywords.forEach(kw => {
                if (productKeywords.has(kw)) {
                    score++;
                }
                // Bonus for exact subcategory match in kw
                if (product.subcategory && tokenize(product.subcategory).includes(kw)) {
                    score += 2;
                }
                // Bonus for exact name match part
                if (product.name && tokenize(product.name).includes(kw)) {
                    score += 1;
                }
            });

            if (score > maxScore) {
                maxScore = score;
                bestMatch = img;
            }
        });

        if (bestMatch && maxScore > 0) {
            product.image_url = bestMatch.url;
            matchCount++;
        } else {
            // Fallback: Default image if available in list?
            // The user file has a "no_image.png" URL: https://www.jiomart.com/images/category/default_thumb/no_image.png
            // We can map to that if score is 0, or just leave it blank.
            // User request: "wherever any product name is related keywords found"
            // I'll try to find the generic no_image one if needed, but let's stick to matches first.
            const defaultImg = imageUrls.find(i => i.url.includes('no_image'));
            if (defaultImg) {
                product.image_url = defaultImg.url;
            }
        }
    });

    console.log(`Updated ${matchCount} products with matching images.`);

    // 4. Save
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    console.log(`Saved updates to ${PRODUCTS_FILE}`);
}

run();
