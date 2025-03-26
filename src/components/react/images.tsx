import { useState } from 'react';
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { MasonryPhotoAlbum} from "react-photo-album";
import { UnstableSSR as SSR } from "react-photo-album/ssr";
import "react-photo-album/masonry.css";
import type { Photo } from "react-photo-album";
import { UnstableServerPhotoAlbum as ServerPhotoAlbum } from "react-photo-album/server";


type Images = {
    src: string;
    alt?: string;
  };

  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
  

export default function GetImages ({ images }: { images:Photo[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClick = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        console.log(setIsOpen)
    };
    return (
        <>
            <Lightbox
                open={isOpen}
                index={currentIndex}
                close={() => setIsOpen(false)}
                slides={images?.map((photo: Images) => ({
                    src: photo.src,
                    alt: "image",
                }))}
            />
                <MasonryPhotoAlbum spacing={5} photos={images} onClick={({ index }) => handleClick(index)}  componentsProps={(containerWidth) => ({image: { loading: (containerWidth || 0) > 600 ? "eager" : "lazy" },})}/>
                {/* <ServerPhotoAlbum layout="masonry"  breakpoints={[300, 600, 900]} photos={images} /> */}
        </>
    )
}
