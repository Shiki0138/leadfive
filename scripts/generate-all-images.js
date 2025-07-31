#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const API_KEY = process.env.RUNWARE_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: RUNWARE_API_KEY not found in .env file');
  process.exit(1);
}

// Create directories if they don't exist
const outputDir = path.join(__dirname, '..', 'assets', 'images', 'icons');
const generatedDir = path.join(__dirname, '..', 'assets', 'images', 'generated');
[outputDir, generatedDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Image configurations - optimized for mobile and content
const images = [
  // Problem section icons - Clear, simple, mobile-friendly
  {
    name: 'problem-1',
    filename: 'problem-1.png',
    prompt: 'Minimalist icon design, downward trending graph with money symbols floating away, simple line art style, purple and pink gradient (#8b5cf6 to #ec4899), white background with subtle glow, mobile app icon style, flat design, professional business icon',
    negativePrompt: 'complex, detailed, realistic, photographic, 3D, shadows, textures',
    size: 512
  },
  {
    name: 'problem-2',
    filename: 'problem-2.png',
    prompt: 'Minimalist icon design, simple robot with question marks, confused expression, geometric shapes, blue gradient (#3b82f6 to #06b6d4), white background with subtle glow, mobile app icon style, flat design, clean lines',
    negativePrompt: 'complex, detailed, realistic, photographic, 3D, shadows, textures, scary',
    size: 512
  },
  {
    name: 'problem-3',
    filename: 'problem-3.png',
    prompt: 'Minimalist icon design, simplified data chart maze, tangled lines forming a puzzle, purple to blue gradient (#8b5cf6 to #3b82f6), white background with subtle glow, mobile app icon style, flat design, clean geometric',
    negativePrompt: 'complex, detailed, realistic, photographic, 3D, shadows, textures',
    size: 512
  },
  
  // 8 Instincts icons - Elegant, meaningful, mobile-optimized
  {
    name: 'instinct-1',
    filename: 'instinct-1.png',
    prompt: 'Minimalist shield icon, protective symbol, glowing purple gradient (#8b5cf6), simple geometric design, rounded corners, soft glow effect, mobile app icon style, flat design with depth, safety and security concept',
    negativePrompt: 'medieval, warrior, violent, complex, realistic',
    size: 512
  },
  {
    name: 'instinct-2',
    filename: 'instinct-2.png',
    prompt: 'Minimalist satisfaction icon, abstract bowl or cup shape with rising steam, warm orange to pink gradient (#ec4899), rounded design, mobile app icon style, flat design, abundance and fulfillment concept',
    negativePrompt: 'food, eating, realistic, complex, detailed',
    size: 512
  },
  {
    name: 'instinct-3',
    filename: 'instinct-3.png',
    prompt: 'Minimalist heart with sparkles icon, elegant curves, pink gradient (#ec4899), glowing effect, mobile app icon style, flat design, attraction and beauty concept, soft rounded shapes',
    negativePrompt: 'sexual, explicit, realistic, complex, anatomical',
    size: 512
  },
  {
    name: 'instinct-4',
    filename: 'instinct-4.png',
    prompt: 'Minimalist warning triangle with exclamation, alert symbol, orange to red gradient, rounded corners, soft glow, mobile app icon style, flat design, caution and awareness concept',
    negativePrompt: 'scary, violent, complex, realistic, detailed',
    size: 512
  },
  {
    name: 'instinct-5',
    filename: 'instinct-5.png',
    prompt: 'Minimalist cloud or cushion icon, soft flowing shapes, light blue gradient (#06b6d4), peaceful design, mobile app icon style, flat design, comfort and ease concept, rounded edges',
    negativePrompt: 'lazy, sleeping, complex, realistic, detailed',
    size: 512
  },
  {
    name: 'instinct-6',
    filename: 'instinct-6.png',
    prompt: 'Minimalist crown icon, simple geometric crown shape, golden purple gradient (#8b5cf6), glowing effect, mobile app icon style, flat design with prestige, leadership and excellence concept',
    negativePrompt: 'complex, ornate, realistic, medieval, detailed',
    size: 512
  },
  {
    name: 'instinct-7',
    filename: 'instinct-7.png',
    prompt: 'Minimalist connected circles icon, network of 3-4 dots with connecting lines, blue gradient (#3b82f6), mobile app icon style, flat design, community and belonging concept, clean geometry',
    negativePrompt: 'crowds, faces, complex, realistic, detailed',
    size: 512
  },
  {
    name: 'instinct-8',
    filename: 'instinct-8.png',
    prompt: 'Minimalist star or thumbs up icon, achievement symbol, purple to pink gradient (#8b5cf6 to #ec4899), glowing effect, mobile app icon style, flat design, recognition and approval concept',
    negativePrompt: 'complex, realistic, detailed, human hands',
    size: 512
  }
];

// Function to generate a single image
async function generateImage(config) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify([{
      taskType: "imageInference",
      taskUUID: uuidv4(),
      positivePrompt: config.prompt,
      negativePrompt: config.negativePrompt,
      width: config.size,
      height: config.size,
      model: "runware:100@1",
      numberResults: 1,
      outputFormat: "PNG",
      outputType: "base64Data"
    }]);

    const options = {
      hostname: 'api.runware.ai',
      port: 443,
      path: '/v1/images',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode !== 200) {
            console.error(`❌ API Error for ${config.name}:`, response);
            reject(new Error(`API Error: ${res.statusCode}`));
            return;
          }

          if (response.data && response.data[0] && response.data[0].imageBase64Data) {
            const imageBuffer = Buffer.from(response.data[0].imageBase64Data, 'base64');
            const outputPath = path.join(outputDir, config.filename);
            const generatedPath = path.join(generatedDir, config.filename);
            
            fs.writeFileSync(outputPath, imageBuffer);
            fs.writeFileSync(generatedPath, imageBuffer);
            
            console.log(`✅ ${config.name}: Generated successfully`);
            resolve({ name: config.name, path: outputPath });
          } else {
            reject(new Error(`Unexpected response format for ${config.name}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Function to process images with delay to avoid rate limiting
async function processImagesWithDelay(images, delay = 2000) {
  const results = [];
  
  for (let i = 0; i < images.length; i++) {
    const config = images[i];
    console.log(`\n🎨 Generating ${config.name} (${i + 1}/${images.length})...`);
    
    try {
      const result = await generateImage(config);
      results.push(result);
      
      // Add delay between requests except for the last one
      if (i < images.length - 1) {
        console.log(`⏳ Waiting ${delay/1000}s before next request...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${config.name}:`, error.message);
      results.push({ name: config.name, error: error.message });
    }
  }
  
  return results;
}

// Main execution
async function main() {
  console.log('🚀 Starting batch image generation...');
  console.log(`📊 Total images to generate: ${images.length}`);
  console.log('💡 Images are optimized for mobile viewing and fast loading\n');
  
  const startTime = Date.now();
  
  try {
    const results = await processImagesWithDelay(images);
    
    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Generation Summary:');
    console.log(`✅ Successful: ${successful}/${images.length}`);
    if (failed > 0) {
      console.log(`❌ Failed: ${failed}/${images.length}`);
    }
    console.log(`⏱️  Total time: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    console.log('='.repeat(50));
    
    if (successful === images.length) {
      console.log('\n🎉 All images generated successfully!');
      console.log('📁 Images saved to: /assets/images/icons/');
      console.log('\n🚀 Next steps:');
      console.log('1. Images will automatically replace emoji placeholders');
      console.log('2. Commit and push changes to see them on the live site');
      console.log('3. The images are optimized for both desktop and mobile viewing');
    }
    
  } catch (error) {
    console.error('\n❌ Batch processing error:', error);
  }
}

// Run the script
main().catch(console.error);