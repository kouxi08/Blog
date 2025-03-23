import { useState } from 'react';
import { ChakraProvider, defaultSystem, Skeleton } from "@chakra-ui/react"
import  Lightbox  from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { MasonryPhotoAlbum} from "react-photo-album";
import "react-photo-album/masonry.css";
import type { Photo } from "react-photo-album";


type Images = {
    src: string;
    alt?: string;
  };

export default function GetImages ({ images }: { images:Photo[] }) {

    const [loadedImages, setLoadedImages] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClick = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        console.log(setIsOpen)
    };

    return (
        <ChakraProvider value= {defaultSystem}>
             <Lightbox
                open={isOpen}
                index={currentIndex}
                close={() => setIsOpen(false)}
                slides={images?.map((photo: Images) => ({
                    src: photo.src,
                    alt: "image",
                }))}
            />
            {/* <SSR breakpoints={[300, 600, 900, 1200]}> */}
                <MasonryPhotoAlbum spacing={10} photos={images} onClick={({ index }) => handleClick(index)} defaultContainerWidth={800} skeleton={<div style={{ width: "100%", minHeight: 800 }} />}/>
            {/* </SSR> */}
        </ChakraProvider>
    )
}
