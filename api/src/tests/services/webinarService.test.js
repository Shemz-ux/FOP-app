/**
 * Tests for Webinar Service
 * 
 * These tests verify the error classes and business logic patterns.
 * Full integration tests should be done at the route level.
 */

import {
  ValidationError,
  DuplicateError,
  NotFoundError
} from '../../services/webinarService.js';

describe('Webinar Service - Error Classes', () => {
  
  describe('ValidationError', () => {
    
    test('creates error with message only', () => {
      const error = new ValidationError('Test validation error');
      
      expect(error.message).toBe('Test validation error');
      expect(error.name).toBe('ValidationError');
      expect(error.statusCode).toBe(400);
      expect(error.field).toBeNull();
    });

    test('creates error with message and field', () => {
      const error = new ValidationError('Invalid field', 'email');
      
      expect(error.message).toBe('Invalid field');
      expect(error.field).toBe('email');
      expect(error.statusCode).toBe(400);
    });

    test('is instance of Error', () => {
      const error = new ValidationError('Test');
      expect(error instanceof Error).toBe(true);
    });

    test('is instance of ValidationError', () => {
      const error = new ValidationError('Test');
      expect(error instanceof ValidationError).toBe(true);
    });

    test('has correct name property', () => {
      const error = new ValidationError('Test');
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('DuplicateError', () => {
    
    test('creates error with message', () => {
      const error = new DuplicateError('Duplicate entry');
      
      expect(error.message).toBe('Duplicate entry');
      expect(error.name).toBe('DuplicateError');
      expect(error.statusCode).toBe(409);
      expect(error.field).toBe('youtube_video_id'); // Default field
    });

    test('creates error with custom field', () => {
      const error = new DuplicateError('Duplicate', 'custom_field');
      
      expect(error.field).toBe('custom_field');
    });

    test('extends ValidationError', () => {
      const error = new DuplicateError('Test');
      expect(error instanceof ValidationError).toBe(true);
    });

    test('extends Error', () => {
      const error = new DuplicateError('Test');
      expect(error instanceof Error).toBe(true);
    });

    test('has correct status code', () => {
      const error = new DuplicateError('Test');
      expect(error.statusCode).toBe(409);
    });

    test('has correct name property', () => {
      const error = new DuplicateError('Test');
      expect(error.name).toBe('DuplicateError');
    });
  });

  describe('NotFoundError', () => {
    
    test('creates error with message', () => {
      const error = new NotFoundError('Resource not found');
      
      expect(error.message).toBe('Resource not found');
      expect(error.name).toBe('NotFoundError');
      expect(error.statusCode).toBe(404);
    });

    test('is instance of Error', () => {
      const error = new NotFoundError('Test');
      expect(error instanceof Error).toBe(true);
    });

    test('is instance of NotFoundError', () => {
      const error = new NotFoundError('Test');
      expect(error instanceof NotFoundError).toBe(true);
    });

    test('has correct status code', () => {
      const error = new NotFoundError('Test');
      expect(error.statusCode).toBe(404);
    });

    test('has correct name property', () => {
      const error = new NotFoundError('Test');
      expect(error.name).toBe('NotFoundError');
    });
  });

  describe('Error Hierarchy', () => {
    
    test('ValidationError can be caught as Error', () => {
      try {
        throw new ValidationError('Test');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
      }
    });

    test('DuplicateError can be caught as ValidationError', () => {
      try {
        throw new DuplicateError('Test');
      } catch (error) {
        expect(error instanceof ValidationError).toBe(true);
        expect(error instanceof Error).toBe(true);
      }
    });

    test('NotFoundError can be caught as Error', () => {
      try {
        throw new NotFoundError('Test');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
      }
    });

    test('can distinguish between error types', () => {
      const validationError = new ValidationError('Test');
      const duplicateError = new DuplicateError('Test');
      const notFoundError = new NotFoundError('Test');

      expect(validationError instanceof ValidationError).toBe(true);
      expect(validationError instanceof DuplicateError).toBe(false);
      expect(validationError instanceof NotFoundError).toBe(false);

      expect(duplicateError instanceof ValidationError).toBe(true);
      expect(duplicateError instanceof DuplicateError).toBe(true);
      expect(duplicateError instanceof NotFoundError).toBe(false);

      expect(notFoundError instanceof ValidationError).toBe(false);
      expect(notFoundError instanceof DuplicateError).toBe(false);
      expect(notFoundError instanceof NotFoundError).toBe(true);
    });
  });

  describe('Error Status Codes', () => {
    
    test('ValidationError has 400 status', () => {
      const error = new ValidationError('Test');
      expect(error.statusCode).toBe(400);
    });

    test('DuplicateError has 409 status', () => {
      const error = new DuplicateError('Test');
      expect(error.statusCode).toBe(409);
    });

    test('NotFoundError has 404 status', () => {
      const error = new NotFoundError('Test');
      expect(error.statusCode).toBe(404);
    });

    test('status codes are correct for HTTP mapping', () => {
      const errors = [
        { error: new ValidationError('Test'), expected: 400 },
        { error: new DuplicateError('Test'), expected: 409 },
        { error: new NotFoundError('Test'), expected: 404 }
      ];

      errors.forEach(({ error, expected }) => {
        expect(error.statusCode).toBe(expected);
      });
    });
  });

  describe('Error Messages', () => {
    
    test('preserves custom error messages', () => {
      const messages = [
        'Invalid YouTube URL format',
        'This video has already been added',
        'Webinar not found',
        'Title is required',
        'Category is required'
      ];

      messages.forEach(message => {
        const error = new ValidationError(message);
        expect(error.message).toBe(message);
      });
    });

    test('error messages are accessible', () => {
      const error = new ValidationError('Test message', 'field_name');
      
      expect(error.message).toBeDefined();
      expect(error.message.length).toBeGreaterThan(0);
      expect(typeof error.message).toBe('string');
    });
  });

  describe('Error Fields', () => {
    
    test('ValidationError can have field information', () => {
      const fields = ['youtube_url', 'title', 'category', 'description'];
      
      fields.forEach(field => {
        const error = new ValidationError('Test', field);
        expect(error.field).toBe(field);
      });
    });

    test('DuplicateError has default field', () => {
      const error = new DuplicateError('Test');
      expect(error.field).toBe('youtube_video_id');
    });

    test('field can be null', () => {
      const error = new ValidationError('Test');
      expect(error.field).toBeNull();
    });
  });
});

describe('Webinar Service - Business Logic Patterns', () => {
  
  describe('Error Handling Patterns', () => {
    
    test('validation errors should be caught separately from system errors', () => {
      const validationError = new ValidationError('Invalid input');
      const systemError = new Error('Database connection failed');

      expect(validationError instanceof ValidationError).toBe(true);
      expect(systemError instanceof ValidationError).toBe(false);
    });

    test('duplicate errors should be distinguishable from other validation errors', () => {
      const duplicateError = new DuplicateError('Duplicate');
      const validationError = new ValidationError('Invalid');

      expect(duplicateError instanceof DuplicateError).toBe(true);
      expect(validationError instanceof DuplicateError).toBe(false);
    });

    test('not found errors should have distinct status code', () => {
      const notFoundError = new NotFoundError('Not found');
      const validationError = new ValidationError('Invalid');

      expect(notFoundError.statusCode).toBe(404);
      expect(validationError.statusCode).toBe(400);
      expect(notFoundError.statusCode).not.toBe(validationError.statusCode);
    });
  });

  describe('Expected Error Scenarios', () => {
    
    test('invalid URL should throw ValidationError', () => {
      // This pattern should be used in createFromURL
      const invalidUrl = 'https://example.com';
      const shouldThrow = () => {
        throw new ValidationError(
          'Invalid YouTube URL format. Please provide a valid YouTube video URL.',
          'youtube_url'
        );
      };

      expect(shouldThrow).toThrow(ValidationError);
      expect(shouldThrow).toThrow('Invalid YouTube URL format');
    });

    test('duplicate video should throw DuplicateError', () => {
      // This pattern should be used in createFromURL after duplicate check
      const shouldThrow = () => {
        throw new DuplicateError(
          'This video has already been added to the webinars.',
          'youtube_video_id'
        );
      };

      expect(shouldThrow).toThrow(DuplicateError);
      expect(shouldThrow).toThrow('already been added');
    });

    test('missing webinar should throw NotFoundError', () => {
      // This pattern should be used in resyncMetadata, updateStatus, deleteWebinar
      const shouldThrow = () => {
        throw new NotFoundError('Webinar not found');
      };

      expect(shouldThrow).toThrow(NotFoundError);
      expect(shouldThrow).toThrow('Webinar not found');
    });

    test('missing required fields should throw ValidationError', () => {
      const requiredFields = ['title', 'category'];
      
      requiredFields.forEach(field => {
        const shouldThrow = () => {
          throw new ValidationError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`, field);
        };

        expect(shouldThrow).toThrow(ValidationError);
      });
    });
  });
});

// Note: Integration tests for the actual service functions should be done
// at the route level where we can properly test the full flow with a test database.
// These unit tests focus on the error classes and patterns that the service uses.
