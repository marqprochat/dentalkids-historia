import { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

interface FlipBookProps {
  pages: string[];
}

export const FlipBook = ({ pages }: FlipBookProps) => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(pages.length);
  }, [pages]);

  const nextPage = () => {
    bookRef.current?.pageFlip().flipNext();
  };

  const prevPage = () => {
    bookRef.current?.pageFlip().flipPrev();
  };

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  if (pages.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-br from-book-spine/20 to-accent/20 blur-3xl rounded-3xl" />
        
        <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-book)]">
          <HTMLFlipBook
            ref={bookRef}
            width={550}
            height={733}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {pages.map((page, index) => (
              <div key={index} className="page bg-book-page">
                <div className="page-content h-full w-full flex items-center justify-center p-2">
                  <img
                    src={page}
                    alt={`Página ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevPage}
          disabled={currentPage === 0}
          className="rounded-full hover:bg-primary/10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2 min-w-[120px] justify-center">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {currentPage + 1} / {totalPages}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1}
          className="rounded-full hover:bg-primary/10"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <style>{`
        .flipbook {
          margin: 0 auto;
        }
        .page {
          background-color: hsl(var(--book-page));
          box-shadow: var(--shadow-page);
        }
        .page-content {
          background: var(--gradient-paper);
        }
      `}</style>
    </div>
  );
};
