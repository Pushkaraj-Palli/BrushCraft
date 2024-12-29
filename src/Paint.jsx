import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import { FaPencil } from "react-icons/fa6";
import { LuEraser } from "react-icons/lu";

const Paint = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("pencil");
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const colors = [
    "#000000",
    "#800000",
    "#FF0000",
    "#FF4500",
    "#FFA500",
    "#FFFF00",
    "#90EE90",
    "#00FFFF",
    "#0000FF",
    "#FFFFFF",
    "#A0522D",
    "#FFC0CB",
    "#FFD700",
    "#98FB98",
    "#7FFFD4",
    "#87CEEB",
    "#4169E1",
    "#9370DB",
  ];

  const updateCanvasSize = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth - 100;
      canvas.height = window.innerHeight;

      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.lineCap = "round";
    }
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineCap = "round";
  }, [color, brushSize]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    setIsDrawing(true);
    context.beginPath();
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    context.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "paint-image.png";
    link.href = image;
    link.click();
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    setShowCustomPicker(false);
  };

  return (
    <div className="paint-container" ref={containerRef}>
      <div className="controls-container">
        <div className="toolbar">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="brush-size"
          />
          <span>{brushSize}px</span>

          {/* Tool Buttons */}
          <div className="tool-buttons">
            <button
              className={`tool-btn ${tool === "pencil" ? "active" : ""}`}
              onClick={() => setTool("pencil")}
              title="Pencil"
            >
              <FaPencil />
            </button>
            <button
              className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
              onClick={() => setTool("eraser")}
              title="Eraser"
            >
              <LuEraser />
            </button>
          </div>

          {/* Color Picker Section */}
          <div className="color-picker-section">
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="color-picker-input"
              title="Choose custom color"
            />
            <span className="current-color">
              Current: <span style={{ color: color }}>{color}</span>
            </span>
          </div>

          <button onClick={clearCanvas} className="btn btn-clear">
            Clear
          </button>
          <button onClick={downloadImage} className="btn btn-save">
            Save
          </button>

          <div className="color-palette">
            {colors.map((colorValue, index) => (
              <button
                key={index}
                className={`color-btn ${
                  color === colorValue ? "selected" : ""
                }`}
                style={{ backgroundColor: colorValue }}
                onClick={() => setColor(colorValue)}
              />
            ))}
          </div>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="canvas"
        />
      </div>
    </div>
  );
};

export default Paint;
