/* @flow */

import * as React from 'react';

type Props = {|
  value: string,
  onChange: string => void,
  format: (str: string) => string,
  replace?: string => boolean,
  refuse?: RegExp,
  children: ({
    value: string,
    onChange: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
  }) => React.Node,
|};

type State = {|
  value: string,
  local: boolean,
|};

export class Rifm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value,
      local: false,
    };
  }

  _state: ?{|
    before: string,
    input: HTMLInputElement,
    op: boolean,
  |} = null;

  _handleChange = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    let value = evt.target.value;
    const input = evt.target;
    const op = value.length > this.props.value.length;
    const noOp = this.props.value === this.props.format(value);

    this.setState({ value, local: true }, () => {
      const { selectionStart } = input;
      const refuse = this.props.refuse || /[^\d]+/gi;

      const before = value.substr(0, selectionStart).replace(refuse, '');

      this._state = { input, before, op };

      if (
        this.props.replace &&
        this.props.replace(this.props.value) &&
        op &&
        !noOp
      ) {
        let start = -1;
        for (let i = 0; i !== before.length; ++i) {
          start = Math.max(start, value.indexOf(before[i], start + 1));
        }

        const c = value.substr(start + 1).replace(refuse, '')[0];
        start = value.indexOf(c, start + 1);

        value = `${value.substr(0, start)}${value.substr(start + 1)}`;
      }

      this.props.onChange(this.props.format(value));
    });
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      value: state.local ? state.value : props.value,
      local: false,
    };
  }

  render() {
    const {
      _handleChange,
      state: { value },
      props: { children },
    } = this;

    return children({ value, onChange: _handleChange });
  }

  componentDidUpdate() {
    const { _state } = this;

    if (_state) {
      const value = this.state.value;

      let start = -1;
      for (let i = 0; i !== _state.before.length; ++i) {
        start = Math.max(start, value.indexOf(_state.before[i], start + 1));
      }

      if (this.props.replace && _state.op) {
        while (
          value[start + 1] &&
          (this.props.refuse || /[^\d]+/gi).test(value[start + 1])
        ) {
          start += 1;
        }
      }

      _state.input.selectionStart = start + 1;
      _state.input.selectionEnd = start + 1;
    }

    this._state = null;
  }
}
