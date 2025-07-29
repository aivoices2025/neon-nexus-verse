import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Pen, 
  Square, 
  Circle as CircleIcon, 
  Eraser, 
  Undo, 
  Redo, 
  Trash2,
  MousePointer,
  Palette
} from "lucide-react";
import { toast } from "sonner";

interface WhiteboardProps {
  className?: string;
}

const colors = [
  "#000000", "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
  "#800080", "#008000", "#800000", "#000080"
];

export const Whiteboard = ({ className }: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "eraser">("draw");
  const [brushSize, setBrushSize] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1000,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    toast.success("Whiteboard ready! Start teaching!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw" || activeTool === "eraser";
    
    if (fabricCanvas.freeDrawingBrush) {
      if (activeTool === "eraser") {
        fabricCanvas.freeDrawingBrush.color = "#ffffff";
        fabricCanvas.freeDrawingBrush.width = brushSize * 3;
      } else {
        fabricCanvas.freeDrawingBrush.color = activeColor;
        fabricCanvas.freeDrawingBrush.width = brushSize;
      }
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: 2,
        width: 100,
        height: 80,
      });
      fabricCanvas?.add(rect);
      fabricCanvas?.setActiveObject(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: 2,
        radius: 50,
      });
      fabricCanvas?.add(circle);
      fabricCanvas?.setActiveObject(circle);
    }
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Whiteboard cleared!");
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = 'whiteboard-lesson.png';
    link.href = dataURL;
    link.click();
    
    toast.success("Whiteboard saved!");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <Card className="p-4 bg-card/50 border-border/30">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tool Selection */}
          <div className="flex items-center gap-1 border-r border-border/30 pr-2">
            <Button
              variant={activeTool === "select" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick("select")}
              className="w-9 h-9 p-0"
            >
              <MousePointer className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "draw" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick("draw")}
              className="w-9 h-9 p-0"
            >
              <Pen className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "rectangle" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick("rectangle")}
              className="w-9 h-9 p-0"
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "circle" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick("circle")}
              className="w-9 h-9 p-0"
            >
              <CircleIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick("eraser")}
              className="w-9 h-9 p-0"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-2 border-r border-border/30 pr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-9 h-9 p-0 relative"
              style={{ backgroundColor: activeColor }}
            >
              <Palette className="w-4 h-4" style={{ color: activeColor === "#000000" ? "white" : "black" }} />
            </Button>
            {showColorPicker && (
              <div className="absolute z-10 mt-1 p-2 bg-background border border-border rounded-lg shadow-lg grid grid-cols-4 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-border/30 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setActiveColor(color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2 border-r border-border/30 pr-2">
            <label className="text-sm text-muted-foreground">Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-16"
            />
            <Badge variant="outline" className="min-w-[2rem] text-center">
              {brushSize}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              className="w-9 h-9 p-0"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="w-9 h-9 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="ml-2"
            >
              Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <Card className="p-4 bg-card/50 border-border/30">
        <div className="bg-white rounded-lg shadow-inner p-4 overflow-auto">
          <canvas 
            ref={canvasRef} 
            className="border border-gray-200 rounded cursor-crosshair max-w-full"
          />
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-3 bg-primary/5 border-primary/20">
        <p className="text-sm text-muted-foreground text-center">
          🎨 Use the tools above to teach and illustrate concepts • 
          📱 Students can interact in real-time • 
          💾 Save your lessons for later reference
        </p>
      </Card>
    </div>
  );
};