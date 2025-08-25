import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Code, 
  Beaker, 
  Zap,
  CheckCircle,
  AlertCircle,
  Users,
  Lightbulb,
  Target
} from "lucide-react";
import { Mesh, Group } from "three";

interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  language: string;
  starterCode: string;
  solution: string;
  testCases: Array<{
    input: string;
    expected: string;
    description: string;
  }>;
}

interface Experiment {
  id: string;
  title: string;
  description: string;
  type: "physics" | "chemistry" | "biology" | "math";
  parameters: Array<{
    name: string;
    value: number;
    min: number;
    max: number;
    step: number;
  }>;
}

const CodeVisualization = ({ code, isRunning }: { code: string; isRunning: boolean }) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current && isRunning) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  // Create visual representation based on code complexity
  const codeComplexity = code.split('\n').length;
  const cubeCount = Math.min(codeComplexity, 20);

  return (
    <group ref={groupRef}>
      {/* Central processing unit */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={isRunning ? "#00ff00" : "#7c3aed"} 
          emissive={isRunning ? "#00ff00" : "#7c3aed"}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Code blocks floating around */}
      {Array.from({ length: cubeCount }).map((_, i) => {
        const angle = (i / cubeCount) * Math.PI * 2;
        const radius = 2 + Math.sin(i) * 0.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 0.5;

        return (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial 
              color={isRunning ? "#00ffff" : "#ff00ff"} 
              transparent 
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#7c3aed" />
    </group>
  );
};

const PhysicsExperiment = ({ experiment, parameters }: { experiment: Experiment; parameters: any }) => {
  const ballRef = useRef<Mesh>(null);
  const [isRunning, setIsRunning] = useState(false);

  useFrame((state) => {
    if (ballRef.current && isRunning) {
      const gravity = parameters.gravity || -9.8;
      const time = state.clock.elapsedTime;
      const y = Math.max(-2, 3 + gravity * time * time * 0.1);
      ballRef.current.position.y = y;
      
      if (y <= -2) {
        setIsRunning(false);
      }
    }
  });

  useEffect(() => {
    if (isRunning && ballRef.current) {
      ballRef.current.position.y = 3;
    }
  }, [isRunning]);

  return (
    <group>
      {/* Ground */}
      <mesh position={[0, -2.5, 0]}>
        <boxGeometry args={[10, 0.1, 10]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      {/* Falling ball */}
      <mesh ref={ballRef} position={[0, 3, 0]} onClick={() => setIsRunning(!isRunning)}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.2} />
      </mesh>

      {/* Measurement grid */}
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={i} position={[0, i - 2.5, -2]}>
          <boxGeometry args={[0.1, 0.02, 0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </group>
  );
};

export const InteractiveLab = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState("coding");
  const [selectedChallenge, setSelectedChallenge] = useState<CodeChallenge | null>(null);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [userCode, setUserCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }>>([]);
  const [experimentParams, setExperimentParams] = useState<any>({});

  const codeChallenges: CodeChallenge[] = [
    {
      id: "fibonacci",
      title: "Fibonacci Sequence",
      description: "Write a function to generate the nth Fibonacci number",
      difficulty: "Easy",
      language: "JavaScript",
      starterCode: `function fibonacci(n) {\n  // Your code here\n  \n}`,
      solution: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
      testCases: [
        { input: "0", expected: "0", description: "fibonacci(0) should return 0" },
        { input: "1", expected: "1", description: "fibonacci(1) should return 1" },
        { input: "5", expected: "5", description: "fibonacci(5) should return 5" }
      ]
    },
    {
      id: "binary-search",
      title: "Binary Search",
      description: "Implement binary search algorithm",
      difficulty: "Medium",
      language: "JavaScript",
      starterCode: `function binarySearch(arr, target) {\n  // Your code here\n  \n}`,
      solution: `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      testCases: [
        { input: "[1,2,3,4,5], 3", expected: "2", description: "Should find element at index 2" },
        { input: "[1,2,3,4,5], 6", expected: "-1", description: "Should return -1 for missing element" }
      ]
    }
  ];

  const experiments: Experiment[] = [
    {
      id: "gravity",
      title: "Gravity Simulation",
      description: "Explore how gravity affects falling objects",
      type: "physics",
      parameters: [
        { name: "gravity", value: -9.8, min: -20, max: -1, step: 0.1 },
        { name: "mass", value: 1, min: 0.1, max: 10, step: 0.1 }
      ]
    },
    {
      id: "pendulum",
      title: "Pendulum Motion",
      description: "Study pendulum oscillations and period",
      type: "physics",
      parameters: [
        { name: "length", value: 2, min: 0.5, max: 5, step: 0.1 },
        { name: "angle", value: 30, min: 5, max: 90, step: 5 }
      ]
    }
  ];

  const handleRunCode = () => {
    if (!selectedChallenge) return;
    
    setIsRunning(true);
    
    // Simulate code execution and testing
    setTimeout(() => {
      const results = selectedChallenge.testCases.map((testCase, index) => {
        // Simple simulation - in real app, you'd execute the code
        const passed = userCode.includes("return") && userCode.length > 50;
        return {
          passed,
          message: passed ? `Test ${index + 1} passed` : `Test ${index + 1} failed: ${testCase.description}`
        };
      });
      
      setTestResults(results);
      setIsRunning(false);
    }, 2000);
  };

  const handleSelectChallenge = (challenge: CodeChallenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.starterCode);
    setTestResults([]);
  };

  const handleSelectExperiment = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    const params: any = {};
    experiment.parameters.forEach(param => {
      params[param.name] = param.value;
    });
    setExperimentParams(params);
  };

  const updateExperimentParam = (paramName: string, value: number) => {
    setExperimentParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Interactive Learning Lab
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Practice coding challenges and conduct virtual experiments with real-time visualization
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coding">
            <Code className="w-4 h-4 mr-2" />
            Coding Lab
          </TabsTrigger>
          <TabsTrigger value="experiments">
            <Beaker className="w-4 h-4 mr-2" />
            Science Lab
          </TabsTrigger>
          <TabsTrigger value="collaboration">
            <Users className="w-4 h-4 mr-2" />
            Collaborate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Challenge List */}
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Coding Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {codeChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedChallenge?.id === challenge.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border/30 hover:border-primary/50'
                    }`}
                    onClick={() => handleSelectChallenge(challenge)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{challenge.title}</h4>
                      <Badge variant={
                        challenge.difficulty === "Easy" ? "default" :
                        challenge.difficulty === "Medium" ? "secondary" : "destructive"
                      }>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Code className="w-3 h-3 mr-1" />
                      {challenge.language}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Editor</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleRunCode}
                      disabled={!selectedChallenge || isRunning}
                      className="neon-glow"
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Code
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => selectedChallenge && setUserCode(selectedChallenge.starterCode)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedChallenge ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{selectedChallenge.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{selectedChallenge.description}</p>
                    </div>
                    
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="font-mono text-sm min-h-[200px] bg-black/50"
                      placeholder="Write your code here..."
                    />

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-semibold">Test Results:</h5>
                        {testResults.map((result, index) => (
                          <div key={index} className={`flex items-center space-x-2 text-sm p-2 rounded ${
                            result.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                            <span>{result.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a challenge to start coding
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3D Visualization */}
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Code Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg overflow-hidden border border-border/30">
                  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                    <CodeVisualization code={userCode} isRunning={isRunning} />
                  </Canvas>
                </div>
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Visual representation of your code execution
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Experiment List */}
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Beaker className="w-5 h-5 mr-2" />
                  Virtual Experiments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {experiments.map((experiment) => (
                  <div
                    key={experiment.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedExperiment?.id === experiment.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border/30 hover:border-primary/50'
                    }`}
                    onClick={() => handleSelectExperiment(experiment)}
                  >
                    <h4 className="font-semibold mb-2">{experiment.title}</h4>
                    <p className="text-sm text-muted-foreground">{experiment.description}</p>
                    <Badge variant="outline" className="mt-2">
                      {experiment.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Parameter Controls */}
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle>Experiment Controls</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedExperiment ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold">{selectedExperiment.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedExperiment.description}</p>
                    
                    {selectedExperiment.parameters.map((param) => (
                      <div key={param.name} className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium capitalize">{param.name}</label>
                          <span className="text-sm text-muted-foreground">
                            {experimentParams[param.name] || param.value}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={experimentParams[param.name] || param.value}
                          onChange={(e) => updateExperimentParam(param.name, parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    ))}
                    
                    <Button className="w-full neon-glow">
                      <Play className="w-4 h-4 mr-2" />
                      Run Experiment
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select an experiment to begin
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3D Experiment Visualization */}
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Live Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg overflow-hidden border border-border/30">
                  <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
                    {selectedExperiment && (
                      <PhysicsExperiment 
                        experiment={selectedExperiment} 
                        parameters={experimentParams} 
                      />
                    )}
                  </Canvas>
                </div>
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  {selectedExperiment 
                    ? "Click the object to start the simulation" 
                    : "Select an experiment to see the simulation"
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Active Study Groups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">JavaScript Fundamentals</h4>
                    <Badge className="bg-green-500">4 members</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Working on array methods and async programming
                  </p>
                  <Button size="sm" className="w-full">Join Group</Button>
                </div>
                
                <div className="p-4 border border-border/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Physics Lab Partners</h4>
                    <Badge className="bg-blue-500">2 members</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Exploring quantum mechanics simulations
                  </p>
                  <Button size="sm" variant="outline" className="w-full">Join Group</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Peer Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 border border-dashed border-border/50 rounded-lg">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-semibold mb-2">Start Collaborative Session</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Invite friends to work on challenges together in real-time
                  </p>
                  <Button className="neon-glow">
                    Create Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};