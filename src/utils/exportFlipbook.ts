export const exportFlipbookAsHTML = (pages: string[]) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>PDF Flipbook</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 20px;
      color: white;
      overflow-x: hidden;
    }
    .container {
      max-width: 1200px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .flipbook-wrapper {
      position: relative;
      border-radius: 16px;
      overflow: visible;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 900px;
      flex: 1;
    }
    #book {
      width: 100% !important;
      height: auto !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
    .stf__wrapper {
      margin: 0 auto !important;
    }
    .page {
      background: #f5f1e8;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .page img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 30px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 15px 30px;
      border-radius: 50px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      font-size: 20px;
    }
    button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }
    button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .page-info {
      color: white;
      font-size: 14px;
      min-width: 80px;
      text-align: center;
    }
    @media (max-width: 768px) {
      body {
        padding: 10px;
        justify-content: flex-start;
      }
      h1 {
        font-size: 1.5rem;
        margin-bottom: 5px;
      }
      .header {
        margin-bottom: 20px;
      }
      .header p {
        font-size: 0.9rem;
      }
      .container {
        gap: 15px;
      }
      .flipbook-wrapper {
        max-width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
      }
      .controls {
        margin-top: 20px;
        padding: 12px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📖 PDF Flipbook</h1>
      <p>Arraste as páginas ou use os controles para navegar</p>
    </div>
    <div id="root"></div>
  </div>

  <script>
    const { useState, useRef, useEffect } = React;
    const pages = ${JSON.stringify(pages)};

    function FlipBookApp() {
      const bookRef = useRef(null);
      const containerRef = useRef(null);
      const [currentPage, setCurrentPage] = useState(0);
      const [pageFlip, setPageFlip] = useState(null);

      useEffect(() => {
        if (containerRef.current && !pageFlip && window.PageFlip) {
          try {
            const isMobile = window.innerWidth <= 768;
            const containerWidth = containerRef.current.offsetWidth;
            
            // Calcula tamanho baseado na tela disponível
            let pageWidth, pageHeight;
            
            if (isMobile) {
              pageWidth = Math.min(containerWidth * 0.85, 300);
              pageHeight = pageWidth * 1.414;
            } else {
              pageWidth = Math.min(containerWidth * 0.4, 400);
              pageHeight = pageWidth * 1.414;
            }

            const book = new window.PageFlip(containerRef.current, {
              width: pageWidth,
              height: pageHeight,
              size: 'fixed',
              minWidth: isMobile ? 200 : 300,
              maxWidth: isMobile ? 320 : 500,
              minHeight: isMobile ? 283 : 424,
              maxHeight: isMobile ? 452 : 707,
              maxShadowOpacity: 0.5,
              showCover: true,
              mobileScrollSupport: true,
              drawShadow: true,
              flippingTime: 600,
              usePortrait: isMobile,
              autoSize: true,
              useMouseEvents: true,
              swipeDistance: 30,
              showPageCorners: true,
              disableFlipByClick: false
            });

            book.loadFromHTML(document.querySelectorAll('.page'));
            
            book.on('flip', (e) => {
              setCurrentPage(e.data);
            });

            setPageFlip(book);
          } catch (error) {
            console.error('Erro ao inicializar flipbook:', error);
          }
        }
      }, [pageFlip]);

      const nextPage = () => {
        if (pageFlip) {
          pageFlip.flipNext();
        }
      };

      const prevPage = () => {
        if (pageFlip) {
          pageFlip.flipPrev();
        }
      };

      return React.createElement('div', { style: { width: '100%' } },
        React.createElement('div', { 
          className: 'flipbook-wrapper',
          ref: containerRef,
          id: 'book'
        },
          pages.map((page, index) =>
            React.createElement('div', {
              key: index,
              className: 'page',
              'data-density': 'hard'
            },
              React.createElement('img', {
                src: page,
                alt: 'Página ' + (index + 1),
                style: { width: '100%', height: '100%', objectFit: 'contain' }
              })
            )
          )
        ),
        React.createElement('div', { className: 'controls' },
          React.createElement('button', {
            onClick: prevPage,
            disabled: currentPage === 0
          }, '‹'),
          React.createElement('div', { className: 'page-info' },
            (currentPage + 1) + ' / ' + pages.length
          ),
          React.createElement('button', {
            onClick: nextPage,
            disabled: currentPage >= pages.length - 1
          }, '›')
        )
      );
    }

    window.addEventListener('load', () => {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(FlipBookApp));
    });
  </script>
</body>
</html>`;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `flipbook-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
