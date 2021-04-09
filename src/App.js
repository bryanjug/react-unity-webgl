import React, {useEffect, useState} from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  codeUrl: "/Pet/Build/Pet.wasm",
  frameworkUrl: "/Pet/Build/Pet.framework.js",
  dataUrl: "/Pet/Build/Pet.data",
  loaderUrl: "/Pet/Build/Pet.loader.js",
});

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("-");
  const [feedPet, setFeedPet] = useState(false);

  useEffect(() => {
    unityContext.on("Sayx", (message) => {
      setMessage(message);
    });

    unityContext.on("loaded", () => {
      setIsLoaded(true);
    });

    unityContext.on("error", (message) => {
      console.log("AN ERROR OCCURED", message);
    });

    unityContext.on("debug", (message) => {
      console.log("GOT A LOG", message);
    });
  }, [])

  //runs animation and resets back to first unity state once feedPet state updates
  useEffect(() => {
    unityContext.send("pet", "Eat", "true")
    if (feedPet === true) {
      var myVar = setInterval(() => {
        unityContext.send("pet", "Eat", "false");
        clearInterval(myVar);
        setFeedPet(false);
      }, 5000);
    }
  }, [feedPet])

  const handleClick = () => {
    setFeedPet(true);
  }

  return (
    <div>
      <button style={{marginTop: '5%', position: "absolute", zIndex: "9999"}} onClick={handleClick}>Complete</button>
      <button style={{marginTop: '10%', position: "absolute", zIndex: "9999"}}>Reset</button>
      <Unity
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          margin: "auto",
          visibility: isLoaded ? "visible" : "hidden",
        }}
        unityContext={unityContext}
        devicePixelRatio={2} //set graphics quality
      />
    </div>
  );
}

export default App;