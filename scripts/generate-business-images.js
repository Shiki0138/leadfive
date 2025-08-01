#!/usr/bin/env node

/**
 * Generate Professional Business Images
 * Replaces illustrations with realistic, high-quality business photos
 * Focus: AI × Psychology Marketing, Professional credibility
 */

const Runware = require('@runware/sdk-js');
const fs = require('fs');
const path = require('path');

// Enhanced configuration for professional business imagery
const runware = new Runware({
  apiKey: process.env.RUNWARE_API_KEY
});

const imageConfigurations = {
  // Service Background Images - Professional Business Settings
  services: [
    {
      name: 'ai-analysis-business',
      prompt: 'Professional business meeting with diverse team analyzing data on multiple monitors, AI dashboards showing analytics and charts, modern glass conference room, corporate office setting, natural lighting, photorealistic, high quality, professional photography style',
      width: 800,
      height: 600
    },
    {
      name: 'conversion-optimization',  
      prompt: 'Marketing professionals working on conversion rate optimization, looking at website analytics on large displays, clean modern office, laptop computers, data visualization, growth charts trending upward, professional team collaboration, photorealistic business photography',
      width: 800,
      height: 600
    },
    {
      name: 'automation-systems',
      prompt: 'High-tech automation control center with multiple screens showing system workflows, professional engineer monitoring automated processes, clean minimalist tech office, blue and purple accent lighting, futuristic but realistic business environment',
      width: 800,
      height: 600
    },
    {
      name: 'strategic-consulting',
      prompt: 'Executive consulting session with senior business leaders around elegant conference table, strategic planning documents, whiteboard with business frameworks, premium office environment, natural lighting, professional corporate photography',
      width: 800,
      height: 600
    }
  ],

  // Problem Icons - More Realistic Business Challenges
  problems: [
    {
      name: 'problem-1',
      prompt: 'Business professional looking concerned while reviewing declining sales charts on computer screen, realistic office setting, stress and worry expression, financial graphs showing downward trends, photorealistic portrait',
      width: 200,
      height: 200,
      style: 'portrait'
    },
    {
      name: 'problem-2', 
      prompt: 'Frustrated business person sitting at desk surrounded by multiple AI tools interfaces on screens, overwhelmed expression, too many software applications open, cluttered digital workspace, realistic business photography',
      width: 200,
      height: 200,
      style: 'portrait'
    },
    {
      name: 'problem-3',
      prompt: 'Professional analyst staring at complex data dashboard with confused expression, spreadsheets and analytics on multiple monitors, unable to interpret insights, realistic office environment, business photography',
      width: 200,
      height: 200,
      style: 'portrait'
    }
  ],

  // Instinct Icons - Psychological Concept Visualization
  instincts: [
    {
      name: 'instinct-1',
      prompt: 'Shield and security symbol in modern minimalist design, blue and purple gradient, professional business icon style, protection and safety concept, clean background',
      width: 120,
      height: 120,
      style: 'icon'
    },
    {
      name: 'instinct-2',
      prompt: 'Elegant satisfaction symbol with premium feel, golden accent, fulfillment and achievement representation, luxury business icon design, clean minimalist style',
      width: 120,
      height: 120,
      style: 'icon'
    },
    {
      name: 'instinct-3',
      prompt: 'Sophisticated attraction and appeal symbol, rose gold gradient, elegance and desirability concept, premium business icon, clean modern design',
      width: 120,
      height: 120,
      style: 'icon'
    },
    {
      name: 'instinct-4',
      prompt: 'Risk assessment and caution symbol, red and orange gradient, professional warning icon, business decision safety, clean minimalist design',
      width: 120,
      height: 120,
      style: 'icon'
    },
    {
      name: 'instinct-5',
      prompt: 'Comfort and ease symbol, soft green gradient, relaxation and simplicity concept, user-friendly business icon, clean modern style',
      width: 120,
      height: 120,
      style: 'icon'
    },
    {
      name: 'instinct-6',
      prompt: 'Excellence and premium quality symbol, purple and gold gradient, exclusivity and superiority concept, luxury business icon design',
      width: 120,
      height: 120,
      style: 'icon'
    },
    {
      name: 'instinct-7',
      prompt: 'Community and belonging symbol, interconnected network design, blue gradient, teamwork and collaboration concept, professional business icon',
      width: 120,
      height: 120,
      style: 'icon'
    },
    {
      name: 'instinct-8',
      prompt: 'Recognition and achievement symbol, trophy-like element, gold gradient, success and acknowledgment concept, premium business icon design',
      width: 120,
      height: 120,
      style: 'icon'
    }
  ],

  // Additional Business Credibility Images
  credibility: [
    {
      name: 'team-consultation',
      prompt: 'Professional business consultation meeting with Asian and Western executives in modern conference room, discussing AI and psychology marketing strategies, clean office environment, natural lighting, business photography',
      width: 600,
      height: 400
    },
    {
      name: 'success-metrics',
      prompt: 'Business dashboard showing impressive growth metrics and ROI improvements, professional hands pointing to success indicators, clean modern office setup, data visualization excellence',
      width: 600,
      height: 400  
    },
    {
      name: 'ai-psychology-fusion',
      prompt: 'Visual representation of AI technology merging with human psychology concepts, brain neural networks connecting to computer circuits, futuristic but professional, blue and purple color scheme',
      width: 600,
      height: 400
    }
  ]
};

async function generateImages() {
  try {
    console.log('🎨 Starting professional business image generation...');
    
    // Ensure output directories exist
    const outputDirs = [
      'assets/images/services',
      'assets/images/icons', 
      'assets/images/credibility',
      'assets/images/generated'
    ];
    
    outputDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Generate service background images
    console.log('📸 Generating service background images...');
    for (const config of imageConfigurations.services) {
      try {
        const result = await runware.requestImages({
          positivePrompt: config.prompt,
          model: 'runware:101@1',
          numberResults: 1,
          width: config.width,
          height: config.height,
          modelType: 'flux',
          usePromptExpansion: true,
          usePromptWeighting: true
        });

        if (result && result[0] && result[0].imageURL) {
          const response = await fetch(result[0].imageURL);
          const buffer = await response.arrayBuffer();
          const outputPath = path.join('assets/images/services', `${config.name}.jpg`);
          fs.writeFileSync(outputPath, Buffer.from(buffer));
          console.log(`✅ Generated: ${config.name}.jpg`);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${config.name}:`, error.message);
      }
    }

    // Generate problem visualization images  
    console.log('🔍 Generating problem visualization images...');
    for (const config of imageConfigurations.problems) {
      try {
        const result = await runware.requestImages({
          positivePrompt: config.prompt,
          model: 'runware:101@1', 
          numberResults: 1,
          width: config.width,
          height: config.height,
          modelType: 'flux',
          usePromptExpansion: true
        });

        if (result && result[0] && result[0].imageURL) {
          const response = await fetch(result[0].imageURL);
          const buffer = await response.arrayBuffer();
          const outputPath = path.join('assets/images/icons', `${config.name}.png`);
          fs.writeFileSync(outputPath, Buffer.from(buffer));
          console.log(`✅ Generated: ${config.name}.png`);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${config.name}:`, error.message);
      }
    }

    // Generate instinct icons with better design
    console.log('🧠 Generating psychological instinct icons...');
    for (const config of imageConfigurations.instincts) {
      try {
        const result = await runware.requestImages({
          positivePrompt: config.prompt,
          model: 'runware:101@1',
          numberResults: 1, 
          width: config.width,
          height: config.height,
          modelType: 'flux',
          usePromptExpansion: true
        });

        if (result && result[0] && result[0].imageURL) {
          const response = await fetch(result[0].imageURL);
          const buffer = await response.arrayBuffer();
          const outputPath = path.join('assets/images/icons', `${config.name}.png`);
          fs.writeFileSync(outputPath, Buffer.from(buffer));
          console.log(`✅ Generated: ${config.name}.png`);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${config.name}:`, error.message);
      }
    }

    // Generate credibility images
    console.log('🏆 Generating business credibility images...');
    for (const config of imageConfigurations.credibility) {
      try {
        const result = await runware.requestImages({
          positivePrompt: config.prompt,
          model: 'runware:101@1',
          numberResults: 1,
          width: config.width, 
          height: config.height,
          modelType: 'flux',
          usePromptExpansion: true
        });

        if (result && result[0] && result[0].imageURL) {
          const response = await fetch(result[0].imageURL);
          const buffer = await response.arrayBuffer();
          const outputPath = path.join('assets/images/credibility', `${config.name}.jpg`);
          fs.writeFileSync(outputPath, Buffer.from(buffer));
          console.log(`✅ Generated: ${config.name}.jpg`);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${config.name}:`, error.message);
      }
    }

    console.log('🎉 Professional business image generation completed!');
    console.log('📊 Summary:');
    console.log(`- Service backgrounds: ${imageConfigurations.services.length} images`);
    console.log(`- Problem visualizations: ${imageConfigurations.problems.length} images`);
    console.log(`- Instinct icons: ${imageConfigurations.instincts.length} images`);
    console.log(`- Credibility images: ${imageConfigurations.credibility.length} images`);
    
  } catch (error) {
    console.error('❌ Image generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateImages();
}

module.exports = { generateImages, imageConfigurations };