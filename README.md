# RIFM - React Input Format & Mask

Is a tiny (≈ 800b) component to transform any input component
into formatted or masked input.

[Demo](https://istarkov.github.io/rifm)

## Highlights

- Requires React 16.8+
- Dependency free
- Tiny (≈ 800b)
- Supports any [input](https://istarkov.github.io/rifm#material-ui).
- Can [mask](https://istarkov.github.io/rifm#date-format) input,
  [format](https://istarkov.github.io/rifm#number-format) and [more](https://istarkov.github.io/rifm#case-enforcement)
- Small readable source
- flow + typescript definitions

## Example

```js
import { Rifm } from 'rifm';
import TextField from '@material-ui/core/TextField';
import { css } from 'emotion';

const numberFormat = (str: string) => {
  const r = parseInt(str.replace(/[^\d]+/gi, ''), 10);
  return r ? r.toLocaleString('en') : '';
}

...

  const [value, setValue] = React.useState('')

  <Rifm
    value={value}
    onChange={setValue}
    format={numberFormat}
  >
    {({ value, onChange }) => (
      <TextField
        value={value}
        label={'Float'}
        onChange={onChange}
        className={css({input: {textAlign:"right"}})}
        type="tel"
      />
    )}
  </Rifm>

...
```

## Install

```sh
yarn add rifm
```

## API

### Terminology

Rifm is based on few simple ideas (**\***):

- format operation doesn't change the order of some symbols after edit
- all that symbols are placed before input cursor position

**\*** _These ideas are not always true, but we solve some edge cases where it's not._

> Imagine you have simple integer number formatter with **\`** as thousands separator
> and current input state is _123\`4_**|**_67_ _("|" shows current cursor position)_.
>
> User press _5_ then formatted input must be equal to _1\`234\`5_**|**_67_.
>
> The overall order of elements has changed (was _1->2->3->\`->4->..._ became _1->\`->2->3->4..._)
> but the order of digits before cursor hasn't changed (was _1->2->3->4_ and hasn't changed).

The same is true for float numbers formatting, dates and more.
Symbols with preserved order are different and depends on format.
We call this kind of symbols - **"accepted"** symbols.

Rifm solves only one task -
find the right place for cursor after formatting.

Knowledge about what symbols are **"accepted"** and cursor position after any user action
is enough to find the final cursor position.

Most operations which are not covered with above ideas like
case enforcements, masks guides, floating point _","=>"."_ replacement
can be done using simple postprocessing step - replace.
This operation works well if you need to change input value without loosing cursor position.

And finaly masks - masks are usually is nothing more
than format with replace editing mode + some small cursor visual hacks.

### Props

| Prop         | type                          | default | Description                                                                         |
| ------------ | :---------------------------- | :------ | :---------------------------------------------------------------------------------- |
| **accept**   | RegExp (optional)             | /\d/g   | Regular expression to detect **"accepted"** symbols                                 |
| **format**   | string => string              |         | format function                                                                     |
| **value**    | string                        |         | input value                                                                         |
| **onChange** | string => void                |         | event fired on input change                                                         |
| **children** | ({ value, onChange }) => Node |         | value and onChange handler you need to pass to underlying input element             |
| **mask**     | boolean (optional)            |         | use replace input mode if true, use cursor visual hacks if prop provided            |
| **replace**  | string => string (optional)   |         | format postprocessor allows you to fully replace any/all symbol/s preserving cursor |

See the [Demo](https://istarkov.github.io/rifm) there are a lot of examples there.

## Thanks

[@TrySound](https://github.com/TrySound) for incredible help and support on this
