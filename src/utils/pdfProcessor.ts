import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const processPDF = async (file: File): Promise<string[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    
    // Create canvas for the full page
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    if (!context) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    } as any).promise;

    // Split the page horizontally (left and right halves)
    const halfWidth = canvas.width / 2;
    
    // Left half
    const leftCanvas = document.createElement("canvas");
    const leftContext = leftCanvas.getContext("2d");
    if (leftContext) {
      leftCanvas.width = halfWidth;
      leftCanvas.height = canvas.height;
      leftContext.drawImage(
        canvas,
        0, 0, halfWidth, canvas.height, // source
        0, 0, halfWidth, canvas.height  // destination
      );
      pages.push(leftCanvas.toDataURL("image/png"));
    }

    // Right half
    const rightCanvas = document.createElement("canvas");
    const rightContext = rightCanvas.getContext("2d");
    if (rightContext) {
      rightCanvas.width = halfWidth;
      rightCanvas.height = canvas.height;
      rightContext.drawImage(
        canvas,
        halfWidth, 0, halfWidth, canvas.height, // source
        0, 0, halfWidth, canvas.height          // destination
      );
      pages.push(rightCanvas.toDataURL("image/png"));
    }
  }

  return pages;
};
