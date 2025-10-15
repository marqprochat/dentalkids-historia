export const exportFlipbookAsHTML = (pages: string[]) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF Flipbook</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/react-pageflip@2.0.3/dist/js/react-pageflip.browser.js"></script>
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
      justify-content: center;
      padding: 20px;
      color: white;
    }
    .container {
      max-width: 1200px;
      width: 100%;
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
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      margin: 0 auto;
      display: flex;
      justify-content: center;
    }
    .page {
      background: #f5f1e8;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
    .page img {
      max-width: 100%;
      max-height: 100%;
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
      h1 {
        font-size: 1.8rem;
      }
      .flipbook-wrapper {
        max-width: 100%;
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
    const HTMLFlipBook = window.ReactPageFlip;

    const pages = ${JSON.stringify(pages)};

    function FlipBookApp() {
      const bookRef = useRef(null);
      const [currentPage, setCurrentPage] = useState(0);

      const nextPage = () => {
        if (bookRef.current) {
          bookRef.current.pageFlip().flipNext();
        }
      };

      const prevPage = () => {
        if (bookRef.current) {
          bookRef.current.pageFlip().flipPrev();
        }
      };

      const onFlip = (e) => {
        setCurrentPage(e.data);
      };

      return React.createElement('div', { style: { width: '100%' } },
        React.createElement('div', { className: 'flipbook-wrapper' },
          React.createElement(HTMLFlipBook, {
            ref: bookRef,
            width: 550,
            height: 733,
            size: 'stretch',
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 400,
            maxHeight: 1533,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: true,
            onFlip: onFlip,
            startPage: 0,
            drawShadow: true,
            flippingTime: 800,
            usePortrait: true,
            autoSize: true,
            useMouseEvents: true,
            swipeDistance: 30,
            showPageCorners: true,
            disableFlipByClick: false
          },
            pages.map((page, index) =>
              React.createElement('div', {
                key: index,
                className: 'page'
              },
                React.createElement('img', {
                  src: page,
                  alt: 'Página ' + (index + 1)
                })
              )
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

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(FlipBookApp));
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
