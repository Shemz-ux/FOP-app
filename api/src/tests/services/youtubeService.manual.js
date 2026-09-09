/**
 * Manual Test Script for YouTube Service
 * 
 * This script makes actual calls to the YouTube API to verify integration works.
 * Run this manually to test with your actual API key.
 * 
 * Usage:
 *   node src/tests/services/youtubeService.manual.js
 * 
 * Requirements:
 *   - YOUTUBE_API_KEY must be set in .env
 *   - Internet connection required
 */

import dotenv from 'dotenv';
import {
  extractYouTubeId,
  parseISO8601DurationToSeconds,
  fetchVideoMetadata,
  YouTubeAPIError
} from '../../services/youtubeService.js';

// Load environment variables
dotenv.config();

// Test URLs
const testCases = [
  {
    name: 'Standard YouTube video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    expectedId: 'dQw4w9WgXcQ'
  },
  {
    name: 'Short URL',
    url: 'https://youtu.be/jNQXAC9IVRw',
    expectedId: 'jNQXAC9IVRw'
  },
  {
    name: 'Invalid URL',
    url: 'https://example.com/video',
    expectedId: null
  }
];

console.log('🧪 YouTube Service Manual Test\n');
console.log('=' .repeat(60));

// Test 1: URL Parsing
console.log('\n📝 Test 1: URL Parsing');
console.log('-'.repeat(60));

testCases.forEach(({ name, url, expectedId }) => {
  const extractedId = extractYouTubeId(url);
  const passed = extractedId === expectedId;
  const icon = passed ? '✅' : '❌';
  
  console.log(`${icon} ${name}`);
  console.log(`   URL: ${url}`);
  console.log(`   Expected: ${expectedId}`);
  console.log(`   Got: ${extractedId}`);
  console.log();
});

// Test 2: Duration Parsing
console.log('⏱️  Test 2: Duration Parsing');
console.log('-'.repeat(60));

const durationTests = [
  { iso: 'PT3M30S', expected: 210, description: '3 minutes 30 seconds' },
  { iso: 'PT1H23M45S', expected: 5025, description: '1 hour 23 minutes 45 seconds' },
  { iso: 'PT45S', expected: 45, description: '45 seconds' }
];

durationTests.forEach(({ iso, expected, description }) => {
  const seconds = parseISO8601DurationToSeconds(iso);
  const passed = seconds === expected;
  const icon = passed ? '✅' : '❌';
  
  console.log(`${icon} ${description}`);
  console.log(`   ISO: ${iso}`);
  console.log(`   Expected: ${expected}s`);
  console.log(`   Got: ${seconds}s`);
  console.log();
});

// Test 3: API Integration (requires valid API key)
console.log('🌐 Test 3: YouTube API Integration');
console.log('-'.repeat(60));

if (!process.env.YOUTUBE_API_KEY) {
  console.log('⚠️  YOUTUBE_API_KEY not found in environment');
  console.log('   Set YOUTUBE_API_KEY in .env to test API integration');
  console.log();
} else {
  console.log('🔑 API Key found, testing API calls...\n');

  // Test with a known public video
  const testVideoId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up
  
  console.log(`Testing with video ID: ${testVideoId}`);
  console.log('Making API call...\n');

  fetchVideoMetadata(testVideoId)
    .then(metadata => {
      if (metadata) {
        console.log('✅ API call successful!');
        console.log('\nMetadata received:');
        console.log(`   Thumbnail URL: ${metadata.thumbnailUrl}`);
        console.log(`   Duration: ${metadata.durationSeconds} seconds`);
        console.log(`   Published: ${metadata.publishedAt}`);
        console.log();
        
        // Validate data
        const validations = [
          { check: metadata.thumbnailUrl && metadata.thumbnailUrl.startsWith('http'), name: 'Thumbnail URL is valid' },
          { check: metadata.durationSeconds > 0, name: 'Duration is positive' },
          { check: metadata.publishedAt && metadata.publishedAt.length > 0, name: 'Published date exists' }
        ];
        
        console.log('Validations:');
        validations.forEach(({ check, name }) => {
          console.log(`   ${check ? '✅' : '❌'} ${name}`);
        });
        console.log();
      } else {
        console.log('❌ Video not found (returned null)');
        console.log('   This could mean the video is private or deleted');
        console.log();
      }
    })
    .catch(error => {
      if (error instanceof YouTubeAPIError) {
        console.log('❌ YouTube API Error:');
        console.log(`   Message: ${error.message}`);
        console.log(`   Status Code: ${error.statusCode}`);
        if (error.originalError) {
          console.log(`   Original Error: ${error.originalError.message}`);
        }
        console.log();
        
        // Provide helpful hints
        if (error.statusCode === 403) {
          console.log('💡 Hint: Check your API key restrictions in Google Cloud Console');
        } else if (error.statusCode === 429) {
          console.log('💡 Hint: You\'ve hit the rate limit. Wait a bit and try again.');
        }
        console.log();
      } else {
        console.log('❌ Unexpected error:');
        console.log(error);
        console.log();
      }
    });
}

console.log('=' .repeat(60));
console.log('\n✨ Manual test complete!\n');
