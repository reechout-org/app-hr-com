"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Mic, PhoneOff, AlertCircle } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

import { Orb as NewOrb } from "@/components/ui/orb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

export type AgentState = "speaking" | "listening" | "thinking" | "connecting" | "idle" | null;

// Map our internal agent state to the NewOrb component's expected states
function mapOrbState(state: AgentState): "talking" | "listening" | "thinking" | null {
  switch (state) {
    case "speaking": return "talking";
    case "listening": return "listening";
    case "thinking":
    case "connecting": return "thinking";
    case "idle":
    default: return null;
  }
}

// In the Angular version, the API returns these fields specifically for the agent flow
interface AssistantData {
  status: string;
  schedule_date: string | null;
  assistant_id: string | null;
  vapi_public_key: string | null;
}

interface AgentPageProps {
  params: Promise<{ id: string }>;
}

export default function WebVoiceAgentPage({ params }: AgentPageProps) {
  const { id: candidateId } = use(params);
  const router = useRouter();

  // State
  const [buttonText, setButtonText] = useState("Start Interview");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [orbAgentState, setOrbAgentState] = useState<AgentState>("idle");
  const [countdownText, setCountdownText] = useState("");
  const [isFutureDate, setIsFutureDate] = useState(false);

  // Vapi refs
  const vapiRef = useRef<Vapi | null>(null);

  // Fetch the configuration using candidate ID exactly as angular does
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["agent-data", candidateId],
    queryFn: async () => {
      // Note: Assumes /api/interviews/candidates/{candidateId}/assistant/ exists
      const res = await fetch(`/api/interviews/candidates/${candidateId}/assistant/`);
      if (!res.ok) throw new Error("Failed to load interview. Please try again.");
      const json = await res.json();
      return json.data as AssistantData;
    },
    enabled: !!candidateId,
    retry: false
  });

  // Effect to handle Vapi lifecycle and countdown logic
  useEffect(() => {
    if (!data) return;

    let countdownInterval: NodeJS.Timeout;

    if (data.schedule_date) {
      const interviewDate = new Date(data.schedule_date);
      const now = new Date();
      const future = interviewDate > now;
      setIsFutureDate(future);

      if (future) {
        // Run Countdown
        const updateCountdown = () => {
          const currentTime = new Date().getTime();
          const diff = interviewDate.getTime() - currentTime;

          if (diff <= 0) {
            clearInterval(countdownInterval);
            setIsFutureDate(false);
            refetch(); // Time arrived, re-fetch to get keys
            return;
          }

          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);

          setCountdownText(`${d}d ${h}h ${m}m ${s}s`);
        };

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
      } else {
        // Initialize Vapi since time is now
        if (data.vapi_public_key && !vapiRef.current) {
          initVapi(data.vapi_public_key);
        }
      }
    } else {
      // No schedule date, init immediately
      if (data.vapi_public_key && !vapiRef.current) {
        initVapi(data.vapi_public_key);
      }
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [data]);

  // Clean up Vapi on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  const initVapi = (publicKey: string) => {
    try {
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setIsConnecting(false);
        setIsConnected(true);
        setButtonText("End Interview");
        setOrbAgentState("listening"); // Starting state once connected
      });

      vapi.on("call-end", () => {
        setIsConnecting(false);
        setIsConnected(false);
        setButtonText("Interview Ended");
        setOrbAgentState(null);
      });

      vapi.on("message", (msg) => {
        // Track the agent's vocal status
        if (msg.type === "transcript" && msg.role === "assistant") {
           // We could use transcript type, but speech-update is usually better for states
        }
      });

      vapi.on("speech-start", () => {
        setOrbAgentState("speaking");
      });

      vapi.on("speech-end", () => {
        setOrbAgentState("listening");
      });

      // Optionally track errors
      vapi.on("error", (e) => {
        console.error("Vapi Error:", e);
        setIsConnecting(false);
        setButtonText("Connection Error");
        toast.error("Voice Agent Error", { description: "Failed to connect to the audio stream." });
      });

    } catch (e) {
      console.error("Failed to initialize Vapi", e);
    }
  };

  const toggleCall = async () => {
    if (!vapiRef.current || !data?.assistant_id) {
      toast.error("Not Ready", { description: "The assistant configuration is not loaded yet." });
      return;
    }

    if (isConnected) {
      // End the call
      vapiRef.current.stop();
      setIsConnected(false);
      setOrbAgentState("idle");
      setButtonText("Interview Ended");
    } else {
      // Start the call
      try {
        setIsConnecting(true);
        setButtonText("Connecting...");
        setOrbAgentState("connecting");
        
        // Pass the candidate_id down so Vapi knows who is talking
        await vapiRef.current.start(data.assistant_id, {
          variableValues: {
            candidate_id: candidateId,
          }
        });
      } catch (err) {
        console.error("Error starting Vapi call:", err);
        setIsConnecting(false);
        setOrbAgentState("idle");
        setButtonText("Start Interview");
        toast.error("Failed to Start", { description: "Could not start the audio stream. Please check your microphone permissions." });
      }
    }
  };

  if (isLoading) {
    return null;
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background-color)]">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[var(--surface-1)] border border-[var(--error-color)]/30 text-center flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-[var(--error-color)]" />
          <h2 className="text-xl font-bold text-foreground">Failed to Load</h2>
          <p className="text-muted-foreground">The interview configuration could not be loaded. Please ensure your link is valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background-color)] relative selection:bg-[var(--primary-color)]/30 overflow-hidden">
      {/* Decorative ambient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-color-rgb),0.05),transparent_70%)]" />

      {/* Main UI Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        
        <div className="w-full max-w-[800px] flex flex-col items-center p-8 sm:p-12 rounded-[32px] bg-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/5 shadow-2xl backdrop-blur-xl relative">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--primary-color)]/20">
              AI Phone Interview
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">ReechOut AI Assistant</h1>
            <p className="text-[16px] text-muted-foreground max-w-lg mx-auto">
              {isFutureDate 
                ? "Your interview is scheduled to begin shortly." 
                : "When you are ready, click start and allow microphone permissions to begin your interview."}
            </p>
          </div>

          {/* Orb Container */}
          <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] mb-12 flex items-center justify-center">
            {/* Pulsing ring behind the orb */}
            {isConnected && (
              <div className="absolute inset-0 rounded-full border-2 border-[var(--primary-color)]/20 animate-ping opacity-50 scale-[1.15]" />
            )}
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)] border border-[var(--border-color-light)] dark:border-white/5 shadow-inner opacity-20" />
            
            {/* New 3D Glowing Orb */}
            <div className="w-[85%] h-[85%] relative z-10">
              <NewOrb 
                agentState={mapOrbState(orbAgentState)} 
                colors={["#611f69", "#a76abc"]} 
              />
            </div>
          </div>

          {/* Interaction Area */}
          <div className="flex flex-col items-center w-full max-w-md">
            
            {isFutureDate ? (
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-color-light)] dark:border-white/5 w-full text-center">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Starts In</span>
                <span className="text-3xl font-black text-[var(--primary-color)] tracking-tight tabular-nums">
                  {countdownText}
                </span>
                <span className="text-sm text-muted-foreground mt-1">Please wait for the timer to complete to connect.</span>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={toggleCall}
                disabled={isConnecting || (!isConnected && (!data.assistant_id || !data.vapi_public_key))}
                className={cn(
                  "w-full h-16 rounded-2xl text-[18px] font-bold shadow-lg transition-all duration-300",
                  isConnected 
                    ? "bg-[var(--error-color)] hover:bg-[var(--error-color)]/90 text-white shadow-[var(--error-color)]/20" 
                    : "bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-hover)] hover:opacity-90 text-white shadow-[var(--primary-color)]/30"
                )}
              >
                {isConnecting ? (
                  <div className="flex items-center gap-3">
                    {buttonText}
                  </div>
                ) : isConnected ? (
                  <div className="flex items-center gap-3">
                    <PhoneOff className="w-5 h-5" />
                    {buttonText}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5" />
                    {buttonText}
                  </div>
                )}
              </Button>
            )}

            {/* Status Text Indicator */}
            {isConnected && (
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]",
                  orbAgentState === "speaking" ? "bg-[var(--primary-color)] text-[var(--primary-color)] animate-pulse" : 
                  orbAgentState === "listening" ? "bg-[var(--success-color)] text-[var(--success-color)]" : 
                  "bg-[var(--warning-color)] text-[var(--warning-color)]"
                )} />
                {orbAgentState === "speaking" ? "Agent is speaking..." : 
                 orbAgentState === "listening" ? "Listening..." : "Thinking..."}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}