import { useParams } from "react-router-dom";

const ModelViewerPage = () => {
  const { file } = useParams();

  const modelUrl = `http://127.0.0.1:8000/media/models/${file}`;

  return (
    <div className="w-full h-screen bg-black">
      <model-viewer
        src={modelUrl}
        auto-rotate
        camera-controls
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default ModelViewerPage;
