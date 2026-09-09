import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * YouTube IFrame Player Hook
 * 
 * Manages YouTube IFrame API loading and player instance lifecycle.
 * This hook handles:
 * - Loading the YouTube IFrame API script (once globally)
 * - Creating and destroying player instances
 * - Player state management
 * - Event handling
 * 
 * IMPORTANT: This uses YouTube's public IFrame Player API - NO API KEY REQUIRED
 * The IFrame Player API is free and public, separate from the YouTube Data API
 */

// Global flag to track if YouTube API script is loaded
let isYouTubeAPILoaded = false;
let isYouTubeAPILoading = false;
const loadCallbacks = [];

/**
 * Load YouTube IFrame API script
 * Only loads once globally, subsequent calls wait for the same load
 */
const loadYouTubeAPI = () => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.YT && window.YT.Player) {
      isYouTubeAPILoaded = true;
      resolve();
      return;
    }

    // If currently loading, add to callbacks
    if (isYouTubeAPILoading) {
      loadCallbacks.push(resolve);
      return;
    }

    // Start loading
    isYouTubeAPILoading = true;
    loadCallbacks.push(resolve);

    // Check if script already exists
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      // Script exists but not loaded yet, wait for callback
      return;
    }

    // Create and load script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.onerror = () => {
      isYouTubeAPILoading = false;
      reject(new Error('Failed to load YouTube IFrame API'));
    };

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // YouTube calls this function when API is ready
    window.onYouTubeIframeAPIReady = () => {
      isYouTubeAPILoaded = true;
      isYouTubeAPILoading = false;
      
      // Resolve all waiting callbacks
      loadCallbacks.forEach(callback => callback());
      loadCallbacks.length = 0;
    };
  });
};

/**
 * YouTube Player State Constants
 * These match YouTube's player state codes
 */
export const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};

/**
 * Custom hook for YouTube IFrame Player
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.videoId - YouTube video ID (required)
 * @param {Object} options.playerVars - YouTube player variables
 * @param {Function} options.onReady - Callback when player is ready
 * @param {Function} options.onStateChange - Callback when player state changes
 * @param {Function} options.onError - Callback when player encounters an error
 * @param {boolean} options.autoLoad - Auto-load player on mount (default: false)
 * 
 * @returns {Object} Player controls and state
 */
export const useYouTubePlayer = (options = {}) => {
  const {
    videoId,
    playerVars = {},
    onReady,
    onStateChange,
    onError,
    autoLoad = false
  } = options;

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isAPIReady, setIsAPIReady] = useState(isYouTubeAPILoaded);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerState, setPlayerState] = useState(PlayerState.UNSTARTED);
  const [error, setError] = useState(null);

  // Load YouTube API on mount
  useEffect(() => {
    loadYouTubeAPI()
      .then(() => {
        setIsAPIReady(true);
      })
      .catch((err) => {
        setError(err);
        console.error('Failed to load YouTube API:', err);
      });
  }, []);

  /**
   * Create player instance
   */
  const createPlayer = useCallback(() => {
    if (!isAPIReady || !containerRef.current || !videoId) {
      return;
    }

    // Destroy existing player if any
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    try {
      // Default player vars for embedded feel
      const defaultPlayerVars = {
        modestbranding: 1,  // Reduce YouTube branding
        rel: 0,             // Don't show related videos from other channels
        iv_load_policy: 3,  // Hide video annotations
        ...playerVars
      };

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: defaultPlayerVars,
        events: {
          onReady: (event) => {
            setIsPlayerReady(true);
            setError(null);
            onReady?.(event);
          },
          onStateChange: (event) => {
            setPlayerState(event.data);
            onStateChange?.(event);
          },
          onError: (event) => {
            const errorMessage = getErrorMessage(event.data);
            setError(new Error(errorMessage));
            onError?.(event);
          }
        }
      });
    } catch (err) {
      setError(err);
      console.error('Failed to create YouTube player:', err);
    }
  }, [isAPIReady, videoId, playerVars, onReady, onStateChange, onError]);

  /**
   * Destroy player instance
   */
  const destroyPlayer = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        console.error('Error destroying player:', err);
      }
      playerRef.current = null;
      setIsPlayerReady(false);
      setPlayerState(PlayerState.UNSTARTED);
    }
  }, []);

  /**
   * Auto-load player if enabled
   */
  useEffect(() => {
    if (autoLoad && isAPIReady && videoId) {
      createPlayer();
    }

    return () => {
      destroyPlayer();
    };
  }, [autoLoad, isAPIReady, videoId, createPlayer, destroyPlayer]);

  /**
   * Player control methods
   */
  const play = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.playVideo();
    }
  }, [isPlayerReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.pauseVideo();
    }
  }, [isPlayerReady]);

  const stop = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.stopVideo();
    }
  }, [isPlayerReady]);

  const seekTo = useCallback((seconds, allowSeekAhead = true) => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.seekTo(seconds, allowSeekAhead);
    }
  }, [isPlayerReady]);

  const setVolume = useCallback((volume) => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.setVolume(volume);
    }
  }, [isPlayerReady]);

  const mute = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.mute();
    }
  }, [isPlayerReady]);

  const unMute = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.unMute();
    }
  }, [isPlayerReady]);

  const getCurrentTime = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      return playerRef.current.getCurrentTime();
    }
    return 0;
  }, [isPlayerReady]);

  const getDuration = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      return playerRef.current.getDuration();
    }
    return 0;
  }, [isPlayerReady]);

  const getVolume = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      return playerRef.current.getVolume();
    }
    return 0;
  }, [isPlayerReady]);

  const isMuted = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      return playerRef.current.isMuted();
    }
    return false;
  }, [isPlayerReady]);

  return {
    // Refs
    containerRef,
    playerRef,
    
    // State
    isAPIReady,
    isPlayerReady,
    playerState,
    error,
    
    // Computed state
    isPlaying: playerState === PlayerState.PLAYING,
    isPaused: playerState === PlayerState.PAUSED,
    isBuffering: playerState === PlayerState.BUFFERING,
    hasEnded: playerState === PlayerState.ENDED,
    
    // Methods
    createPlayer,
    destroyPlayer,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    mute,
    unMute,
    getCurrentTime,
    getDuration,
    getVolume,
    isMuted
  };
};

/**
 * Get human-readable error message from YouTube error code
 */
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 2:
      return 'Invalid video ID';
    case 5:
      return 'HTML5 player error';
    case 100:
      return 'Video not found or private';
    case 101:
    case 150:
      return 'Video cannot be embedded';
    default:
      return 'Unknown player error';
  }
};

export default useYouTubePlayer;
