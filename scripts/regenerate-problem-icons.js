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

const outputDir = path.join(__dirname, '..', 'assets', 'images', 'icons');

// New problem icons with dark background and simple line art style
const problemImages = [
  {
    name: 'problem-1',
    filename: 'problem-1.png',
    prompt: 'Simple line art icon, downward trending graph with money symbols floating away, dark navy blue background (#1a1b3e), minimalist white line drawing, clean vector style, financial loss concept, professional business icon, geometric shapes, no text',
    negativePrompt: 'complex, detailed, realistic, photographic, 3D, shadows, textures, colorful, bright, white background',
    size: 512
  },
  {
    name: 'problem-2',
    filename: 'problem-2.png',
    prompt: 'Simple line art icon, confused robot with question mark, dark navy blue background (#1a1b3e), minimalist white line drawing, clean vector style, AI confusion concept, geometric robot design, professional business icon, no text',
    negativePrompt: 'complex, detailed, realistic, photographic, 3D, shadows, textures, colorful, bright, white background, scary',
    size: 512
  },
  {
    name: 'problem-3',
    filename: 'problem-3.png',
    prompt: 'Simple line art icon, maze-like chart with tangled data lines, dark navy blue background (#1a1b3e), minimalist white line drawing, clean vector style, data confusion concept, geometric maze design, professional business icon, no text',
    negativePrompt: 'complex, detailed, realistic, photographic, 3D, shadows, textures, colorful, bright, white background',
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
            
            fs.writeFileSync(outputPath, imageBuffer);
            
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

// Main execution
async function main() {
  console.log('🔄 Regenerating problem section icons...');
  console.log('🎨 Style: Dark background with simple white line art\n');
  
  for (let i = 0; i < problemImages.length; i++) {
    const config = problemImages[i];
    console.log(`🎨 Generating ${config.name} (${i + 1}/${problemImages.length})...`);
    
    try {
      await generateImage(config);
      
      // Add delay between requests
      if (i < problemImages.length - 1) {
        console.log('⏳ Waiting 2s before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${config.name}:`, error.message);
    }
  }
  
  console.log('\n✅ Problem icons regenerated successfully!');
  console.log('🚀 The new icons have dark backgrounds and simple white line art');
}

main().catch(console.error);