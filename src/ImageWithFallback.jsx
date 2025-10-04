import React, { useState } from "react";

function ImageWithFallback ({ src, alt, fallback = "/fallback/09481772-8201-452d-a03b-0c454d65d14b.jpg", className }) {
    const [imgSrc, setImgSrc] = useState(src)

    return(
        <img 
            src={imgSrc}
            alt={alt}
            fallback={className}
            className="w-full max-w-lg h-auto rounded-lg shadow-lg"
            onError={() => setImgSrc(fallback)} // si erreur → fallback
        />
    );
}

export default ImageWithFallback;