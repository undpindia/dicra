import React, {useState}from "react";
import { Radio } from 'antd';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const options = [
  { label: 'Raster', value: 'Raster' },
  { label: 'Vector', value: 'Vector' },
];

class ToggleLayer extends React.Component {
  state = {
    value: 'Raster',
  };

  onChange = e => {    
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { value } = this.state;
    return (
        <Radio.Group
        size="small"
          options={options}
          onChange={this.onChange}
          value={value}
          optionType="button"
          buttonStyle="solid"
        />
    );
  }
}

export default ToggleLayer;