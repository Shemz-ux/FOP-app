/**
 * Tests for YouTube Service
 * 
 * These tests verify URL parsing, duration conversion, and API integration.
 * API tests use mocks to avoid actual YouTube API calls during testing.
 */

import { jest } from '@jest/globals';
import {
  extractYouTubeId,
  parseISO8601DurationToSeconds,
  fetchVideoMetadata,
  YouTubeAPIError
} from '../../services/youtubeService.js';

describe('YouTube Service', () => {
  
  describe('extractYouTubeId', () => {
    
    test('extracts ID from standard watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    test('extracts ID from short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    test('extracts ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    test('extracts ID from shorts URL', () => {
      const url = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    test('extracts ID from /v/ URL', () => {
      const url = 'https://www.youtube.com/v/dQw4w9WgXcQ';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    test('extracts ID from URL with extra parameters', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&list=PLxyz';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    test('extracts ID from URL with timestamp', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ?t=123';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    test('handles URL with whitespace', () => {
      const url = '  https://www.youtube.com/watch?v=dQw4w9WgXcQ  ';
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
    });

    test('returns null for invalid URL', () => {
      const url = 'https://example.com/video';
      expect(extractYouTubeId(url)).toBeNull();
    });

    test('returns null for malformed YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=invalid';
      expect(extractYouTubeId(url)).toBeNull();
    });

    test('returns null for empty string', () => {
      expect(extractYouTubeId('')).toBeNull();
    });

    test('returns null for null input', () => {
      expect(extractYouTubeId(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
      expect(extractYouTubeId(undefined)).toBeNull();
    });

    test('returns null for non-string input', () => {
      expect(extractYouTubeId(123)).toBeNull();
    });

    test('validates ID is exactly 11 characters', () => {
      const url = 'https://www.youtube.com/watch?v=short';
      expect(extractYouTubeId(url)).toBeNull();
    });

    test('validates ID contains only valid characters', () => {
      const url = 'https://www.youtube.com/watch?v=invalid@#$%';
      expect(extractYouTubeId(url)).toBeNull();
    });

    test('handles various valid video IDs', () => {
      const testCases = [
        'dQw4w9WgXcQ',
        'jNQXAC9IVRw',
        '9bZkp7q19f0',
        '_-agl0pOQfs',
        'K5le9sYdYkM'
      ];

      testCases.forEach(videoId => {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        expect(extractYouTubeId(url)).toBe(videoId);
      });
    });
  });

  describe('parseISO8601DurationToSeconds', () => {
    
    test('parses duration with hours, minutes, and seconds', () => {
      expect(parseISO8601DurationToSeconds('PT1H2M10S')).toBe(3730);
    });

    test('parses duration with only minutes and seconds', () => {
      expect(parseISO8601DurationToSeconds('PT30M45S')).toBe(1845);
    });

    test('parses duration with only seconds', () => {
      expect(parseISO8601DurationToSeconds('PT45S')).toBe(45);
    });

    test('parses duration with only minutes', () => {
      expect(parseISO8601DurationToSeconds('PT15M')).toBe(900);
    });

    test('parses duration with only hours', () => {
      expect(parseISO8601DurationToSeconds('PT2H')).toBe(7200);
    });

    test('parses duration with hours and minutes', () => {
      expect(parseISO8601DurationToSeconds('PT1H30M')).toBe(5400);
    });

    test('parses duration with hours and seconds', () => {
      expect(parseISO8601DurationToSeconds('PT1H30S')).toBe(3630);
    });

    test('handles zero duration', () => {
      expect(parseISO8601DurationToSeconds('PT0S')).toBe(0);
    });

    test('handles multi-digit values', () => {
      expect(parseISO8601DurationToSeconds('PT12H34M56S')).toBe(45296);
    });

    test('returns 0 for invalid format', () => {
      expect(parseISO8601DurationToSeconds('invalid')).toBe(0);
    });

    test('returns 0 for empty string', () => {
      expect(parseISO8601DurationToSeconds('')).toBe(0);
    });

    test('returns 0 for null', () => {
      expect(parseISO8601DurationToSeconds(null)).toBe(0);
    });

    test('returns 0 for undefined', () => {
      expect(parseISO8601DurationToSeconds(undefined)).toBe(0);
    });

    test('handles various real-world durations', () => {
      const testCases = [
        { iso: 'PT3M30S', seconds: 210 },      // Short video
        { iso: 'PT10M15S', seconds: 615 },     // Medium video
        { iso: 'PT1H23M45S', seconds: 5025 },  // Long video
        { iso: 'PT2H30M', seconds: 9000 },     // Movie length
        { iso: 'PT15S', seconds: 15 }          // Very short
      ];

      testCases.forEach(({ iso, seconds }) => {
        expect(parseISO8601DurationToSeconds(iso)).toBe(seconds);
      });
    });
  });

  describe('fetchVideoMetadata', () => {
    
    // Store original env vars
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset modules and env before each test
      jest.resetModules();
      process.env = { ...originalEnv };
      process.env.YOUTUBE_API_KEY = 'test-api-key';
      process.env.YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
    });

    afterEach(() => {
      // Restore original env
      process.env = originalEnv;
    });

    test('throws error when API key is not configured', async () => {
      delete process.env.YOUTUBE_API_KEY;
      
      await expect(fetchVideoMetadata('dQw4w9WgXcQ'))
        .rejects
        .toThrow(YouTubeAPIError);
      
      await expect(fetchVideoMetadata('dQw4w9WgXcQ'))
        .rejects
        .toThrow('YouTube API key not configured');
    });

    test('throws error for invalid video ID format', async () => {
      await expect(fetchVideoMetadata('short'))
        .rejects
        .toThrow(YouTubeAPIError);
      
      await expect(fetchVideoMetadata(''))
        .rejects
        .toThrow('Invalid video ID format');
    });

    test('throws error for null video ID', async () => {
      await expect(fetchVideoMetadata(null))
        .rejects
        .toThrow(YouTubeAPIError);
    });

    test('throws error for undefined video ID', async () => {
      await expect(fetchVideoMetadata(undefined))
        .rejects
        .toThrow(YouTubeAPIError);
    });

    // Note: The following tests would require mocking the https module
    // For now, we'll document what should be tested with proper mocks:
    
    // TODO: Add tests with https mocks for:
    // - Successful API response
    // - Video not found (returns null)
    // - 403 Forbidden response
    // - 429 Rate limit response
    // - Network error
    // - Invalid JSON response
    // - Missing thumbnail data
    // - Missing duration data
  });

  describe('YouTubeAPIError', () => {
    
    test('creates error with message', () => {
      const error = new YouTubeAPIError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('YouTubeAPIError');
      expect(error.statusCode).toBe(500);
      expect(error.originalError).toBeNull();
    });

    test('creates error with custom status code', () => {
      const error = new YouTubeAPIError('Test error', 403);
      expect(error.statusCode).toBe(403);
    });

    test('creates error with original error', () => {
      const originalError = new Error('Original');
      const error = new YouTubeAPIError('Test error', 500, originalError);
      expect(error.originalError).toBe(originalError);
    });

    test('is instance of Error', () => {
      const error = new YouTubeAPIError('Test error');
      expect(error instanceof Error).toBe(true);
    });

    test('is instance of YouTubeAPIError', () => {
      const error = new YouTubeAPIError('Test error');
      expect(error instanceof YouTubeAPIError).toBe(true);
    });
  });
});
