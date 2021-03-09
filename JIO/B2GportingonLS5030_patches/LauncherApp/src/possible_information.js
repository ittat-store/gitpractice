import React from 'react';
import BaseComponent from './base_component';
import '../style/scss/possible_informatiob.scss';

export default class PossibleInformation extends BaseComponent {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }
  render() {
  	return(
  	  <div className='weather_section'>
        <row>
          <img className='weather_icon' src='images/weather_cloud_icon.jpg'/>
          <span className='weather_degree'>23°</span>
        </row>
      </div>
  	);
  }
}