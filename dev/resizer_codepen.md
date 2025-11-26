```html
<div class="wrapper">
  <div class="pane left">
    This is the left pane.
  </div>
  <div class="pane right">
    This is the right pane.
    <div class="gutter"></div>
  </div>
</div>
```

```css
*, *::before, *::after {
 box-sizing: border-box;
}
  
 body {
  margin: 0;
}

.wrapper {
  height: 100vh;
  width: 100vw;
  background: #333;
  border: 6px solid #666;
  display: flex;
}

.pane {
  padding: 1em;
  color: #fff;
  min-width: 200px;
}

.left {
  
}

.right {
  position: relative;
}

.gutter {
  width: 10px;
  height: 100%;
  background: #666;
  position: absolute;
  top: 0;
  left: 0;
  cursor: col-resize;
}
```

```js
const leftPane = document.querySelector(".left");
const rightPane = document.querySelector(".right");
const gutter = document.querySelector(".gutter");


function resizer(e) {
  
  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);
  
  let prevX = e.x;
  const leftPanel = leftPane.getBoundingClientRect();
  
  
  function mousemove(e) {
    let newX = prevX - e.x;
    leftPane.style.width = leftPanel.width - newX + "px";
  }
  
  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
    
  }
  
  
}


gutter.addEventListener('mousedown', resizer);
```
