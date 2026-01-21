// main.js

import { EngineStart } from './engine/core/engineStart.js';
import { GameStart } from './game/core/gameStart.js';
import { TestStart } from './tests/testStart.js';

(async function() {
    // Initialize engine
    EngineStart.init();

    // Initialize game (async)
    await GameStart.init();

    // Run validation tests
    setTimeout(() => {
        TestStart.init();
    }, 100); // Small delay to ensure everything settled

    console.log('Initialization complete');
})();
