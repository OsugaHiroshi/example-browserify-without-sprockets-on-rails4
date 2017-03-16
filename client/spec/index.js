const assert = require('power-assert');
describe('index', () => {
  it('random', () => {
    const randomValue = ( max, min) => {
      return Math.floor( Math.random() * (max - min) + min);
    };

    for(let i = 0 ; i < 1000 ; i++) {
      const value = randomValue(150, 50);
      assert.ok( 50 <= value && value < 150 );
    }
  });
});
