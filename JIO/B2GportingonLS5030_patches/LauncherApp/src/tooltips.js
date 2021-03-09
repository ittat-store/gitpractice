import React from 'react';
import BaseComponent from './base_component';
import EnhanceAnimation from 'enhance-animation';
import AppStore from './app_store';
import '../style/scss/tooltips.scss';


export default
  class ToolTips extends BaseComponent {
  name = 'ToolTips';
  bottomOffset = 20;

  constructor(props) {
    super(props);
    this.selectedApp = null;
    this.numberOfOption = 3;

  }

  setSelectedApp(app) {
    this.selectedApp = app;
  }

  start() {
  }

  stop() {
  }

  show(clickedElement, count = 3) {
     console.log('[Launcher] ToolTips show');

    let tooltipElement = document.querySelector('.tooltipparent');
    tooltipElement.classList.remove('hidden');
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
    let topOffset = clickedElement.offsetTop;
    let leftOffset = clickedElement.offsetLeft;
    let heightOffset =  clickedElement.offsetHeight;
    let widthOffset =  clickedElement.offsetWidth;
    let calculatedWidthoffset = leftOffset;


    if (topOffset >= screenHeight) {
      let heightDiv = Math.floor(topOffset / screenHeight);
      topOffset = topOffset - (screenHeight * heightDiv);
    }

    if (leftOffset >= screenWidth) {
      let widthDiv = Math.floor(leftOffset / screenWidth);
      calculatedWidthoffset =  leftOffset - (screenWidth * widthDiv);
    }

    console.log('[Launcher] ToolTips show clickedElement topOffset ' + topOffset);
    console.log('[Launcher] ToolTips show clickedElement leftOffset ' + leftOffset);
    console.log('[Launcher] ToolTips show clickedElement heightOffset ' + heightOffset);
    console.log('[Launcher] ToolTips show clickedElement widthOffset ' + widthOffset);
    let tooltipArrow=document.querySelector('.tooltiparrow');

    if (topOffset > 50) {
      tooltipElement.style.top =  (topOffset - heightOffset) + "px";
      tooltipArrow.classList.remove('tooltipStyleFirstRow');
      tooltipArrow.classList.add('tooltipStyleRestRows');
      tooltipArrow.style.top = tooltipElement.offsetHeight + 'px';
    } else {
      tooltipElement.style.top =  (topOffset + heightOffset + this.bottomOffset) + "px";
      tooltipArrow.classList.remove('tooltipStyleRestRows');
      tooltipArrow.classList.add('tooltipStyleFirstRow');
      tooltipArrow.style.top = "-10px";
    }


     if (calculatedWidthoffset > 300) {
      tooltipElement.style.left =  ((leftOffset + widthOffset) - tooltipElement.offsetWidth) + 'px';//(leftOffset - widthOffset) + "px";

      tooltipArrow.style.left = (tooltipElement.offsetWidth - (widthOffset/2)) + 'px';
    } 
    else if(calculatedWidthoffset > 50 && calculatedWidthoffset < 300) {
      tooltipElement.style.left =  ((leftOffset + (widthOffset/2)) - (tooltipElement.offsetWidth / 2)) + 'px';//(leftOffset - widthOffset / 2) + "px";
      tooltipArrow.style.left = (tooltipElement.offsetWidth / 2) + 'px';
    }
    else {
      tooltipElement.style.left =  leftOffset + "px";
      tooltipArrow.style.left = (widthOffset / 2) +'px';
    }

    // tooltipElement.width = 18+"rem";

  }

  hide() {
    console.log('[Launcher] ToolTips hide');
    document.querySelector('.tooltipparent').classList.add('hidden');
    //this.element.classList.add('hidden');
  }

  componentDidMount() {

  }

  tooltipclicks()
  {
    console.log("tooltip btn clicked");
    this.emit('tooltipclicks');
  }

  render() {

    let tooltipchild = [];
    for (var i = 0; i <= 2; i++) {
      tooltipchild.push(
        <div className='option_div' onClick={this.tooltipclicks.bind(this)}>
          <img className="option_icon" src="../images/trash_bin.png" />
          <span className='icon_text'>App Info</span>
        </div>
      );
    }

    return (
     
      <div className="tooltipparent hidden">
        <div className="tooltiparrow"></div>
        {tooltipchild}
      </div>
    );
  }
}




