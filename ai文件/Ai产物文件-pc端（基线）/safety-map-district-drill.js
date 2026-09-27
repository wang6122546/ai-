(()=>{
  const stage=document.querySelector('.map-stage');let lastCode='',lastTime=0;
  stage.addEventListener('click',event=>{
    if(!geoData||event.target.closest('.map-toolbar,.map-point-card,.gis-point'))return;
    const svg=document.querySelector('#cityMap'),point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;
    const localPoint=point.matrixTransform(svg.getScreenCTM().inverse());
    const group=[...document.querySelectorAll('.district-shape')].find(item=>item.querySelector('path').isPointInFill(localPoint));
    if(!group)return;
    const now=Date.now(),code=group.dataset.code,isDouble=code===lastCode&&now-lastTime<500;
    lastCode=code;lastTime=now;
    if(!isDouble)return;
    event.preventDefault();event.stopImmediatePropagation();
    const feature=geoData.features.find(item=>String(item.properties.adcode)===code);
    if(feature){lastCode='';drill(feature)}
  },true);
})();
