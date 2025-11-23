// testStart.js - Post-initialization validation
class TestStart {
    static init() {
        console.log('=== POST-INITIALIZATION TEST ===');
        
        let passCount = 0;
        let failCount = 0;
        
        // Test 1: Engine components exist
        console.log('\n--- Test 1: Engine Components ---');
        const engineTests = {
            'EngineStart': typeof EngineStart !== 'undefined',
            'EngineStart.canvas': !!EngineStart.canvas,
            'EngineStart.ctx': !!EngineStart.ctx,
            'engineEvent': typeof window.engineEvent !== 'undefined',
            'keyboardInput': typeof window.keyboardInput !== 'undefined',
            'mouseInput': typeof window.mouseInput !== 'undefined'
        };

        for (const [name, result] of Object.entries(engineTests)) {
            if (result) {
                console.log(`✓ ${name}`);
                passCount++;
            } else {
                console.error(`✗ ${name}`);
                failCount++;
            }
        }

        // Test 2: Managers exist
        console.log('\n--- Test 2: Managers ---');
        const managerTests = {
            'AssetManager': typeof window.assetManager !== 'undefined',
            'SpriteManager': typeof window.spriteManager !== 'undefined'
        };

        for (const [name, result] of Object.entries(managerTests)) {
            if (result) {
                console.log(`✓ ${name}`);
                passCount++;
            } else {
                console.error(`✗ ${name}`);
                failCount++;
            }
        }

        // Test 3: Assets loaded
        console.log('\n--- Test 3: Assets ---');
        const assets = window.assetManager?.getAssets() || [];
        console.log(`Assets loaded: ${assets.length}`);

        if (assets.length > 0) {
            console.log(`✓ Assets exist (${assets.length})`);
            passCount++;

            let validAssets = 0;
            assets.forEach(asset => {
                const valid = asset.position &&
                             asset.outerColor &&
                             asset.innerColor &&
                             asset.radius;
                if (valid) {
                    validAssets++;
                } else {
                    console.error(`✗ Asset ${asset.id} missing properties:`, {
                        hasPosition: !!asset.position,
                        hasOuterColor: !!asset.outerColor,
                        hasInnerColor: !!asset.innerColor,
                        hasRadius: !!asset.radius
                    });
                    failCount++;
                }
            });

            if (validAssets === assets.length) {
                console.log(`✓ All ${validAssets} assets valid`);
                passCount++;
            } else {
                console.error(`✗ Only ${validAssets}/${assets.length} assets valid`);
                failCount++;
            }
        } else {
            console.error('✗ No assets loaded');
            failCount++;
        }

        // Test 4: Sprites created
        console.log('\n--- Test 4: Sprites ---');
        const sprites = window.spriteManager?.getSprites() || [];
        console.log(`Sprites created: ${sprites.length}`);

        if (sprites.length > 0) {
            console.log(`✓ Sprites exist (${sprites.length})`);
            passCount++;

            let validSprites = 0;
            sprites.forEach(sprite => {
                const valid = sprite.position &&
                             sprite.innerColor &&
                             sprite.outerColor &&
                             sprite.radius &&
                             sprite.asset &&
                             typeof sprite.drawBody === 'function';

                if (valid) {
                    validSprites++;
                } else {
                    console.error(`✗ Sprite ${sprite.id} missing properties:`, {
                        hasPosition: !!sprite.position,
                        hasInnerColor: !!sprite.innerColor,
                        hasOuterColor: !!sprite.outerColor,
                        hasRadius: !!sprite.radius,
                        hasAsset: !!sprite.asset,
                        hasDrawBody: typeof sprite.drawBody === 'function'
                    });
                    failCount++;
                }
            });

            if (validSprites === sprites.length) {
                console.log(`✓ All ${validSprites} sprites valid`);
                passCount++;
            } else {
                console.error(`✗ Only ${validSprites}/${sprites.length} sprites valid`);
                failCount++;
            }
        } else {
            console.error('✗ No sprites created');
            failCount++;
        }

        // Test 5: Sprite-Asset linking
        console.log('\n--- Test 5: Asset-Sprite Links ---');
        if (assets.length > 0 && sprites.length > 0) {
            let linkedCount = 0;
            assets.forEach(asset => {
                const sprite = window.spriteManager.getSprite(asset.id);
                if (sprite && sprite.asset === asset) {
                    linkedCount++;
                } else {
                    console.error(`✗ Asset ${asset.id} not properly linked to sprite`);
                    failCount++;
                }
            });

            if (linkedCount === assets.length) {
                console.log(`✓ All ${linkedCount} sprites linked to assets`);
                passCount++;
            } else {
                console.error(`✗ Only ${linkedCount}/${assets.length} sprites linked`);
                failCount++;
            }
        }

        // Test 6: Rendering system
        console.log('\n--- Test 6: Rendering ---');
        const renderTests = {
            'Rendering exists': typeof window.Rendering !== 'undefined',
            'Rendering.camera': !!window.Rendering?.camera,
            'celestialSprites': !!window.celestialSprites && window.celestialSprites.length > 0
        };

        for (const [name, result] of Object.entries(renderTests)) {
            if (result) {
                console.log(`✓ ${name}`);
                passCount++;
            } else {
                console.error(`✗ ${name}`);
                failCount++;
            }
        }

        // Test 7: Camera state
        console.log('\n--- Test 7: Camera ---');
        if (window.Rendering?.camera) {
            const camera = window.Rendering.camera;
            console.log(`Camera position: (${camera.vector?.x}, ${camera.vector?.y})`);
            console.log(`Camera zoom: ${camera.zoom}`);

            if (camera.vector && typeof camera.zoom === 'number') {
                console.log('✓ Camera initialized');
                passCount++;
            } else {
                console.error('✗ Camera not properly initialized');
                failCount++;
            }
        } else {
            console.error('✗ Camera missing');
            failCount++;
        }

        // Test 8: Event system
        console.log('\n--- Test 8: Event System ---');
        if (window.engineEvent) {
            const listenerCount = window.engineEvent.listenerCount('gameTick');
            console.log(`gameTick listeners: ${listenerCount}`);

            if (listenerCount > 0) {
                console.log('✓ Event system active');
                passCount++;
            } else {
                console.error('✗ No gameTick listeners (update loop not connected)');
                failCount++;
            }
        } else {
            console.error('✗ Event system missing');
            failCount++;
        }

        // Summary
        console.log('\n=== TEST SUMMARY ===');
        console.log(`✓ Passed: ${passCount}`);
        console.log(`✗ Failed: ${failCount}`);
        console.log(`Total: ${passCount + failCount}`);

        if (failCount === 0) {
            console.log('🎉 ALL TESTS PASSED - Game ready!');
            return true;
        } else {
            console.error('⚠️ SOME TESTS FAILED - Check errors above');
            return false;
        }
    }
}

window.TestStart = TestStart;
