
import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary, ProtocolInputs } from "../types";

// generateItinerary creates a structured health itinerary using Gemini 3 Pro with search grounding.
export const generateItinerary = async (inputs: ProtocolInputs): Promise<Itinerary> => {
  // Always initialize GoogleGenAI inside the function to capture the current API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Architect a "Longevity & Biological Performance" itinerary for an ultra-high-net-worth individual.
    Location: ${inputs.destination}
    Dates: ${inputs.startDate} to ${inputs.endDate}
    Biological Goal: ${inputs.biologicalGoal}
    Target Medical Protocol: ${inputs.medicalProtocol}
    Luxury Tier: ${inputs.luxuryTier}
    Custom Requirements: ${inputs.specificNeeds.join(', ')}

    CRITICAL INSTRUCTIONS:
    1. CLINICAL SCOUTING: Use Google Search to find REAL, top-tier longevity clinics, bio-hacking centers, or private medical facilities in ${inputs.destination}.
    2. BIO-IMPACT: For every activity, specify the "biological_impact" (e.g., "Autophagy promotion", "Vagal tone optimization").
    3. BIOLOGICAL LOAD: Assign a "biological_load" score from -10 (highly restorative/sleeping) to +10 (medical procedure/high stress protocol).
    4. LUXURY IMMERSION: Balance medical protocols with ultra-exclusive cultural experiences.
    5. VERIFICATION: You MUST include the website (verification_url) for every clinical facility suggested.
    6. DATA STRUCTURE: Categorize activities as 'Protocol' (Medical), 'Recovery' (Spa/Biohack), 'Immersion' (Cultural), or 'Nourishment' (Dietary).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are AuraNodes AI, the world's premier biological travel strategist. 
        You specialize in "Cellular Tourism" for HNWIs. Your mission is to design itineraries that extend life-span. 
        Always grounding your suggestions in real-world high-end medical data. Output strictly JSON matching the response schema.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itinerary_name: { type: Type.STRING },
            destination: { type: Type.STRING },
            biological_goal: { type: Type.STRING },
            cellular_optimization_score: { type: Type.NUMBER },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day_number: { type: Type.INTEGER },
                  date: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        activity: { type: Type.STRING },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                        cost_estimate: { type: Type.STRING },
                        clinical_grade: { type: Type.BOOLEAN },
                        duration_mins: { type: Type.INTEGER },
                        type: { type: Type.STRING, enum: ['Protocol', 'Recovery', 'Immersion', 'Nourishment'] },
                        biological_impact: { type: Type.STRING },
                        biological_load: { type: Type.NUMBER },
                        suitability_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        verification_url: { type: Type.STRING }
                      },
                      required: ["time", "activity", "location", "description", "type", "biological_impact", "biological_load"]
                    }
                  }
                }
              }
            },
            longevity_hacks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["itinerary_name", "cellular_optimization_score", "days"]
        },
      },
    });

    // Handle search-grounded responses which may include conversational text outside the JSON.
    const textOutput = response.text || "";
    const jsonStart = textOutput.indexOf('{');
    const jsonEnd = textOutput.lastIndexOf('}') + 1;
    const jsonStr = jsonStart !== -1 && jsonEnd !== -1 ? textOutput.substring(jsonStart, jsonEnd) : textOutput;
    const data = JSON.parse(jsonStr);
    
    // Extract grounding URLs for required web app display.
    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Medical Source',
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];

    return {
      ...data,
      id: `aura_${Math.random().toString(36).substr(2, 9)}`,
      grounding_sources: groundingSources
    };
  } catch (error) {
    console.error("AuraNodes Engine Error:", error);
    throw error;
  }
};
