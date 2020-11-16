/**
 * Tipsy.Games entry point
 */
import { init } from './domain/init';

// Initialize once the page is fully loaded
window.addEventListener('load', init);