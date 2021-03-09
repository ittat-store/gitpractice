import React from 'react';
import BaseComponent from './base_component';
import '../style/scss/homescreen_ticker.scss';


export default class HomescreenTicker extends BaseComponent {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  
  render() {
  	return(
        <div className="info_container">
        <img className='small_icon' src='images/alarm.png' />
        <span>Calendar</span>
        <span className='info_value'>Arjun's Birthday</span>
        <span className='extra_info'>Today</span>
        </div>
 	);
  }
}
    

{/* <div className='weather_section'>
        <row>
          <img className='weather_icon' src='images/weather_cloud_icon.jpg'/>
          <span className='weather_degree'>23°</span>
        </row>
*/}
  