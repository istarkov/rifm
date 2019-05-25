// @flow

import { dateFormat } from './format.js';
import { createExec } from './utils/exec';

test('mask behaviour', async () => {
  const exec = createExec({
    replace: v => v.length >= 10,
    format: dateFormat,
  });

  exec({ type: 'PUT_SYMBOL', payload: '1' }).toMatchInlineSnapshot(`"1|"`);
  exec({ type: 'PUT_SYMBOL', payload: '23' }).toMatchInlineSnapshot(`"12-3|"`);
  exec({ type: 'MOVE_CARET', payload: -1 }).toMatchInlineSnapshot(`"12-|3"`);
  exec({ type: 'PUT_SYMBOL', payload: '4' }).toMatchInlineSnapshot(`"12-4|3"`);
  exec({ type: 'MOVE_CARET', payload: -100 }).toMatchInlineSnapshot(`"|12-43"`); // -100 at begin

  exec({ type: 'PUT_SYMBOL', payload: '5' }).toMatchInlineSnapshot(`"5|1-24-3"`);
  exec({ type: 'PUT_SYMBOL', payload: '6' }).toMatchInlineSnapshot(`"56-|12-43"`);
  exec({ type: 'MOVE_CARET', payload: +100 }).toMatchInlineSnapshot(`"56-12-43|"`); // 100 at end
  exec({ type: 'PUT_SYMBOL', payload: '789' }).toMatchInlineSnapshot(`"56-12-4378|"`);

  // now check that replace works
  exec({ type: 'MOVE_CARET', payload: -4 }).toMatchInlineSnapshot(`"56-12-|4378"`);
  exec({ type: 'PUT_SYMBOL', payload: '9' }).toMatchInlineSnapshot(`"56-12-9|378"`);
  exec({ type: 'PUT_SYMBOL', payload: '8' }).toMatchInlineSnapshot(`"56-12-98|78"`);
  exec({ type: 'PUT_SYMBOL', payload: '7' }).toMatchInlineSnapshot(`"56-12-987|8"`);
  exec({ type: 'PUT_SYMBOL', payload: '6' }).toMatchInlineSnapshot(`"56-12-9876|"`);

  exec({ type: 'BACKSPACE' }).toMatchInlineSnapshot(`"56-12-987|"`);

  exec({ type: 'PUT_SYMBOL', payload: '6' }).toMatchInlineSnapshot(`"56-12-9876|"`);

  exec({ type: 'MOVE_CARET', payload: -3 }).toMatchInlineSnapshot(`"56-12-9|876"`);
  exec({ type: 'BACKSPACE' }).toMatchInlineSnapshot(`"56-12|-876"`);

  exec({ type: 'PUT_SYMBOL', payload: '0' }).toMatchInlineSnapshot(`"56-12-0|876"`);

  exec({ type: 'BACKSPACE' }).toMatchInlineSnapshot(`"56-12|-876"`);
  exec({ type: 'PUT_SYMBOL', payload: '01' }).toMatchInlineSnapshot(`"56-12-01|87"`);

  exec({ type: 'PUT_SYMBOL', payload: '2345678' }).toMatchInlineSnapshot(`"56-12-0123|"`);

  exec({ type: 'MOVE_CARET', payload: -100 }).toMatchInlineSnapshot(`"|56-12-0123"`); // -100 at begin
  exec({ type: 'MOVE_CARET', payload: 2 }).toMatchInlineSnapshot(`"56|-12-0123"`);

  exec({ type: 'BACKSPACE' }).toMatchInlineSnapshot(`"5|1-20-123"`);
  exec({ type: 'BACKSPACE' }).toMatchInlineSnapshot(`"|12-01-23"`);

  exec({ type: 'PUT_SYMBOL', payload: '9876' }).toMatchInlineSnapshot(`"98-76-|1201"`);
  exec({ type: 'PUT_SYMBOL', payload: '5' }).toMatchInlineSnapshot(`"98-76-5|201"`);
});

test('mask behaviour with bad symbols', async () => {
  const exec = createExec({
    replace: v => v.length >= 10,
    format: dateFormat,
  });

  exec({ type: 'PUT_SYMBOL', payload: '18081978' }).toMatchInlineSnapshot(`"18-08-1978|"`);
  exec({ type: 'MOVE_CARET', payload: -4 }).toMatchInlineSnapshot(`"18-08-|1978"`);
  exec({ type: 'PUT_SYMBOL', payload: 'x' }).toMatchInlineSnapshot(`"18-08-|1978"`);
});

test('mask behaviour with delete', async () => {
  const exec = createExec({
    replace: v => v.length >= 10,
    format: dateFormat,
  });

  exec({ type: 'PUT_SYMBOL', payload: '18081978' }).toMatchInlineSnapshot(`"18-08-1978|"`);
  exec({ type: 'MOVE_CARET', payload: -4 }).toMatchInlineSnapshot(`"18-08-|1978"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08-|978"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08-|78"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08-|8"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08|"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08|"`);
  exec({ type: 'PUT_SYMBOL', payload: '1978' }).toMatchInlineSnapshot(`"18-08-1978|"`);
  exec({ type: 'MOVE_CARET', payload: -100 }).toMatchInlineSnapshot(`"|18-08-1978"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"|80-81-978"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"|08-19-78"`);
  exec({ type: 'PUT_SYMBOL', payload: '18' }).toMatchInlineSnapshot(`"18-|08-1978"`);

  exec({ type: 'MOVE_CARET', payload: 1 }).toMatchInlineSnapshot(`"18-0|8-1978"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-0|1-978"`);
  exec({ type: 'PUT_SYMBOL', payload: '8' }).toMatchInlineSnapshot(`"18-08-|1978"`);
  exec({ type: 'MOVE_CARET', payload: 2 }).toMatchInlineSnapshot(`"18-08-19|78"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08-19|8"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08-19|"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08-19|"`);
  exec({ type: 'PUT_SYMBOL', payload: '78' }).toMatchInlineSnapshot(`"18-08-1978|"`);
  exec({ type: 'MOVE_CARET', payload: -5 }).toMatchInlineSnapshot(`"18-08|-1978"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08-|1978"`);
});

test('mask works even if state is not updated on equal vals', async () => {
  const exec = createExec({
    replace: v => v.length >= 10,
    format: dateFormat,
  });

  exec({ type: 'PUT_SYMBOL', payload: '18081978' }).toMatchInlineSnapshot(`"18-08-1978|"`);
  exec({ type: 'MOVE_CARET', payload: -100 }).toMatchInlineSnapshot(`"|18-08-1978"`);
  exec({ type: 'PUT_SYMBOL', payload: '18081978' }).toMatchInlineSnapshot(`"18-08-1978|"`);
  exec({ type: 'MOVE_CARET', payload: -4 }).toMatchInlineSnapshot(`"18-08-|1978"`);
  exec({ type: 'PUT_SYMBOL', payload: '1978' }).toMatchInlineSnapshot(`"18-08-1978|"`);
  exec({ type: 'MOVE_CARET', payload: -4 }).toMatchInlineSnapshot(`"18-08-|1978"`);
  exec({ type: 'BACKSPACE' }).toMatchInlineSnapshot(`"18-08|-1978"`);
  exec({ type: 'DELETE' }).toMatchInlineSnapshot(`"18-08-|1978"`);

  exec({ type: 'PUT_SYMBOL', payload: 'x' }).toMatchInlineSnapshot(`"18-08-|1978"`);
  exec({ type: 'MOVE_CARET', payload: -1 }).toMatchInlineSnapshot(`"18-08|-1978"`);
  exec({ type: 'PUT_SYMBOL', payload: 'x' }).toMatchInlineSnapshot(`"18-08-|1978"`);
  exec({ type: 'MOVE_CARET', payload: -1 }).toMatchInlineSnapshot(`"18-08|-1978"`);
  exec({ type: 'PUT_SYMBOL', payload: '1' }).toMatchInlineSnapshot(`"18-08-1|978"`);
});
