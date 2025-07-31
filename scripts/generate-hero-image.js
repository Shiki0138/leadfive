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

// Create directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'assets', 'images', 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Hero background prompt
const imageConfig = {
  positivePrompt: "Abstract neural network visualization, glowing synaptic connections, purple and blue gradient colors (#8b5cf6 to #3b82f6), futuristic AI brain concept, elegant flowing lines, deep black background, cyberpunk aesthetic, data streams, digital particles, professional business technology, high-tech marketing concept, minimalist design, premium quality, 8k resolution",
  negativePrompt: "cartoon, anime, childish, low quality, blurry, pixelated, text, watermark, logo, human faces, realistic brain, medical imagery, gore, messy, cluttered",
  width: 1024,
  height: 1024,
  model: "runware:100@1",
  numberResults: 1,
  outputFormat: "PNG",
  outputType: "base64Data"
};

console.log('🎨 Generating hero background image...\n');
console.log('Prompt:', imageConfig.positivePrompt);
console.log('Size:', `${imageConfig.width}x${imageConfig.height}`);
console.log('');

const postData = JSON.stringify([{
  taskType: "imageInference",
  taskUUID: uuidv4(),
  ...imageConfig
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
        console.error('❌ API Error:', response);
        process.exit(1);
      }

      if (response.data && response.data[0] && response.data[0].imageBase64Data) {
        // Save the image
        const imageBuffer = Buffer.from(response.data[0].imageBase64Data, 'base64');
        const outputPath = path.join(outputDir, 'hero-neural-network.png');
        
        fs.writeFileSync(outputPath, imageBuffer);
        console.log('✅ Image generated successfully!');
        console.log('📁 Saved to:', outputPath);
        console.log('');
        console.log('🎯 Next steps:');
        console.log('1. Check the generated image');
        console.log('2. If satisfied, we can proceed with other images');
        console.log('3. The image will be automatically used in the hero section');
        
        // Also save a copy to the correct location for the site
        const heroImagePath = path.join(__dirname, '..', 'assets', 'images', 'hero-background.png');
        fs.writeFileSync(heroImagePath, imageBuffer);
        console.log('\n📋 Also copied to:', heroImagePath);
        
      } else {
        console.error('❌ Unexpected response format:', response);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(postData);
req.end();