import { useState } from "react";
import { Nav } from "../components/nav";
import { DarkModeToggle } from "../components/dark-mode-toggle";
import { PhotoPrint } from "../components/photo-print";
import { AdminNote } from "../components/admin-note";
import { StickyNote } from "../components/sticky-note";
import { VideoModule } from "../components/video-module";
import { Lightbox } from "../components/lightbox";
import { Scrap } from "../components/scrap";

export const Archive09 = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxOpen(true);
  };

  return (
    <div className="canvas-container">
      <Nav />
      <DarkModeToggle />

      <Scrap
        id="main-tag"
        className="font-tag"
        style={{
          top: 40,
          right: 50,
          fontSize: "5rem",
          opacity: 0.1,
          pointerEvents: "none",
        }}
        draggable={false}
      >
        ZURI
      </Scrap>

      <Scrap
        id="img-1"
        style={{ top: 100, left: 400, transform: "rotate(-6deg)" }}
      >
        <PhotoPrint
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600"
          alt="Texture"
          caption="Dust & Light"
          tape
        />
      </Scrap>

      <Scrap
        id="img-2"
        style={{ top: 150, left: 800, transform: "rotate(4deg)" }}
      >
        <PhotoPrint
          src="https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=600"
          alt="Architecture"
          caption="Void 042"
        />
      </Scrap>

      <Scrap
        id="img-3"
        style={{ top: 450, left: 350, transform: "rotate(2deg)" }}
      >
        <PhotoPrint
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600"
          alt="Landscape"
          caption="Edge of Memory"
          tape
          tapeStyle="gray"
        />
      </Scrap>

      <Scrap
        id="img-4"
        style={{ top: 520, left: 950, transform: "rotate(-3deg)" }}
      >
        <PhotoPrint
          src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600"
          alt="Abstract"
          caption="Organic Static"
        />
      </Scrap>

      <Scrap
        id="vid-1"
        style={{ top: 380, left: 650, transform: "rotate(-2deg)" }}
      >
        <div onClick={openLightbox} style={{ cursor: "pointer" }}>
          <VideoModule
            playLabel="PLAY_REC_01.MOV"
            footer={
              <div
                style={{
                  padding: "0.8rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span className="font-ui">STUDY_TEXTURE_01</span>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    background: "red",
                    borderRadius: "50%",
                  }}
                />
              </div>
            }
          />
        </div>
      </Scrap>

      <Scrap
        id="vid-2"
        style={{ top: 50, left: 1080, transform: "rotate(5deg)" }}
      >
        <div onClick={openLightbox} style={{ cursor: "pointer" }}>
          <VideoModule
            playLabel="STREAM_LOOP"
            footer={
              <div
                className="font-ui"
                style={{ padding: "0.8rem", fontSize: "0.6rem" }}
              >
                AUTO_PLAYBACK_V.2
              </div>
            }
          />
        </div>
      </Scrap>

      <Scrap
        id="admin-note"
        style={{ top: 120, left: 50, transform: "rotate(-3deg)", zIndex: 20 }}
        isNote
      >
        <AdminNote>
          Thanks for all the love on this drop! More archival pieces coming
          soon...
          <br />
          <br />— Zuri
        </AdminNote>
      </Scrap>

      <Scrap
        id="note-1"
        className="testimonial-bar"
        style={{ bottom: "2rem", left: "2rem", transform: "rotate(-4deg)" }}
        isNote
      >
        <StickyNote />
      </Scrap>

      <Lightbox isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
};
