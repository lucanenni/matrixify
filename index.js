  const params = {
    glyphs: ['#','@','1','2','3','4','5','6','7','8','9','0'],
    cell: 6,
    tint: { r: 40, g: 231, b: 178, a: .6 }
  }

  const fontFamily = 'courier';  
  const typeCanvas = document.getElementById('canvas');
  const typeContext = typeCanvas.getContext('2d', { willReadFrequently: true });
  
  const magic = ({ video, context, width, height }) => {
    const cell = params.cell;
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows;
  
    typeCanvas.width = cols * cell;
    typeCanvas.height = rows * cell;
  
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);
  
    typeContext.save();
  
    typeContext.drawImage(video, 0, 0, cols, rows); // draw image
    typeContext.restore();
  
    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
  
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  
    context.textBaseline = 'middle';
    context.textAlign = 'center';
  
  
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
  
      const x = col * cell + randomRange(-cell, cell) * 0.5;
      const y = row * cell + randomRange(-cell, cell) * 0.5;
  
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];
  
	  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      
	  const glyph = getGlyph(r);
  
	  context.font = `${cell}px ${fontFamily}`;
	  
      context.fillStyle = `rgba(${params.tint.r}, ${params.tint.g}, ${params.tint.b}, ${params.tint.a}`;

      context.fontStyle
      if (Math.random() < 0.2) {
        context.font = `${cell * 2}px ${fontFamily}`;
        context.fillStyle = `rgba(${params.tint.r+50}, ${params.tint.g+50}, ${params.tint.b+50}, ${params.tint.a+0.5}`;
      }
  
      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
  
      context.fillText(glyph, 0, 0);
  
      context.restore();
    }
  
    context.drawImage(typeCanvas, 0, 0);
  };
  
  const getGlyph = (v) => {
    if (v < 130) return '';
    //if (v < 200) return '-';
    //if (v < 220) return '—';
    //if (v < 250) return '+';
  
    return params.glyphs[Math.floor(Math.random()*params.glyphs.length)];
  };
  
  const video = document.getElementById('video');
  
  navigator.getUserMedia(
      {
        video: true,
        audio: false,
      },
      (stream) => {
        video.srcObject = stream
        video.play()
      },
      (error) => {
        console.log(error)
      }
  )
  
  function getWidth() {
    if (document.body) {
      return document.body.clientWidth;
    } else if (self.innerWidth) {
      return self.innerWidth;
    } else if (document.documentElement && document.documentElement.Width) {
      return document.documentElement.Width;
    }
  }

  function getHeight() {
	if (document.documentElement && document.documentElement.clientHeight) {
      return document.documentElement.clientHeight;
    } else if (self.innerHeight) {
      return self.innerHeight;
    } else if (document.body) {
      return document.body.clientHeight;
    }
  }

  const draw = (video, context) => {
	var width = getWidth();
	var height = getHeight();
    magic({ video, context, width, height });  
    setTimeout(draw, 20, video, context);
  }
    
  video.addEventListener('play', function() {
    draw(this, typeContext)
  }, false)

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }